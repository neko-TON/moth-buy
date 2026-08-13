/**
 * The one piece of mutable state this site has: a key-value store holding the
 * contract address the admin panel writes and the homepage reads.
 *
 * Two backends, chosen automatically:
 *
 *   redis — Upstash over its REST API, when the integration's variables are
 *           present. Plain `fetch`, no client library, so nothing is added to
 *           the dependency tree for it. This is the only backend that works on
 *           Vercel, because it is the only one that is shared between the many
 *           short-lived instances a request may land on.
 *
 *   file  — a JSON file under `.data/`, for `npm run dev` and for anyone
 *           self-hosting the standalone build on a machine with a real disk.
 *
 * When neither applies — deployed to a serverless platform with no store
 * configured — the backend is `none` and writes fail loudly. That case is a
 * misconfiguration, and the failure mode it replaces is worse than an error:
 * writing to a lambda's own `/tmp` would look like it worked, then reach
 * nobody and vanish at the next cold start.
 */

import { readFile, writeFile, mkdir, rename } from "node:fs/promises";
import path from "node:path";

if (typeof window !== "undefined") {
  throw new Error(
    "lib/kv is server-only — it holds the store credentials. Importing it " +
      "from a Client Component would ship them to the browser.",
  );
}

/* Both variable names are accepted: Vercel's Upstash integration injects the
   `KV_REST_API_*` pair, while a database created directly at upstash.com uses
   the `UPSTASH_*` pair. Same service either way. */
const REST_URL = (
  process.env.UPSTASH_REDIS_REST_URL ??
  process.env.KV_REST_API_URL ??
  ""
).replace(/\/+$/, "");

const REST_TOKEN =
  process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN ?? "";

/** True on Vercel and other platforms with an ephemeral, read-only disk. */
const IS_SERVERLESS = Boolean(process.env.VERCEL);

export type Backend = "redis" | "file" | "none";

export const BACKEND: Backend =
  REST_URL && REST_TOKEN ? "redis" : IS_SERVERLESS ? "none" : "file";

/** Thrown for a misconfiguration, not for a transient fault. */
export class NoStoreError extends Error {
  constructor() {
    super(
      "No shared store is configured. On Vercel: Storage → Create Database → " +
        "Upstash → Redis (free). The variables appear automatically and the " +
        "next deployment picks them up.",
    );
    this.name = "NoStoreError";
  }
}

/* ------------------------------------------------------------------ redis */

const authHeader = { Authorization: `Bearer ${REST_TOKEN}` };

/**
 * Writes and uncached reads go through Upstash's command endpoint: the command
 * travels in a POST body, which keeps the token and the value out of the URL —
 * and so out of anything that logs URLs.
 */
