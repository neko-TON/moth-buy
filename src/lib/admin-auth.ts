/**
 * Authentication for the one page that can change where visitors send money.
 *
 * The panel does not exist unless it is configured. With no password set, or
 * one shorter than `MIN_PASSWORD_LENGTH`, `/admin` returns the same 404 as any
 * other missing route — there is no login form to attack, and no default
 * credential shipped in the repository waiting to be found.
 *
 * Sessions are signed, not stored: the cookie carries an expiry and a nonce
 * with an HMAC over both, and the signature is checked before the contents are
 * parsed. Signed tokens cannot normally be revoked, which would make a stolen
 * laptop permanent — so each one also carries an epoch that is read from the
 * store and bumped on logout. One extra lookup, on admin requests only, buys
 * "sign out everywhere" without a redeploy.
 */

import { createHmac, randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies, headers } from "next/headers";
import { kvGet, kvSet } from "@/lib/kv";

if (typeof window !== "undefined") {
  throw new Error("lib/admin-auth is server-only.");
}

const scryptAsync = promisify(scrypt) as (
  password: string,
  salt: Buffer,
  keylen: number,
) => Promise<Buffer>;

const PASSWORD = process.env.ADMIN_PASSWORD ?? "";
const SECRET = process.env.ADMIN_SESSION_SECRET ?? "";

/**
 * Long enough that the only realistic way to produce one is to generate it.
 * A password a human invents is the weakest part of a design like this, and
 * there is no usability cost here: it is typed a handful of times a year, from
 * a password manager.
 */
export const MIN_PASSWORD_LENGTH = 16;
const MIN_SECRET_LENGTH = 32;

export const IS_CONFIGURED =
  PASSWORD.length >= MIN_PASSWORD_LENGTH && SECRET.length >= MIN_SECRET_LENGTH;

