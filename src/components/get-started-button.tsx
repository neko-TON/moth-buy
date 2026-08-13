import { ArrowRight } from "lucide-react";
import { SYMBOL, TOKEN_ADDRESS, pancakeSwapUrl } from "@/lib/token";
import { cn } from "@/lib/utils";

/**
 * The gold primary CTA. Appears in the hero and again in the closing band,
 * identical in both places. The arrow nudges right on hover.
 *
 * Note the accent *lightens* on hover (#F2B84B → #FFD37A), which is the
 * inverse of the usual darken-on-hover reflex — it matches the source palette.
 * `.btn-gold` carries the emission: a specular inset hairline plus a bloom
 * that widens and lifts on hover. Transitions live there, not in utilities,
 * because they need to stay in sync with the shadow stack.
 *
 * Where it goes: PancakeSwap's own swap interface, pre-filled with the
 * contract address. The trade is executed by their audited contracts in their
 * UI. This site deliberately owns no part of that path — it does not build a
 * transaction, request an approval, or ask for a signature at any point.
 *
 * With no contract deployed the button is disabled rather than hidden or
 * pointed somewhere plausible. A live "Buy" that leads nowhere is how a
 * visitor ends up buying one of the five other tokens named MOTH.
 */
export function GetStartedButton({ className }: { className?: string }) {
  const shared = cn(
    "btn-gold group inline-flex items-center gap-2 whitespace-nowrap rounded-xl bg-accent px-7 py-3.5 text-base font-semibold text-accent-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
    className,
  );

  if (!TOKEN_ADDRESS) {
    return (
      <button
        type="button"
        disabled
        title="No contract has been deployed yet."
        className={cn(
          shared,
          "cursor-not-allowed opacity-70 disabled:hover:bg-accent",
        )}
      >
        Not launched yet
      </button>
    );
  }

  return (
    <a
      href={pancakeSwapUrl(TOKEN_ADDRESS)}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(shared, "hover:bg-accent-hover")}
    >
      Buy ${SYMBOL}
      <ArrowRight
        className="ml-1 size-5 transition-transform duration-300 ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:translate-x-1.5"
        aria-hidden="true"
      />
    </a>
  );
}