async function redisCommand(command: (string | number)[]): Promise<unknown> {
  const res = await fetch(REST_URL, {
    method: "POST",
    headers: { ...authHeader, "content-type": "application/json" },
    body: JSON.stringify(command),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Store returned ${res.status}`);
  }

  const body: { result?: unknown; error?: string } = await res.json();
  if (body.error) throw new Error(`Store error: ${body.error}`);
  return body.result ?? null;
}

/* ------------------------------------------------------------------- file */

const FILE = path.join(process.cwd(), ".data", "store.json");

type FileShape = Record<string, { value: string; expiresAt: number | null }>;

/**
 * Every file operation is a read-modify-write of one whole document, so two of
 * them overlapping lose one of the two writes. That is not hypothetical here:
 * the login limiter increments two counters concurrently, which raced itself
 * and could clobber the stored address — a login attempt by a stranger silently
 * reverting a publish, while the panel reported success.
 *
 * The file backend runs only in a single long-lived process (on Vercel the
 * backend is redis or none), so serialising in memory is a complete fix rather
 * than a partial one. Writes also go through a temp file and a rename, so a
 * crash mid-write cannot leave truncated JSON where the address used to be.
 */
let fileQueue: Promise<unknown> = Promise.resolve();

function withFileLock<T>(operation: () => Promise<T>): Promise<T> {
  const run = fileQueue.then(operation, operation);
  fileQueue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

async function fileRead(): Promise<FileShape> {
  try {
    return JSON.parse(await readFile(FILE, "utf8")) as FileShape;
  } catch {
    return {};
  }
}

async function fileWrite(data: FileShape): Promise<void> {
  // Expired counters are dropped here rather than left to accumulate: their
  // keys come from request headers, so nothing else would ever bound the file.
  const now = Date.now();
  for (const [key, entry] of Object.entries(data)) {
    if (entry.expiresAt !== null && entry.expiresAt <= now) delete data[key];
  }

  await mkdir(path.dirname(FILE), { recursive: true });
  const temporary = `${FILE}.${process.pid}.tmp`;
  await writeFile(temporary, JSON.stringify(data, null, 2), "utf8");
  await rename(temporary, FILE);
}

function live(entry: FileShape[string] | undefined, now: number) {
  if (!entry) return null;
  if (entry.expiresAt !== null && entry.expiresAt <= now) return null;
  return entry;
}

/* ------------------------------------------------------------------- API */

/**
 * A read that participates in the Data Cache under `tag`, so the value can be
 * held indefinitely and then dropped the instant an admin saves a new one.
 *
 * `cache: "force-cache"` is doing real work here and is not the default it
 * looks like. Next disables caching for any request carrying an `Authorization`
 * header — but only when the call passes no explicit cache config, so naming
 * the mode is what keeps this cacheable (see `hasNoExplicitCacheConfig` in
 * next/dist/server/lib/patch-fetch.js). Without it every visitor to a
 * regenerating page would cost a round trip to Upstash.
 *
 * Path-style GET rather than the command endpoint, because only GET and HEAD
 * are cacheable methods.
 */
export async function kvGetCached(
  key: string,
  tag: string,
): Promise<string | null> {
  if (BACKEND === "redis") {
    const res = await fetch(`${REST_URL}/get/${encodeURIComponent(key)}`, {
      headers: authHeader,
      cache: "force-cache",
      next: { tags: [tag] },
    });
    if (!res.ok) throw new Error(`Store returned ${res.status}`);
    const body: { result?: string | null } = await res.json();
    return body.result ?? null;
  }

  if (BACKEND === "file") {
    return withFileLock(async () =>
      live((await fileRead())[key], Date.now())?.value ?? null,
    );
  }

  return null;
}

/** An uncached read, for values that must never be a moment stale. */
export async function kvGet(key: string): Promise<string | null> {
  if (BACKEND === "redis") {
    const result = await redisCommand(["GET", key]);
    return typeof result === "string" ? result : null;
  }

  if (BACKEND === "file") {
    return withFileLock(async () =>
      live((await fileRead())[key], Date.now())?.value ?? null,
    );
  }

  return null;
}

export async function kvSet(key: string, value: string): Promise<void> {
  if (BACKEND === "none") throw new NoStoreError();

  if (BACKEND === "redis") {
    await redisCommand(["SET", key, value]);
    return;
  }

  await withFileLock(async () => {
    const data = await fileRead();
    data[key] = { value, expiresAt: null };
    await fileWrite(data);
  });
}

/**
 * Increment a counter that expires `ttlSeconds` after its first increment, and
 * return the new count. This is the primitive the login rate limiter is built
 * from, which is why the TTL is set with `NX` — a limiter whose window is
 * pushed forward by every new attempt never closes.
 */
export async function kvIncrementWithin(
  key: string,
  ttlSeconds: number,
): Promise<number> {
  if (BACKEND === "none") throw new NoStoreError();

  if (BACKEND === "redis") {
    const res = await fetch(`${REST_URL}/pipeline`, {
      method: "POST",
      headers: { ...authHeader, "content-type": "application/json" },
      body: JSON.stringify([
        ["INCR", key],
        ["EXPIRE", key, String(ttlSeconds), "NX"],
      ]),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Store returned ${res.status}`);
    const body: { result?: unknown; error?: string }[] = await res.json();
    const count = body[0]?.result;
    if (typeof count !== "number") throw new Error("Malformed store reply");
    return count;
  }

  return withFileLock(async () => {
    const now = Date.now();
    const data = await fileRead();
    const current = live(data[key], now);
    const count = current ? Number(current.value) + 1 : 1;
    data[key] = {
      value: String(count),
      expiresAt: current?.expiresAt ?? now + ttlSeconds * 1000,
    };
    await fileWrite(data);
    return count;
  });
}

export async function kvDelete(key: string): Promise<void> {
  if (BACKEND === "none") throw new NoStoreError();

  if (BACKEND === "redis") {
    await redisCommand(["DEL", key]);
    return;
  }

  await withFileLock(async () => {
    const data = await fileRead();
    delete data[key];
    await fileWrite(data);
  });
}

/** For the admin panel, which states plainly where it is writing. */
export function describeBackend(): { backend: Backend; detail: string } {
  switch (BACKEND) {
    case "redis":
      return {
        backend: "redis",
        detail:
          "Upstash Redis. Shared by every instance, so a save reaches all " +
          "visitors at once.",
      };
    case "file":
      return {
        backend: "file",
        detail:
          "A local file at .data/store.json. Fine for development; it does " +
          "not exist on the deployed site.",
      };
    default:
      return {
        backend: "none",
        detail:
          "No store is configured, so nothing can be saved. Add one in " +
          "Vercel: Storage → Create Database → Upstash → Redis (free tier).",
      };
  }
}
