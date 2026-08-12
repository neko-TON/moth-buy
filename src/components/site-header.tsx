import Link from "next/link";
import { MothMark } from "@/components/moth-mark";

/**
 * Top navigation. Note this bar is `relative`, not sticky — it scrolls away
 * with the page, matching the source layout.
 *
 * The wordmark is live text in Funnel Display rather than a baked SVG: the
 * typeface is already loaded for the page, so setting it in markup keeps it
 * crisp at any zoom and keeps its tracking in step with the headings, which
 * run the same negative values.
 */
export function SiteHeader() {
  return (
    <nav className="relative z-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-3 transition-opacity duration-300 hover:opacity-80"
          aria-label="MOTH — home"
        >
          <MothMark className="size-8 text-accent" />
          <span className="text-2xl font-bold tracking-[-0.04em] text-heading">
            MOTH
          </span>
        </Link>
        <button
          type="button"
          className="btn-gold inline-flex items-center gap-2 rounded-xl bg-accent px-8 py-3 font-sans text-lg font-medium text-accent-ink hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Buy $MOTH
        </button>
      </div>
    </nav>
  );
}
