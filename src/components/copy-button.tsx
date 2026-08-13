"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Copy-to-clipboard for the contract address. The confirmation is the whole
 * point: an address that may or may not have copied is worse than no button,
 * because the failure only shows up in the paste — by which time the user is
 * in their wallet, not on this page.
 */
export function CopyButton({
  value,
  label,
  selectTargetId,
  className,
}: {
  value: string;
  label: string;
  /** Element holding the same text, selected as a fallback when copying fails. */
  selectTargetId?: string;
  className?: string;
}) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  // The tick reverts on a timer, which has to be cleared if the component
  // unmounts first — otherwise React warns about a state update on a gone tree.
  useEffect(() => {
    if (state === "idle") return;
    const id = window.setTimeout(() => setState("idle"), 2600);
    return () => window.clearTimeout(id);
  }, [state]);

  /**
   * Clipboard writes are refused more often than you would expect — the
   * in-app browsers inside Telegram and X are exactly where a crypto link
   * gets opened, and they are among the refusers. Highlighting the address
   * gives the visitor something to copy by hand.
   *
   * Failing loudly matters here specifically: someone who believes they
   * copied an address and did not will paste whatever was already on their
   * clipboard into a wallet.
   */
  function selectFallback() {
    if (!selectTargetId) return;
    const node = document.getElementById(selectTargetId);
    const selection = window.getSelection();
    if (!node || !selection) return;

    const range = document.createRange();
    range.selectNodeContents(node);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setState("copied");
        } catch {
          setState("failed");
          selectFallback();
        }
      }}
      aria-label={label}
      title={
        state === "failed"
          ? "Your browser blocked the clipboard — the address is selected, copy it by hand."
          : label
      }
      className={cn(
        "inline-flex size-10 shrink-0 items-center justify-center rounded-lg border transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        state === "failed"
          ? "border-accent/60 text-accent"
          : "border-edge-strong text-mute-1 hover:border-accent/60 hover:text-accent",
        className,
      )}
    >
      {state === "copied" ? (
        <Check className="size-4 text-accent" aria-hidden="true" />
      ) : (
        <Copy className="size-4" aria-hidden="true" />
      )}
      <span className="sr-only" aria-live="polite">
        {state === "copied"
          ? "Address copied"
          : state === "failed"
            ? "Copying was blocked. The address is now selected — copy it manually."
            : ""}
      </span>
    </button>
  );
}
