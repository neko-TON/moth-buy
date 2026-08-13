import { SOURCES } from "@/lib/market";

/**
 * Where every figure on this page came from.
 *
 * The page asserts numbers all the way down and never once says on the page
 * itself where one was read. That answer only lives in the README, which
 * nobody visiting the site will open.
 *
 * The source names are imported from `lib/market` rather than retyped. This
 * block is the one on the page that can turn a true statement false by sitting
 * still — swap a provider and hand-written prose here would quietly become the
 * only lie on a site whose whole premise is that it contains none.
 */
export function ColophonSection() {
  return (
    <section
      aria-labelledby="colophon-heading"
      className="border-t border-edge bg-ink-deep py-16 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="max-w-3xl" data-stagger>
          <p
            className="text-xs font-semibold uppercase tracking-[0.22em] text-mute-4"
            data-reveal
          >
            Colophon
          </p>
          <h2
            id="colophon-heading"
            className="mt-4 text-2xl font-semibold tracking-[-0.02em] text-heading sm:text-3xl"
            data-reveal
          >
            Where the numbers come from.
          </h2>
        </header>

        <dl
          className="mt-10 max-w-4xl divide-y divide-edge border-t border-edge"
          data-stagger
        >
          {SOURCES.map((source) => (
            <div
              key={source.reads}
              className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
              data-reveal="soft"
            >
              <dt className="text-sm text-mute-1">{source.reads}</dt>
              <dd className="text-sm font-semibold text-heading sm:text-right">
                {source.from}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
