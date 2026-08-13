import { CopyButton } from "@/components/copy-button";
import { getStoredValue, isAddress } from "@/lib/address-store";
import { CHAIN_NAME, SYMBOL } from "@/lib/token";

/**
 * The contract address, in the hero, where someone who arrived from a link and
 * intends to buy will look for it first.
 *
 * It prints the stored string exactly as it was entered and builds no link out
 * of it — a placeholder shows here plainly, labelled as one. The full address
 * is rendered rather than a shortened form, because the only thing a visitor
 * can usefully do with it is compare it against another source, and an
 * abbreviation is precisely what an attacker substituting a lookalike address
 * would want them to be shown.
 *
 * Renders nothing at all before there is a value; the contract section further
 * down carries the "no address yet" statement.
 */
export async function CaBar() {
  const value = await getStoredValue();
  if (value === "") return null;

  const valid = isAddress(value);

  return (
    <div className="mt-9">
      <div className="ca-bar flex items-center gap-3 rounded-xl border border-edge bg-ink-deep/80 p-3 sm:max-w-2xl sm:p-4">
        <span
          className="shrink-0 pl-1 text-xs font-semibold uppercase tracking-[0.22em] text-accent"
          aria-hidden="true"
        >
          CA
        </span>
        <code
          id="hero-contract-address"
          className="min-w-0 flex-1 break-all font-mono text-xs text-heading sm:text-sm"
        >
          {value}
        </code>
        <CopyButton
          value={value}
          label={`Copy the ${SYMBOL} contract address`}
          selectTargetId="hero-contract-address"
        />
      </div>

      {!valid && (
        <p className="mt-2.5 text-xs leading-5 text-mute-3">
          Placeholder — not a valid {CHAIN_NAME} address yet.
        </p>
      )}
    </div>
  );
}
