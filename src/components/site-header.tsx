import Link from "next/link";
import { GetStartedButton } from "@/components/get-started-button";
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
        {/* `prefetch={false}` because this points at the page you are already
            on. Left to its own devices Next fetched the same route three times
            over on first load — a wasted RSC round trip each, on a one-page
            site where the link is a home affordance rather than navigation. */}
        <Link
          href="/"
          prefetch={false}
          className="flex items-center gap-3 transition-opacity duration-300 hover:opacity-80"
          aria-label="MOTH — home"
        >
          <MothMark className="size-8 text-accent" />
          <span className="text-2xl font-bold tracking-[-0.04em] text-heading">
            MOTH
          </span>
        </Link>
        {/* Was a bare <button> with no handler: the most prominent call to
            action on the page did nothing at all when clicked. */}
        <GetStartedButton className="px-8 py-3 text-lg font-medium" />
      </div>
    </nav>
  );
}
