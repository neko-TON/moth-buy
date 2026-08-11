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
const STANDALONE_ICON = "inline-block size-7 align-baseline text-acid";

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
        <header className="max-w-4xl pb-12 lg:pb-16">
          <h2
            id="features-heading"
            className="text-4xl font-bold leading-tight tracking-[-0.035em] text-white sm:text-5xl"
          >
            Four product principles. One connected DeFi system.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-sage-dim sm:text-lg">
            Yieldra is designed to make capital more efficient across trading,
            lending, and launchpad products.
          </p>
        </header>

        <div className="feature-grid">
          <article className="feature-primary bg-ink-raised">
            <div className="flex size-12 items-center justify-center rounded-xl bg-acid text-acid-ink">
              <TrendingUp className="size-6" aria-hidden="true" />
            </div>
            <h3 className="mt-8 text-3xl font-bold tracking-[-0.025em] text-white sm:text-4xl">
              Multi-Yields
            </h3>
            <p className="mt-4 max-w-xl text-base leading-7 text-sage sm:text-lg">
              Generate multiple income streams through the fusion of trading and
              lending protocols.
            </p>
            <ul className="mt-12 border-t border-white/10 text-sm">
              {PRIMARY_ROWS.map((row, i) => (
                <li
                  key={row.label}
                  className={
                    i < PRIMARY_ROWS.length - 1
                      ? "flex items-center justify-between border-b border-white/10 py-4"
                      : "flex items-center justify-between py-4"
                  }
                >
                  <span className="text-sage-dimmer">{row.label}</span>
                  <span className="font-semibold text-white">{row.value}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="feature-fees">
            <Coins className={STANDALONE_ICON} aria-hidden="true" />
            <h3 className="mt-6 text-2xl font-bold text-white">Low Fees</h3>
            <p className="mt-3 text-base leading-7 text-sage-dim">
              Keep more of your profits with a competitive fee structure and
              minimal trading costs.
            </p>
          </article>

          <article className="feature-incentives">
            <Gift className={STANDALONE_ICON} aria-hidden="true" />
            <h3 className="mt-6 text-2xl font-bold text-white">
              Tailored Incentives
            </h3>
            <p className="mt-3 text-base leading-7 text-sage-dim">
              Yield farmers, traders, and builders can engage with DeFi in the
              way that fits them.
            </p>
          </article>

          <article className="feature-security">
            <div>
              <ShieldCheck className={STANDALONE_ICON} aria-hidden="true" />
              <h3 className="mt-6 text-2xl font-bold text-white">
                Security in Focus
              </h3>
            </div>
            <p className="max-w-2xl text-base leading-7 text-sage-dim">
              Smart contract security remains a core protocol priority alongside
              capital efficiency across Yieldra&#39;s connected products.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
