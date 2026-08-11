import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * The acid-green primary CTA. Appears in the hero and again in the closing
 * band, identical in both places. The arrow nudges right on hover.
 */
export function GetStartedButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      className={cn(
        "group inline-flex items-center gap-2 whitespace-nowrap rounded-xl bg-acid px-7 py-3.5 text-base font-semibold text-acid-ink transition-colors duration-200 hover:bg-acid-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acid",
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
