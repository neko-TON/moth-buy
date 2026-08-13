import { getHolders, getMarket } from "@/lib/market";

/**
 * The section every token page owes its reader and none of them writes.
 *
 * It sits between the live figures and the four statements because two of its
 * items point back at figures the reader has just passed — the liquidity
 * number is the size of the pool they would be selling into, and the
 * concentration bar is the answer to how few people could end it. Moving this
 * further down would separate the claim from its evidence by a whole section.
 *
 * No figure is rendered here on purpose. This section points at numbers; it
 * does not restate them, because a restated number is a number that can go
 * stale in one place and not the other.
 */
export async function RiskSection() {
  const [market, holders] = await Promise.all([getMarket(), getHolders()]);

  const risks: { title: string; body: string }[] = [
    {
      title: "The price falls and stays there.",
      body: "No revenue, no team obligation, no product to argue a price back up. Nothing here is required to recover.",
    },
    {
      title: "You sell into a pool, not into a market.",
      body: market
        ? "Your sale is priced against whatever is in the deepest pool at that second. Liquidity, above, is the size of that pool. An order larger than the pool moves the price against you before it fills."
        : "There is no pool to sell into yet. When there is, your sale will be priced against whatever is in it at that second, and an order larger than the pool moves the price against you before it fills.",
    },
    {
      title: "A small number of addresses can end this.",
      body: holders
        ? "The concentration bar above is the whole story. Read it before you buy rather than after."
        : "We could not read holder concentration this minute. That is not the same as it being fine.",
    },
    {
      title: "The liquidity can leave.",
      body: "Whoever supplied the pool can take it back out, unless the pool tokens are burned or locked. Neither is promised here.",
    },
    {
      title: "You buy a different token.",
      body: "Anyone can deploy a token called MOTH for a few cents, with this name and this artwork. The address on this page is the only one this site means. Check it against a source that is not this page.",
    },
    {
      title: "Everything goes right and you lose the money anyway.",
      body: "Correct address, deep pool, nobody leaves with the liquidity, and the price still goes to nothing. Prices are allowed to do that.",
    },
  ];

  return (
    <section
      aria-labelledby="risk-heading"
      className="border-b border-edge py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="max-w-3xl" data-stagger>
          <p
            className="text-xs font-semibold uppercase tracking-[0.22em] text-mute-4"
            data-reveal
          >
            Risk
          </p>
          <h2
            id="risk-heading"
            className="mt-4 text-4xl font-bold leading-tight tracking-[-0.035em] text-heading sm:text-5xl"
            data-reveal
          >
            How you lose money here.
          </h2>
          <p
            className="mt-5 text-base leading-7 text-mute-2 sm:text-lg"
            data-reveal
          >
            The disclaimer is at the bottom of the page. These are the
            mechanisms.
          </p>
        </header>

        {/* The numerals stay in `text-mute-4`. Gold on this page means a figure
            read off the chain, and `.figure-glow` appears exactly once — on the
            live supply. Lighting up a list index would spend that meaning. */}
        <ol
          className="mt-14 grid gap-x-16 gap-y-10 border-t border-edge pt-10 sm:grid-cols-2"
          data-stagger
        >
          {risks.map((risk, i) => (
            <li key={risk.title} className="risk-item" data-reveal="soft">
              <p className="font-mono text-xs font-semibold tabular-nums text-mute-4">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-3 text-lg font-semibold leading-snug text-heading">
                {risk.title}
              </h3>
              <p className="mt-2.5 text-sm leading-6 text-mute-2">{risk.body}</p>
            </li>
          ))}
        </ol>

        <p className="mt-12 max-w-2xl text-base leading-7 text-mute-1" data-reveal>
          None of this is unusual. It is only unusual to set it at this size.
        </p>
      </div>
    </section>
  );
}
