import { ChartNoAxesCombined } from "lucide-react";
import type { StatRow } from "@/types/landing";

/**
 * Deliberately the least exciting table on the page. The joke only works if
 * the answers are true — a memecoin claiming yield in a band styled like
 * protocol telemetry is the thing this rebrand exists to remove.
 */
const DOES: StatRow[] = [
  { label: "Yield", value: "None" },
  { label: "Utility", value: "None" },
  { label: "Roadmap", value: "None" },
];

/**
 * Facts band: a 7/5 split on desktop that stacks under 768px, where the
 * dividing rule flips from a left border to a top border (see `.metrics-*`).
 */
export function MetricsSection() {
  return (
    <section
      aria-labelledby="metrics-heading"
      className="border-b border-edge bg-ink-deep"
    >
      <div className="metrics-grid mx-auto grid max-w-7xl grid-cols-12 px-4 sm:px-6 lg:px-8">
        <article className="col-span-7 py-14 pr-12 md:py-16" data-reveal>
          <div className="flex items-center justify-between gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-mute-4">
                Token facts
              </p>
              <h2
                id="metrics-heading"
                className="mt-3 text-xl font-semibold text-heading sm:text-2xl"
              >
                Total supply
              </h2>
            </div>
            <ChartNoAxesCombined
              className="icon-glow size-7 text-accent"
              aria-hidden="true"
            />
          </div>
          {/* Placeholder until the token actually exists — see README. */}
          <span className="figure-glow mt-7 block text-5xl font-bold tabular-nums tracking-[-0.04em] text-accent sm:text-6xl">
            &mdash;
          </span>
        </article>

        <div
          className="metrics-secondary col-span-5 border-l border-edge py-14 pl-12 md:py-16"
          data-reveal="soft"
        >
          <p className="text-sm font-semibold text-heading">
            What this token does
          </p>
          <dl className="mt-5 divide-y divide-edge" data-stagger>
            {DOES.map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between gap-6 py-3.5 transition-colors duration-300 hover:text-heading"
                data-reveal="soft"
              >
                <dt className="text-sm text-mute-1">{row.label}</dt>
                <dd className="text-sm font-semibold text-heading">
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
