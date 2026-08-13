import { ArrowUpRight, Info } from "lucide-react";
import { CopyButton } from "@/components/copy-button";
import { WalletBalance } from "@/components/wallet-balance";
import { getSupply } from "@/lib/market";
import {
  CHAIN_ID,
  CHAIN_NAME,
  SYMBOL,
  TOKEN_ADDRESS,
  explorerTokenUrl,
  pancakeSwapUrl,
} from "@/lib/token";

/**
 * Other live tokens carrying this name, verified on-chain on 2026-08-12.
 *
 * Framed as disambiguation, not accusation: some of these are ordinary
 * projects that reached for the same common English word, and one is a working
 * DeFi protocol that has nothing to do with a memecoin. The point is only that
 * a buyer searching "MOTH" will meet them, and should be able to tell which
 * one this page is talking about.
 */
const NAMESAKES: { chain: string; address: string; note: string }[] = [
  {
    chain: "Solana",
    address: "EfRr6xyFYAwVLSV2sYt68gXwPFfUYayGpEyRoSLGRS5L",
    note: "Writes its ticker with a slashed Ø, so text searches miss it. The deepest MOTH-named pool anywhere.",
  },
  {
    chain: "Solana",
    address: "C2MvcWD86peRanQAnJfiDPurs7e7CkMsnP1bHBNJvBpA",
    note: "Holds the canonical CoinMarketCap listing for the name, still showing figures from its 2024 peak.",
  },
  {
    chain: "Sonic",
    address: "0xD259C1ae13e4AcD745556913D044f08542418875",
    note: "Ran the same moth-and-lamp joke a year earlier. Its website has since left the registry.",
  },
  {
    chain: "Linea",
    address: "0xD3003060E18A7afC318F050255291078e9cf76B3",
    note: "Not a memecoin at all — a working seigniorage protocol that happens to share the ticker.",
  },
  {
    chain: "Ethereum",
    address: "0x935133F60581f244d34E03F0e28EBD956F819Bdc",
    note: "Listed as “Crypto MOTH”. No trading pair.",
  },
];

/**
 * The contract section: the address, the two links that matter, and an honest
 * account of who else answers to this name.
 *
 * Before deployment this section does not go quiet — it is precisely the
 * pre-launch window in which someone sells a fake $MOTH, so the namesake list
 * and the "there is no address yet" statement are more useful now than they
 * will be later.
 */
export async function ContractSection() {
  const supply = await getSupply();

  return (
    <section
      id="contract"
      aria-labelledby="contract-heading"
      className="scroll-mt-24 border-t border-edge py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="max-w-3xl" data-stagger>
          <p
            className="text-xs font-semibold uppercase tracking-[0.22em] text-mute-4"
            data-reveal
          >
            {CHAIN_NAME} · chain {CHAIN_ID}
          </p>
          <h2
            id="contract-heading"
            className="mt-4 text-4xl font-bold leading-tight tracking-[-0.035em] text-heading sm:text-5xl"
            data-reveal
          >
            The contract.
          </h2>
          <p
            className="mt-5 text-base leading-7 text-mute-2 sm:text-lg"
            data-reveal
          >
            One address. Check it against this page before you send anything
            anywhere, and check this page against a second source before you
            trust it.
          </p>
        </header>

        <div className="mt-12 grid grid-cols-12 gap-y-12 lg:gap-x-16">
          <div className="col-span-12 lg:col-span-7" data-reveal>
            {TOKEN_ADDRESS ? (
              <>
                <div className="flex items-center gap-3 rounded-xl border border-edge bg-ink-deep p-4">
                  <code
                    id="moth-contract-address"
                    className="min-w-0 flex-1 break-all font-mono text-sm text-heading sm:text-base"
                  >
                    {TOKEN_ADDRESS}
                  </code>
                  <CopyButton
                    value={TOKEN_ADDRESS}
                    label={`Copy the ${SYMBOL} contract address`}
                    selectTargetId="moth-contract-address"
                  />
                </div>

                <div className="mt-6 flex flex-wrap gap-4">
                  <a
                    href={explorerTokenUrl(TOKEN_ADDRESS)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex min-h-12 items-center gap-2 rounded-xl border border-edge-strong px-6 font-semibold text-heading transition-[color,border-color] duration-300 hover:border-accent/60 hover:text-accent"
                  >
                    Read it on BscScan
                    <ArrowUpRight
                      className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden="true"
                    />
                  </a>
                  <a
                    href={pancakeSwapUrl(TOKEN_ADDRESS)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex min-h-12 items-center gap-2 rounded-xl border border-edge-strong px-6 font-semibold text-heading transition-[color,border-color] duration-300 hover:border-accent/60 hover:text-accent"
                  >
                    Open on PancakeSwap
                    <ArrowUpRight
                      className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden="true"
                    />
                  </a>
                </div>

                {supply && (
                  <p className="mt-6 text-sm text-mute-2">
                    The contract reports{" "}
                    <span className="font-semibold tabular-nums text-heading">
                      {new Intl.NumberFormat("en-US").format(
                        supply.raw / 10n ** BigInt(supply.decimals),
                      )}
                    </span>{" "}
                    {SYMBOL} in existence, at {supply.decimals} decimals.
                  </p>
                )}

                <WalletBalance decimals={supply?.decimals ?? 18} />
              </>
            ) : (
              <div className="rounded-xl border border-edge bg-ink-deep p-6">
                <p className="text-lg font-semibold text-heading">
                  There is no address yet.
                </p>
                <p className="mt-3 max-w-xl text-base leading-7 text-mute-2">
                  The token has not been deployed. Anyone offering you {SYMBOL}{" "}
                  on {CHAIN_NAME} today is selling you something else. When it
                  exists, the address appears here, and the figures above start
                  reading themselves off the chain.
                </p>
              </div>
            )}
          </div>

          <div className="col-span-12 lg:col-span-5" data-reveal="soft">
            <div className="flex items-center gap-2.5">
              <Info className="size-4 text-mute-3" aria-hidden="true" />
              <h3 className="text-sm font-semibold text-heading">
                Other tokens called {SYMBOL}
              </h3>
            </div>
            <p className="mt-3 text-sm leading-6 text-mute-2">
              None of these are connected to this project. Several are ordinary
              projects that picked the same common word — this list is here so
              you can tell them apart, not as a complaint about any of them.
            </p>

            <ul className="mt-6 divide-y divide-edge border-t border-edge">
              {NAMESAKES.map((token) => (
                <li key={token.address} className="py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-mute-4">
                    {token.chain}
                  </p>
                  <code className="mt-2 block break-all font-mono text-xs text-mute-1">
                    {token.address}
                  </code>
                  <p className="mt-2 text-sm leading-6 text-mute-2">
                    {token.note}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
