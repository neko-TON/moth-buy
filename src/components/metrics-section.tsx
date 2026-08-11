import { ChartNoAxesCombined } from "lucide-react";
import type { StatRow } from "@/types/landing";

const AVAILABILITY: StatRow[] = [
  { label: "Total volume", value: "Coming Soon" },
  { label: "Trading pairs", value: "Coming Soon" },
  { label: "Tokens launched", value: "Coming Soon" },
];

/**
 * Live-data band: a 7/5 split on desktop that stacks under 768px, where the
 * dividing rule flips from a left border to a top border (see `.metrics-*`).
 */
export function MetricsSection() {
  return (
    <section
      aria-labelledby="metrics-heading"
      className="border-b border-white/10 bg-ink-deep"
    >
      <div className="metrics-grid mx-auto grid max-w-7xl grid-cols-12 px-4 sm:px-6 lg:px-8">
        <article className="col-span-7 py-14 pr-12 md:py-16">
          <div className="flex items-center justify-between gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sage-faint">
                Live protocol data
              </p>
              <h2
                id="metrics-heading"
                className="mt-3 text-xl font-semibold text-white sm:text-2xl"
              >
                Total value locked
              </h2>
            </div>
            <ChartNoAxesCombined
              className="size-7 text-acid"
              aria-hidden="true"
            />
          </div>
          <span className="mt-7 block text-5xl font-bold tabular-nums tracking-[-0.04em] text-acid sm:text-6xl">
            $0
          </span>
        </article>

        <div className="metrics-secondary col-span-5 border-l border-white/10 py-14 pl-12 md:py-16">
          <p className="text-sm font-semibold text-white">
            Product availability
          </p>
          <dl className="mt-5 divide-y divide-white/10">
            {AVAILABILITY.map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between gap-6 py-3.5"
              >
                <dt className="text-sm text-sage">{row.label}</dt>
                <dd className="text-sm font-semibold text-white">
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
