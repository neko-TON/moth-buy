"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import {
  ADDRESS_TAG,
  check,
  clearStoredValue,
  getRecordFresh,
  isAddress,
  setStoredValue,
} from "@/lib/address-store";
import {
  IS_CONFIGURED,
  assertSameOrigin,
  bumpEpoch,
  clearSession,
  clientKey,
  hasValidSession,
  issueSession,
  passwordMatches,
  requireAdmin,
} from "@/lib/admin-auth";
import {
  checkLoginAllowed,
  clearLoginFailures,
  recordLoginFailure,
} from "@/lib/rate-limit";

/**
 * A Server Action is a POST endpoint in its own right, reachable without ever
 * loading the page that renders its form. Every one of these therefore repeats
 * the checks rather than trusting that `admin/page.tsx` ran them.
 */

export interface LoginState {
  error?: string;
}

export async function login(
  _previous: LoginState,
  formData: FormData,
): Promise<LoginState> {
  if (!IS_CONFIGURED) notFound();

  try {
    await assertSameOrigin();
  } catch {
    return { error: "Request refused." };
  }

  const client = await clientKey();

  const verdict = await checkLoginAllowed(client);
  if (!verdict.ok) return { error: verdict.message };

  const submitted = formData.get("password");
  if (typeof submitted !== "string" || !(await passwordMatches(submitted))) {
    // Counted only here, on the failure. A correct password is never thrown
    // away by a limiter — this panel is the only way to correct a wrong
    // address, so being able to lock its owner out would itself be the attack.
    await recordLoginFailure(client);

    // Deliberately identical whether the field was empty, the wrong type, or
    // simply wrong, and never echoing what was sent — this string ends up in
    // logs far more readable than the environment variable it guards.
    return { error: "Wrong password." };
  }

  await clearLoginFailures(client);
  await issueSession();
  redirect("/admin");
}

export async function logout(): Promise<void> {
  if (!IS_CONFIGURED) notFound();
  await assertSameOrigin();

  /**
   * Gated like `save`, because bumping the epoch is a privileged write: it
   * kills every live session. Ungated, a stranger could POST this on a loop and
   * the owner would be able to sign in repeatedly without ever holding a
   * session — the same shape of attack as the login lockout, aimed at the same
   * target. Checked before `clearSession`, which would otherwise remove the
   * cookie this reads.
   */
  if (await hasValidSession()) {
    await clearSession();
    try {
      // Invalidates every other session too, so a lost laptop is one click to fix.
      await bumpEpoch();
    } catch {
      // Best effort. This browser's cookie is already gone, and a store that
      // cannot be written must not turn a successful sign-out into a 500.
    }
  }

  redirect("/admin");
}

/**
 * Take the address down. No confirmation: this switches the buy links off
 * rather than on, so the failure direction is safe, and the previous value is
 * in the history if the takedown was itself the mistake.
 */
export async function clearAddress(): Promise<void> {
  if (!IS_CONFIGURED) notFound();
  await requireAdmin();

  await clearStoredValue();

  updateTag(ADDRESS_TAG);
  revalidatePath("/", "page");
}

export interface SaveState {
  status: "idle" | "saved" | "error" | "confirm";
  message?: string;
  /** Echoed back so the form can keep what was typed after a rejection. */
  value?: string;
}

export async function save(
  _previous: SaveState,
  formData: FormData,
): Promise<SaveState> {
  if (!IS_CONFIGURED) notFound();

  try {
    await requireAdmin();
  } catch {
    return { status: "error", message: "Session expired. Sign in again." };
  }

  const submitted = formData.get("value");
  if (typeof submitted !== "string") {
    return { status: "error", message: "Nothing was submitted." };
  }

  const verdict = check(submitted);
  if (!verdict.ok) {
    return { status: "error", message: verdict.reason, value: submitted };
  }

  const current = await getRecordFresh();

  /**
   * Re-publishing an unchanged value still purges.
   *
   * This comparison is against the store, not against what visitors are being
   * served, and those two can legitimately disagree — a write that lands while
   * the purge is lost leaves the store correct and the cached page stale. That
   * is precisely when the owner re-submits the right address to force it
   * through, so refusing to purge here disabled the only manual control at the
   * only moment it was needed. Both calls are idempotent, so doing them costs
   * nothing.
   */
  if (current?.value === verdict.value) {
    updateTag(ADDRESS_TAG);
    revalidatePath("/", "page");
    return {
      status: "saved",
      message:
        "Already the stored value — caches purged, so every visitor is served " +
        "it from their next page load.",
      value: verdict.value,
    };
  }

  /**
   * The one place friction is worth it: replacing an address that is already
   * live and already working. Setting the first value, or changing a
   * placeholder, goes straight through — but overwriting a real contract that
   * visitors are currently buying against is the change that costs money if it
   * is wrong, so it takes a deliberate second act.
   */
  const replacingLiveAddress =
    current !== null && isAddress(current.value) && verdict.isAddress;

  /**
   * The confirmation carries the exact string it was given for, and the server
   * checks that it still matches. A bare "yes" would confirm nothing: the field
   * stays editable while the prompt is up and the checkbox survives a re-render,
   * so it would be possible to tick the box for one address and publish
   * another — the box would be attesting to a value nobody ever looked at.
   */
  if (
    replacingLiveAddress &&
    formData.get("confirmed_value") !== verdict.value
  ) {
    return {
      status: "confirm",
      value: verdict.value,
      message:
        "This replaces a live contract address. Check it character by " +
        "character, then confirm.",
    };
  }

  try {
    await setStoredValue(verdict.value);
  } catch (error) {
    /**
     * Purge on the way out too. A write whose response was lost may well have
     * committed, and purging a write that did not land is harmless — the next
     * read simply fetches the same value again. Not purging after a write that
     * did land is what leaves the site stale.
     */
    updateTag(ADDRESS_TAG);
    revalidatePath("/", "page");

    return {
      status: "error",
      value: verdict.value,
      message:
        error instanceof Error ? error.message : "The store refused the write.",
    };
  }

  /**
   * Two caches hold the old value and purging one leaves the other stale: the
   * Data Cache entry for the store read, and the prerendered homepage that
   * `export const revalidate = 60` produces.
   *
   * `updateTag` rather than `revalidateTag` — the latter is now
   * stale-while-revalidate, which would hand the very next visitor the address
   * that was just replaced. Here that is the one outcome worth ruling out.
   */
  updateTag(ADDRESS_TAG);
  revalidatePath("/", "page");

  return {
    status: "saved",
    value: verdict.value,
    message: verdict.isAddress
      ? "Live. Every visitor sees this address from their next page load."
      : "Live, but this is not a valid BNB Smart Chain address — it is shown " +
        "on the page and the buy links stay switched off.",
  };
}
