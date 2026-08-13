import { ArrowUpRight } from "lucide-react";
import { AddressCheck } from "@/components/address-check";
import { CopyButton } from "@/components/copy-button";
import { WalletBalance } from "@/components/wallet-balance";
import { getStoredValue, getTokenAddress } from "@/lib/address-store";
import { getSupply } from "@/lib/market";
import {
  CHAIN_ID,
  CHAIN_NAME,
  SYMBOL,
  explorerTokenUrl,
  pancakeSwapUrl,
} from "@/lib/token";

/**
 * The contract section: the address, and the two links that matter.
 *
 * Before deployment this section does not go quiet. The pre-launch window is
 * precisely when someone sells a fake $MOTH, so the "there is no address yet"
 * statement is doing more work now than it will later.
 */
export async function ContractSection() {
  /**
   * Two readings of the same setting, and the distinction is the safety rule
   * of this file. `stored` is whatever the owner typed and is only ever
   * printed; `address` is `null` unless that string is a real BEP-20 address,
   * and it is the only thing the links are built from. A placeholder therefore
   * shows on the page without ever becoming somewhere to send money.
   */
  const [stored, address, supply] = await Promise.all([
    getStoredValue(),
    getTokenAddress(),
    getSupply(),
  ]);

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

        {/* Single column since the namesake list came out. Capped rather than
            full-bleed: the address is a 42-character string and the lines
            around it are prose, neither of which reads well across the full
            7xl gutter. */}
        <div className="mt-12">
          <div className="max-w-3xl" data-reveal>
            {stored !== "" ? (
              <>
                <div className="flex items-center gap-3 rounded-xl border border-edge bg-ink-deep p-4">
                  <code
                    id="moth-contract-address"
                    className="min-w-0 flex-1 break-all font-mono text-sm text-heading sm:text-base"
                  >
                    {stored}
                  </code>
                  <CopyButton
                    value={stored}
                    label={`Copy the ${SYMBOL} contract address`}
                    selectTargetId="moth-contract-address"
                  />
                </div>

                {!address && (
                  <p className="mt-4 rounded-xl border border-edge bg-ink-deep p-4 text-sm leading-6 text-mute-2">
                    That is not a valid {CHAIN_NAME} address, so the links and
                    the on-chain figures stay switched off. Nothing on this page
                    will send you anywhere to buy until it is a real one.
                  </p>
                )}

                {address && (
                <div className="mt-6 flex flex-wrap gap-4">
                  <a
                    href={explorerTokenUrl(address)}
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
                    href={pancakeSwapUrl(address)}
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
                )}

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

                {/* Below the links, never above: nothing here may push the
                    address further down the viewport. Mounted only for a
                    vetted address — a placeholder has nothing to compare
                    against, and offering a comparison would imply it does. */}
                {/* `stored`, not `address`: the comparison must be against the
                    string this page actually prints. `getTokenAddress()`
                    lowercases, so passing it made a visitor pasting the
                    checksummed address their wallet shows get told the
                    capitalisation differed — which reads as an alarm about the
                    one thing they were checking. Safe here because this only
                    renders when `address !== null`, so `stored` is a valid
                    address either way, and nothing in this widget is a link. */}
                {address && <AddressCheck expected={stored} />}

                <WalletBalance
                  address={address}
                  decimals={supply?.decimals ?? 18}
                />
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

        </div>
      </div>
    </section>
  );
}
