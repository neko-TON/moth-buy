"use client";

import { useActionState, useState } from "react";
import { type SaveState, save } from "@/app/admin/actions";

const INITIAL: SaveState = { status: "idle" };

const ADDRESS_RE = /^0x[0-9a-fA-F]{40}$/;

/**
 * Breaks the string into groups of four so it can be read against another
 * source. An unbroken run of forty hex characters is the sort of thing eyes
 * slide over, and sliding over it is exactly the mistake this panel makes
 * expensive.
 */
function grouped(value: string): string {
  // Chunk the forty hex characters, not the string — grouping from the "0x"
  // offsets every group by two against how BscScan and MetaMask show the same
  // address, which is the comparison this preview exists to support.
  const body = value.startsWith("0x") ? value.slice(2) : value;
  const chunks = body.replace(/(.{4})/g, "$1 ").trim();
  return value.startsWith("0x") ? `0x ${chunks}` : chunks;
}

export interface PastValue {
  value: string;
  updatedAt: string;
}

export function AddressForm({
  current,
  history,
}: {
  current: string;
  history: PastValue[];
}) {
  const [state, formAction, pending] = useActionState(save, INITIAL);
  const [draft, setDraft] = useState(current);

  const typed = draft.trim();
  const looksLikeAddress = ADDRESS_RE.test(typed);
  const changed = typed !== current;

  return (
    <form action={formAction} className="mt-6">
      <label
        htmlFor="value"
        className="block text-sm font-semibold text-heading"
      >
        Contract address
      </label>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-mute-2">
        Paste the address and publish. Anything that is not a valid BNB Smart
        Chain address is still shown on the page, but the BscScan, PancakeSwap
        and buy links stay switched off until it is one — so a placeholder like{" "}
        <code className="font-mono text-mute-1">test</code> is safe to try.
      </p>

      <input
        id="value"
        name="value"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        spellCheck={false}
        autoComplete="off"
        placeholder="0x…"
        className="mt-4 w-full rounded-xl border border-edge-strong bg-ink-deep px-4 py-3 font-mono text-base break-all text-heading outline-none focus-visible:border-accent/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      />

      {typed !== "" && (
        <div className="mt-4 rounded-xl border border-edge bg-ink-deep p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-mute-4">
            {changed ? "Will be published" : "Currently published"}
          </p>
          <code className="mt-2 block break-all font-mono text-sm text-heading">
            {grouped(typed)}
          </code>
          <p className="mt-3 text-sm text-mute-2">
            {looksLikeAddress
              ? "Valid address — links and on-chain figures will be live."
              : "Not a valid address — it will appear as plain text, with links off."}
          </p>
        </div>
      )}

      {/*
        The checkbox carries the address the SERVER asked about — `state.value`,
        echoed back with the prompt — and the server checks it still equals what
        is being published.

        Not the current draft: the field stays editable while this prompt is up
        and the ticked checkbox survives the re-render, so binding to the draft
        re-points the confirmation at whatever was typed last. Tick for one
        address, edit the field, publish a second one that nobody confirmed —
        which is exactly what happened when this was first written that way.
        Pinning it to the server's value makes an edit fall through to a fresh
        prompt instead.
      */}
      {state.status === "confirm" && state.value && (
        <label className="mt-4 flex items-start gap-3 rounded-xl border border-accent/50 bg-accent/5 p-4">
          {/*
            `key` is load-bearing. The box is uncontrolled, so React rewrites its
            `value` on re-render but leaves a user's tick alone — confirm A, edit
            the field to B, and the fresh prompt for B arrives already ticked,
            carrying an attestation made for A. Keying on the value remounts the
            box whenever the address changes, which unticks it.
          */}
          <input
            key={state.value}
            type="checkbox"
            name="confirmed_value"
            value={state.value}
            className="mt-1 size-4 shrink-0"
          />
          <span className="text-sm leading-6 text-heading">
            {state.message}
            <code className="mt-2 block break-all font-mono text-xs text-mute-1">
              {grouped(state.value)}
            </code>
          </span>
        </label>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={pending || typed === ""}
          className="btn-gold inline-flex min-h-12 items-center rounded-xl bg-accent px-7 font-semibold text-accent-ink transition-colors duration-300 hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-accent"
        >
          {pending ? "Publishing…" : changed ? "Publish" : "Republish"}
        </button>

        {/*
          Always mounted, even when empty. A live region inserted together with
          its text is not reliably announced — the screen reader has nothing to
          observe a change against — so someone pressing Publish would hear
          nothing at all and have no way to find out why nothing published.
        */}
        <p
          aria-live="polite"
          className={
            state.status === "error"
              ? "max-w-lg text-sm leading-6 text-accent"
              : "max-w-lg text-sm leading-6 text-mute-1"
          }
        >
          {state.status === "confirm"
            ? "Not published yet — tick the confirmation above, then publish again."
            : (state.message ?? "")}
        </p>
      </div>

      {/*
        Recovery, not bookkeeping. The failure this panel makes possible is
        publishing a wrong address; the fix has to be one click, not a search
        through a chat log for what the address used to be. Restoring loads the
        old value into the field above, so it goes through the same preview and
        the same confirmation as anything else.
      */}
      {history.length > 0 && (
        <section className="mt-10 border-t border-edge pt-6">
          <h3 className="text-sm font-semibold text-heading">Previous values</h3>
          <ul className="mt-4 divide-y divide-edge border-t border-edge">
            {history.map((entry) => (
              <li
                key={`${entry.updatedAt}-${entry.value}`}
                className="flex flex-wrap items-center gap-x-4 gap-y-2 py-3"
              >
                <code className="min-w-0 flex-1 break-all font-mono text-xs text-mute-1">
                  {entry.value}
                </code>
                <time
                  dateTime={entry.updatedAt}
                  className="text-xs tabular-nums text-mute-4"
                >
                  {entry.updatedAt.slice(0, 16).replace("T", " ")}
                </time>
                <button
                  type="button"
                  onClick={() => setDraft(entry.value)}
                  className="rounded-lg border border-edge-strong px-3 py-1.5 text-xs font-semibold text-mute-1 transition-colors duration-300 hover:border-accent/60 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  Restore
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </form>
  );
}
