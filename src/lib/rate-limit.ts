/**
 * Login throttling.
 *
 * The governing constraint is not brute force. It is that this panel is the
 * only way to correct a wrong contract address, so a limiter that can refuse
 * the owner is itself an attack: hold the door shut while the homepage tells
 * strangers where to send money. An earlier version of this file counted every
 * attempt, correct ones included, against a shared ceiling — twenty-one
 * requests from anyone, and the owner was locked out of their own emergency
 * control for as long as the attacker cared to keep going.
 *
 * So: only failures are counted, and the count is consulted before the password
 * is checked but never allowed to override a correct one. Someone who does not
 * know the password can only ever fail, and stays limited. Someone who does
 * know it always gets in.
 *
 * What actually stops guessing is underneath this file: scrypt costs about a
 * tenth of a second per attempt and holds that cost even on a cold instance
 * with no memory of the last one, and the password is at least sixteen
 * generated characters. The counters here are a courtesy on top of that, not
 * the thing standing between an attacker and the address.
 */

import { BACKEND, kvGet, kvIncrementWithin } from "@/lib/kv";

if (typeof window !== "undefined") {
  throw new Error("lib/rate-limit is server-only.");
}

/** Failures from one client before that client is turned away. */
const PER_CLIENT = { limit: 8, windowSeconds: 15 * 60 };

/**
 * Failures from everyone. This one only slows requests down; it must never
 * refuse, because a distributed attacker would otherwise be able to close the
 * panel to its owner. The delay is enough to make bulk guessing tedious and
 * short enough to be invisible to a person typing one password.
 */
const GLOBAL = { softLimit: 20, windowSeconds: 60 * 60, maxDelayMs: 2000 };

/**
 * Used only when there is no store at all — which, per `kv.ts`, means a
 * serverless deployment with nothing configured. A module-level map counts one
 * instance's requests rather than the deployment's, so it is close to
 * worthless there; it is kept because it is strictly better than nothing, and
 * because in that configuration the panel cannot write anything anyway.
 */
const memory = new Map<string, { count: number; expiresAt: number }>();

function memoryIncrement(key: string, windowSeconds: number): number {
  const now = Date.now();
  const current = memory.get(key);

  if (!current || current.expiresAt <= now) {
    memory.set(key, { count: 1, expiresAt: now + windowSeconds * 1000 });
    return 1;
  }

  current.count += 1;
  return current.count;
}

function memoryRead(key: string): number {
  const current = memory.get(key);
  if (!current || current.expiresAt <= Date.now()) return 0;
  return current.count;
}

async function increment(key: string, windowSeconds: number): Promise<number> {
  if (BACKEND === "none") return memoryIncrement(key, windowSeconds);
  return kvIncrementWithin(key, windowSeconds);
}

async function read(key: string): Promise<number> {
  if (BACKEND === "none") return memoryRead(key);
  return Number(await kvGet(key)) || 0;
}

/** Keeps raw addresses out of store keys, which are easier to read than to protect. */
function hash(value: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < value.length; i += 1) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(36);
}

function clientCounterKey(client: string): string {
  return `login_fail_${hash(client)}`;
}

const GLOBAL_KEY = "login_fail_global";

export interface RateVerdict {
  ok: boolean;
  message?: string;
}

/**
 * Consulted before the password is checked. Only the per-client count can
 * refuse; the global count is paid as a delay instead, so no volume of
 * failures from strangers can shut the owner out.
 *
 * A store failure refuses. Failing open on a login check would let an attacker
 * switch the limiter off by knocking the store over — and unlike the lockout
 * this file exists to avoid, that refusal clears the moment the store is back.
 */
export async function checkLoginAllowed(client: string): Promise<RateVerdict> {
  try {
    const [failures, globalFailures] = await Promise.all([
      read(clientCounterKey(client)),
      read(GLOBAL_KEY),
    ]);

    if (failures >= PER_CLIENT.limit) {
      return { ok: false, message: "Too many attempts. Try again later." };
    }

    if (globalFailures > GLOBAL.softLimit) {
      const over = globalFailures - GLOBAL.softLimit;
      await new Promise((resolve) =>
        setTimeout(resolve, Math.min(over * 100, GLOBAL.maxDelayMs)),
      );
    }

    return { ok: true };
  } catch {
    return {
      ok: false,
      message: "The store is unreachable, so sign-in is closed until it is back.",
    };
  }
}

/** Counted only on a wrong password, so a correct one can never be throttled. */
export async function recordLoginFailure(client: string): Promise<void> {
  try {
    await Promise.all([
      increment(clientCounterKey(client), PER_CLIENT.windowSeconds),
      increment(GLOBAL_KEY, GLOBAL.windowSeconds),
    ]);
  } catch {
    // The attempt was already refused; losing the tally is not worth a 500.
  }
}
