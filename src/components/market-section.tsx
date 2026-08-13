import { Activity } from "lucide-react";
import { getHolders, getMarket } from "@/lib/market";
import {
  CHAIN_NAME,
  formatCount,
  formatUsdCompact,
  formatUsdPrice,
} from "@/lib/token";

/**
 * Live market band. Every figure is read from a public source at request time
 * and carries an em-dash when that source has nothing to say — no invented
 * numbers, no "coming soon" placeholders dressed up as data.
 *
 * Concentration gets equal billing with price on purpose. It is the figure
 * that tells a visitor whether ten addresses can end this at will, which is
 * more useful to them than a market cap, and a site that hides it is making a
 * choice about whose interests it serves.
 */
export async function MarketSection() {
  const [market, holders] = await Promise.all([getMarket(), getHolders()]);

  const figures = [
    { label: "Price", value: market ? formatUsdPrice(market.priceUsd) : "—" },
    {
      label: "Liquidity",
      value: market ? formatUsdCompact(market.liquidityUsd) : "—",
    },
    {
      label: "Volume 24h",
      value: market ? formatUsdCompact(market.volume24hUsd) : "—",
    },
    { label: "Holders", value: holders ? formatCount(holders.count) : "—" },
  ];

  return (
    <section
      aria-labelledby="market-heading"
      className="border-b border-edge bg-ink-deep"
    >
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-16 lg:px-8">
        <div
          className="flex items-start justify-between gap-6 pb-10"
          data-reveal
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-mute-4">
              Live from {CHAIN_NAME}
            </p>
            <h2
              id="market-heading"
              className="mt-3 text-xl font-semibold text-heading sm:text-2xl"
            >
              What the chain says
            </h2>
          </div>
          <Activity className="icon-glow size-7 text-accent" aria-hidden="true" />
        </div>

        <dl
          className="grid grid-cols-2 gap-x-8 gap-y-10 border-t border-edge pt-10 md:grid-cols-4"
          data-stagger
        >
          {figures.map((figure) => (
            <div key={figure.label} data-reveal="soft">
              <dt className="text-sm text-mute-3">{figure.label}</dt>
              <dd className="mt-2 text-2xl font-bold tabular-nums tracking-[-0.03em] text-heading sm:text-3xl">
                {figure.value}
              </dd>
            </div>
          ))}
        </dl>

        {holders && holders.distribution.length > 0 && (
          <div className="mt-12 border-t border-edge pt-10" data-reveal="soft">
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
              <p className="text-sm font-semibold text-heading">
                Who holds the supply
              </p>
              <p className="text-xs text-mute-3">
                Ranked by balance. Larger bands on the left.
              </p>
            </div>

            {/* One bar rather than four numbers: concentration is a shape, and
                a reader sees a lopsided bar faster than they read a table. */}
            <div
              className="mt-5 flex h-2.5 w-full overflow-hidden rounded-full bg-ink"
              role="img"
              aria-label={holders.distribution
                .map((band) => `${band.label}: ${band.percent.toFixed(1)}%`)
                .join(", ")}
            >
              {holders.distribution.map((band, i) => (
                <span
                  key={band.label}
                  className={
                    ["bg-accent", "bg-accent/60", "bg-accent/35", "bg-edge-strong"][
                      i
                    ]
                  }
                  style={{ width: `${band.percent}%` }}
                />
              ))}
            </div>

            <dl className="mt-5 grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-4">
              {holders.distribution.map((band) => (
                <div key={band.label} className="flex items-baseline gap-2">
                  <dt className="text-sm text-mute-3">{band.label}</dt>
                  <dd className="text-sm font-semibold tabular-nums text-heading">
                    {band.percent.toFixed(1)}%
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        {!market && (
          <p className="mt-10 max-w-xl text-sm leading-6 text-mute-2">
            No market yet. These figures fill themselves in from the chain the
            moment there is a pool to read — nothing here is typed in by hand.
          </p>
        )}

        {market && (
          <p className="mt-10 text-xs text-mute-3">
            Deepest pool on {market.dexId}
            {market.pairUrl && (
              <>
                {" · "}
                <a
                  href={market.pairUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline text-mute-1 hover:text-accent"
                >
                  verify on DexScreener
                </a>
              </>
            )}
            {" · refreshed at most once a minute"}
          </p>
        )}
      </div>
    </section>
  );
}
