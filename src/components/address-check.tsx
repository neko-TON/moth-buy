"use client";

import { useState } from "react";

/**
 * Compares the address the visitor is about to use against the one on this
 * page, entirely in the browser.
 *
 * The expensive mistake on a token page is not being talked into anything — it
 * is pasting an address that differs from the right one in the middle, where
 * nobody looks. So this reports the position of the first differing character
 * rather than a verdict, because "these differ at character 12" is something a
 * person can act on and "no match" is not.
 *
 * It takes `expected` from the vetted reader, never the raw stored string: a
 * placeholder must not get a comparison widget, because a comparison implies
 * there is something to compare against.
 *
 * Nothing here is submitted, stored, or sent. That is stated in visible copy
 * rather than a tooltip, because on this page the claim is the point.
 */
const ADDRESS_RE = /^0x[0-9a-fA-F]{40}$/;

type Verdict =
  | { kind: "idle" }
  | { kind: "match" }
  | { kind: "case-only" }
  | { kind: "differs"; position: number }
  | { kind: "malformed" };

function compare(candidate: string, expected: string): Verdict {
  const typed = candidate.trim();
  if (typed === "") return { kind: "idle" };
  if (!ADDRESS_RE.test(typed)) return { kind: "malformed" };

  if (typed === expected) return { kind: "match" };

  const a = typed.toLowerCase();
  const b = expected.toLowerCase();

  // Capitalisation in an EVM address carries a checksum, not identity — two
  // spellings that differ only in case are the same token, and saying so is
  // more useful than flagging a difference the chain does not recognise.
  if (a === b) return { kind: "case-only" };

  for (let i = 0; i < Math.min(a.length, b.length); i += 1) {
    if (a[i] !== b[i]) return { kind: "differs", position: i + 1 };
  }
  return { kind: "differs", position: Math.min(a.length, b.length) + 1 };
}

const MESSAGES: Record<Verdict["kind"], (position: number) => string> = {
  idle: () => "",
  match: () => "Identical. Character for character.",
  "case-only": () =>
    "The same address in different capitalisation. Capitalisation in an address is a checksum, not part of the identity, so this is the same token.",
  differs: (position) =>
    `Different. The first character that differs is number ${position}.`,
  malformed: () => "That is not a 42-character address.",
};

export function AddressCheck({ expected }: { expected: string }) {
  const [typed, setTyped] = useState("");
  const verdict = compare(typed, expected);
  const message = MESSAGES[verdict.kind](
    verdict.kind === "differs" ? verdict.position : 0,
  );

  return (
    <div className="mt-8 border-t border-edge pt-8">
      <h3 className="text-base font-semibold text-heading">
        Check it against what your wallet shows.
      </h3>
      <p className="mt-2.5 max-w-xl text-sm leading-6 text-mute-2">
        The expensive mistake here is sending money to a token with a similar
        address. Paste what your wallet or your swap window is showing. The
        comparison happens inside this page. Nothing is sent anywhere.
      </p>

      <label
        htmlFor="address-check"
        className="mt-6 block text-xs font-semibold uppercase tracking-[0.18em] text-mute-4"
      >
        The address you are about to use
      </label>
      <input
        id="address-check"
        type="text"
        value={typed}
        onChange={(event) => setTyped(event.target.value)}
        spellCheck={false}
        autoComplete="off"
        placeholder="0x…"
        className="mt-3 w-full max-w-xl rounded-xl border border-edge-strong bg-ink-deep px-4 py-3 font-mono text-sm break-all text-heading outline-none focus-visible:border-accent/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      />

      {/* Always mounted, so the region exists before it has anything to say —
          a live region inserted together with its text is not announced. */}
      <p
        aria-live="polite"
        className={
          verdict.kind === "match" || verdict.kind === "case-only"
            ? "mt-3 min-h-6 max-w-xl text-sm leading-6 text-accent"
            : "mt-3 min-h-6 max-w-xl text-sm leading-6 text-mute-1"
        }
      >
        {message}
      </p>

      <p className="mt-4 max-w-xl text-xs leading-5 text-mute-3">
        This only tells you that two strings match. It cannot tell you that this
        page is honest. Compare the address against a source that is not this
        page — the BscScan link is above.
      </p>
    </div>
  );
}