/** Why the panel is switched off, for the developer running it locally. */
export function configurationProblem(): string | null {
  if (IS_CONFIGURED) return null;
  if (!PASSWORD) return "ADMIN_PASSWORD is not set.";
  if (PASSWORD.length < MIN_PASSWORD_LENGTH) {
    return `ADMIN_PASSWORD must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
  if (!SECRET) return "ADMIN_SESSION_SECRET is not set.";
  return `ADMIN_SESSION_SECRET must be at least ${MIN_SECRET_LENGTH} characters.`;
}

const IS_PROD = process.env.NODE_ENV === "production";

/**
 * The `__Host-` prefix binds the cookie to this exact origin and forbids a
 * `Domain` attribute, so nothing on a neighbouring subdomain can plant one.
 * It requires `Secure`, hence the plain name over http in development.
 */
export const COOKIE_NAME = IS_PROD ? "__Host-moth_admin" : "moth_admin";

/** Short. One login lasts as long as the job it was opened for. */
const SESSION_SECONDS = 30 * 60;

const KEY_EPOCH = "moth_session_epoch";

/* ---------------------------------------------------------------- password */

const salt = createHmac("sha256", SECRET).update("moth:pw:v1").digest();

/**
 * Derived once per instance for the configured password, on demand for each
 * attempt. scrypt is the point: it costs roughly a tenth of a second, which is
 * invisible to the one person who logs in and ruinous to anyone guessing —
 * and unlike a counter, that cost holds even when a request lands on a fresh
 * instance with no memory of the last one.
 */
let expectedKey: Promise<Buffer> | null = null;

export async function passwordMatches(submitted: string): Promise<boolean> {
  if (!IS_CONFIGURED) return false;

  expectedKey ??= scryptAsync(PASSWORD, salt, 64);

  const [expected, given] = await Promise.all([
    expectedKey,
    scryptAsync(submitted, salt, 64),
  ]);

  // Equal lengths by construction, so this cannot throw and leak a length.
  return timingSafeEqual(expected, given);
}

/* ----------------------------------------------------------------- session */

function signToken(payload: string): string {
  return createHmac("sha256", SECRET).update(payload).digest("base64url");
}

/**
 * Signed like everything else in the store, and for a specific reason: this is
 * the value that decides whether a session is still valid. Left raw, anyone who
 * could write to the store could rewrite it on a loop, and the owner would be
 * able to sign in forever without ever holding a session — the one asset that
 * lets them correct the address would be the one asset left unprotected.
 *
 * An unverifiable value reads as the default rather than as a wall, so tampering
 * degrades to "no revocation" instead of "nobody can ever sign in".
 */
async function currentEpoch(): Promise<string> {
  const raw = await kvGet(KEY_EPOCH);
  if (!raw) return "0";

  const dot = raw.lastIndexOf(".");
  if (dot <= 0) return "0";

  const value = raw.slice(0, dot);
  const expected = Buffer.from(signToken(`epoch:${value}`));
  const given = Buffer.from(raw.slice(dot + 1));
  if (expected.length !== given.length) return "0";

  return timingSafeEqual(expected, given) ? value : "0";
}

export async function bumpEpoch(): Promise<void> {
  const value = randomBytes(8).toString("hex");
  await kvSet(KEY_EPOCH, `${value}.${signToken(`epoch:${value}`)}`);
}

export async function issueSession(): Promise<void> {
  const payload = JSON.stringify({
    exp: Math.floor(Date.now() / 1000) + SESSION_SECONDS,
    epoch: await currentEpoch(),
    nonce: randomBytes(16).toString("base64url"),
  });

  const encoded = Buffer.from(payload).toString("base64url");
  const token = `${encoded}.${signToken(encoded)}`;

  (await cookies()).set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_SECONDS,
  });
}

/**
 * An expiring `set`, not `delete`. Next's cookie `delete` emits the removal
 * without `Secure`, and a browser must ignore a `Set-Cookie` for a `__Host-`
 * name whose secure flag is off — so the deletion is discarded and the live
 * session cookie stays in the jar. The bug only appears in production, where
 * the prefix is used, which is exactly where it matters.
 */
export async function clearSession(): Promise<void> {
  (await cookies()).set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
}

/**
 * The signature is verified before anything inside the token is believed —
 * an expiry read out of an unverified payload is an expiry the attacker chose.
 */
export async function hasValidSession(): Promise<boolean> {
  if (!IS_CONFIGURED) return false;

  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return false;

  const dot = token.lastIndexOf(".");
  if (dot <= 0) return false;

  const encoded = token.slice(0, dot);
  const expected = Buffer.from(signToken(encoded));
  const given = Buffer.from(token.slice(dot + 1));
  if (expected.length !== given.length) return false;
  if (!timingSafeEqual(expected, given)) return false;

  try {
    const claims: { exp?: number; epoch?: string } = JSON.parse(
      Buffer.from(encoded, "base64url").toString("utf8"),
    );

    if (typeof claims.exp !== "number") return false;
    if (claims.exp <= Math.floor(Date.now() / 1000)) return false;

    return claims.epoch === (await currentEpoch());
  } catch {
    return false;
  }
}

/* -------------------------------------------------------------------- CSRF */

/**
 * Next refuses cross-origin Server Action requests already, but it lets a
 * request with no `Origin` header through with a warning rather than a refusal
 * (see `isCsrfOriginAllowed` in next/dist/server/app-render/action-handler.js).
 * These actions are worth the stricter rule: no origin, no write.
 */
export async function assertSameOrigin(): Promise<void> {
  const incoming = await headers();
  const origin = incoming.get("origin");
  const host = incoming.get("host");

  if (!origin || !host) throw new Error("Request refused.");

  let originHost: string;
  try {
    originHost = new URL(origin).host;
  } catch {
    throw new Error("Request refused.");
  }

  if (originHost.toLowerCase() !== host.toLowerCase()) {
    throw new Error("Request refused.");
  }
}

/**
 * Every action calls this first. A check on the page protects the page; the
 * action is a POST endpoint of its own and is reachable without ever rendering
 * it, which Next's own security guidance says twice.
 */
export async function requireAdmin(): Promise<void> {
  await assertSameOrigin();
  if (!(await hasValidSession())) throw new Error("Not signed in.");
}

/**
 * Client identity for the rate limiter.
 *
 * `x-real-ip` first: Vercel sets it from the connection itself. The leftmost
 * element of `x-forwarded-for` is whatever the client sent, so a caller can
 * hand out a fresh identity per request — it is the fallback, not the
 * preference, and nothing security-critical rests on either.
 */
export async function clientKey(): Promise<string> {
  const incoming = await headers();
  const real = incoming.get("x-real-ip")?.trim();
  if (real) return real;

  const forwarded = incoming.get("x-forwarded-for") ?? "";
  return forwarded.split(",")[0]?.trim() || "unknown";
}
