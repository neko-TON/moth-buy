/**
 * The contract address, as a runtime value rather than a build-time constant.
 *
 * Two readers, and the split between them is the safety property of this file:
 *
 *   getStoredValue()  — whatever the owner typed, verbatim. Display only.
 *   getTokenAddress() — that same string, but `null` unless it is a real
 *                       BEP-20 address.
 *
 * Everything that can move money — the PancakeSwap link, the BscScan link, the
 * balance lookup, the chain reads — is wired to the second one. So a value like
 * "test" renders on the page and nothing else, and it is not possible for a
 * malformed or tampered string to end up inside a buy link. The old build-time
 * constant got that guarantee from a human reviewing a commit; this gets it
 * from the reader, which is stronger, because there is no longer a commit.
 *
 * Records are stored signed. A store credential on its own is then not enough
 * to change what visitors copy — an attacker holding the Upstash token can
 * write to the key, but an unsigned record is read as absent. The signing key
 * is `ADMIN_SESSION_SECRET`, which lives only in the app's own environment.
 */

import { createHmac, timingSafeEqual } from "node:crypto";
import { cache } from "react";
import { kvGet, kvGetCached, kvSet } from "@/lib/kv";

if (typeof window !== "undefined") {
  throw new Error("lib/address-store is server-only.");
}

/** Purged by the admin's save action; see `app/admin/actions.ts`. */
export const ADDRESS_TAG = "moth-address";

const KEY_ADDRESS = "moth_address";
const KEY_HISTORY = "moth_address_history";

const HISTORY_LIMIT = 8;

const SECRET = process.env.ADMIN_SESSION_SECRET ?? "";

export interface AddressRecord {
  /** Exactly what was typed. Not normalised. */
  value: string;
  /** ISO-8601, set by the server at save time. */
  updatedAt: string;
}

/* ------------------------------------------------------------- validation */

const ADDRESS_RE = /^0x[0-9a-fA-F]{40}$/;

export function isAddress(value: string): boolean {
  return ADDRESS_RE.test(value);
}

export type Check =
  | { ok: true; value: string; isAddress: boolean }
  | { ok: false; reason: string };

/**
 * Vets a submitted value. Outer whitespace is dropped, because that is what a
 * paste picks up and removing it cannot change which address you get.
 *
 * Nothing else is repaired. A Cyrillic "о" or a zero-width space inside an
 * address is rejected by name rather than quietly stripped: those characters
 * are how an address that looks right in review turns out to be a different
 * address, and the whole point of showing the owner this string is that they
 * can trust their eyes.
 */
export function check(input: string): Check {
  const value = input.trim();

  if (value === "") return { ok: false, reason: "Nothing was entered." };

  if (value.length > 128) {
    return { ok: false, reason: "Too long to be a contract address." };
  }

  const strange = [...value].find((ch) => ch < " " || ch > "~");
  if (strange !== undefined) {
    const code = strange.codePointAt(0)!.toString(16).padStart(4, "0");
    return {
      ok: false,
      reason:
        `Contains a non-ASCII character (U+${code.toUpperCase()}). ` +
        "Characters that merely look like letters are how a wrong address " +
        "passes a visual check — retype or re-copy it.",
    };
  }

  if (/\s/.test(value)) {
    return { ok: false, reason: "Contains a space." };
  }

  return { ok: true, value, isAddress: isAddress(value) };
}

/* ---------------------------------------------------------------- signing */

function sign(payload: string): string {
  return createHmac("sha256", SECRET).update(payload).digest("base64url");
}

function verify(payload: string, signature: string): boolean {
  const expected = Buffer.from(sign(payload));
  const given = Buffer.from(signature);
  if (expected.length !== given.length) return false;
  return timingSafeEqual(expected, given);
}

function seal(payload: unknown): string {
  const json = JSON.stringify(payload);
  return `${Buffer.from(json).toString("base64url")}.${sign(json)}`;
}

/** Returns the payload only if the signature over it checks out. */
function unseal(raw: string | null): unknown {
  if (!raw) return null;

  const dot = raw.lastIndexOf(".");
  if (dot <= 0) return null;

  const json = Buffer.from(raw.slice(0, dot), "base64url").toString("utf8");
  if (!verify(json, raw.slice(dot + 1))) return null;

  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/**
 * Shape is checked, not asserted. A cast would let a malformed entry through to
 * the admin panel's own recovery list, where a missing `updatedAt` throws while
 * rendering and takes down the page the owner came to fix the address on.
 */
function asRecord(candidate: unknown): AddressRecord | null {
  if (typeof candidate !== "object" || candidate === null) return null;
  const { value, updatedAt } = candidate as Partial<AddressRecord>;
  if (typeof value !== "string" || typeof updatedAt !== "string") return null;
  return { value, updatedAt };
}

/* ----------------------------------------------------------------- reading */

/**
 * `cache()` keeps this to one store read per render, so the several sections
 * that show the address agree with each other and cost one lookup between them.
 *
 * Failure resolves to `null` rather than throwing. A store outage should show
 * the honest "no address yet" state — the same thing the site showed before
 * launch — not take the page down, and not fail a build.
 */
export const getRecord = cache(async (): Promise<AddressRecord | null> => {
  if (!SECRET) return null;
  try {
    return asRecord(unseal(await kvGetCached(KEY_ADDRESS, ADDRESS_TAG)));
  } catch {
    return null;
  }
});

/** Whatever the owner typed, or "" — display only, never a link target. */
export async function getStoredValue(): Promise<string> {
  return (await getRecord())?.value ?? "";
}

/** A real BEP-20 address, lowercased, or `null`. The money path reads this. */
export async function getTokenAddress(): Promise<string | null> {
  const value = await getStoredValue();
  return isAddress(value) ? value.toLowerCase() : null;
}

/* ----------------------------------------------------------------- writing */

/** Bypasses the Data Cache — the admin panel must see the true current value. */
export async function getRecordFresh(): Promise<AddressRecord | null> {
  if (!SECRET) return null;
  return asRecord(unseal(await kvGet(KEY_ADDRESS)));
}

/**
 * Signed exactly like the live record, and for the same reason. Unsigned
 * history would have left the whole scheme bypassable through the owner:
 * anyone able to write to the store could plant a plausible "previous value",
 * and the panel offers a one-click Restore next to it. The signature would
 * still be applied on the way out, so a forged past becomes a genuine present.
 */
export async function getHistory(): Promise<AddressRecord[]> {
  try {
    const payload = unseal(await kvGet(KEY_HISTORY));
    if (!Array.isArray(payload)) return [];
    return payload
      .map(asRecord)
      .filter((entry): entry is AddressRecord => entry !== null);
  } catch {
    return [];
  }
}

/**
 * Writes the new value and prepends the previous one to a short history.
 *
 * The history is not bookkeeping. It is the recovery path: the failure this
 * panel makes possible is publishing a wrong address, and the fix for that has
 * to be one click at three in the morning, not a search through a chat log for
 * what the address used to be.
 */
export async function setStoredValue(value: string): Promise<AddressRecord> {
  const record: AddressRecord = { value, updatedAt: new Date().toISOString() };

  const previous = await getRecordFresh();
  if (previous && previous.value !== value) {
    const history = [previous, ...(await getHistory())].slice(0, HISTORY_LIMIT);
    await kvSet(KEY_HISTORY, seal(history));
  }

  await kvSet(KEY_ADDRESS, seal(record));
  return record;
}
