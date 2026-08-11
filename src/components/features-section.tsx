import { Coins, Gift, ShieldCheck, TrendingUp } from "lucide-react";
import type { StatRow } from "@/types/landing";

/**
 * Icons that sit as a bare inline child of a card (rather than inside a flex
 * row) must keep baseline alignment: the source renders these as Iconify
 * `<span>`s, whose line box includes ~6px of descender space below the glyph.
 * Tailwind's Preflight makes every `svg` `display:block; vertical-align:middle`,
 * which collapses that space and shortens the card. Restoring inline-block +
 * baseline reproduces the original box model exactly.
 */
const STANDALONE_ICON =
  "feature-icon icon-glow inline-block size-7 align-baseline text-accent";

const PRIMARY_ROWS: StatRow[] = [
  { label: "Trading activity", value: "AMM" },
  { label: "Capital access", value: "Lending" },
  { label: "Token discovery", value: "Launchpad" },
];

/**
 * Four principles in a bordered mosaic (`.feature-grid`): a tall primary cell
 * spanning two rows on the left, two stacked cells on the right, and a
 * full-width security cell beneath. Everything linearises under 768px.
 */
export function FeaturesSection() {
  return (
    <section
      aria-labelledby="features-heading"
      className="relative py-20 sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="max-w-4xl pb-12 lg:pb-16" data-stagger>
          <h2
            id="features-heading"
            className="text-4xl font-bold leading-tight tracking-[-0.035em] text-heading sm:text-5xl"
            data-reveal
          >
            Four product principles. One connected DeFi system.
          </h2>
          <p
            className="mt-5 max-w-2xl text-base leading-7 text-mute-2 sm:text-lg"
            data-reveal
          >
            Yieldra is designed to make capital more efficient across trading,
            lending, and launchpad products.
          </p>
        </header>

        {/* Cells reveal in mosaic order, not DOM order — see `[data-stagger]`. */}
        <div className="feature-grid" data-stagger>
          <article className="feature-primary bg-ink-raised" data-reveal>
            <div className="feature-icon btn-gold flex size-12 items-center justify-center rounded-xl bg-accent text-accent-ink">
              <TrendingUp className="size-6" aria-hidden="true" />
            </div>
            <h3 className="mt-8 text-3xl font-bold tracking-[-0.025em] text-heading sm:text-4xl">
              Multi-Yields
            </h3>
            <p className="mt-4 max-w-xl text-base leading-7 text-mute-1 sm:text-lg">
              Generate multiple income streams through the fusion of trading and
              lending protocols.
            </p>
            <ul className="mt-12 border-t border-edge text-sm">
              {PRIMARY_ROWS.map((row, i) => (
                <li
                  key={row.label}
                  className={
                    i < PRIMARY_ROWS.length - 1
                      ? "flex items-center justify-between border-b border-edge py-4"
                      : "flex items-center justify-between py-4"
                  }
                >
                  <span className="text-mute-3">{row.label}</span>
                  <span className="font-semibold text-heading">{row.value}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="feature-fees" data-reveal>
            <Coins className={STANDALONE_ICON} aria-hidden="true" />
            <h3 className="mt-6 text-2xl font-bold text-heading">Low Fees</h3>
            <p className="mt-3 text-base leading-7 text-mute-2">
              Keep more of your profits with a competitive fee structure and
              minimal trading costs.
            </p>
          </article>

          <article className="feature-incentives" data-reveal>
            <Gift className={STANDALONE_ICON} aria-hidden="true" />
            <h3 className="mt-6 text-2xl font-bold text-heading">
              Tailored Incentives
            </h3>
            <p className="mt-3 text-base leading-7 text-mute-2">
              Yield farmers, traders, and builders can engage with DeFi in the
              way that fits them.
            </p>
          </article>

          <article className="feature-security" data-reveal>
            <div>
              <ShieldCheck className={STANDALONE_ICON} aria-hidden="true" />
              <h3 className="mt-6 text-2xl font-bold text-heading">
                Security in Focus
              </h3>
            </div>
            <p className="max-w-2xl text-base leading-7 text-mute-2">
              Smart contract security remains a core protocol priority alongside
              capital efficiency across Yieldra&#39;s connected products.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
