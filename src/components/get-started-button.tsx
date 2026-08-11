import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * The gold primary CTA. Appears in the hero and again in the closing band,
 * identical in both places. The arrow nudges right on hover.
 *
 * Note the accent *lightens* on hover (#F2B84B → #FFD37A), which is the
 * inverse of the usual darken-on-hover reflex — it matches the source palette.
 */
export function GetStartedButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      className={cn(
        "group inline-flex items-center gap-2 whitespace-nowrap rounded-xl bg-accent px-7 py-3.5 text-base font-semibold text-accent-ink transition-colors duration-200 hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        className,
      )}
    >
      Get Started
      <ArrowRight
        className="ml-1 size-5 transition-transform duration-200 group-hover:translate-x-1"
        aria-hidden="true"
      />
    </button>
  );
}
