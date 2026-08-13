/**
 * Everything the page needs to know about the token, in one place.
 *
 * The whole on-chain layer hangs off a single environment variable. Until
 * `NEXT_PUBLIC_MOTH_ADDRESS` holds a real BEP-20 address the site renders an
 * honest "not deployed" state everywhere instead of zeros or fake figures —
 * see `IS_DEPLOYED`. Set the variable and every section fills itself in; no
 * code changes required at launch.
 *
 * A malformed value is treated as absent rather than passed through. A typo'd
 * address would otherwise reach BscScan and PancakeSwap links, and a "buy"
 * button pointing at the wrong contract is precisely how people lose money.
 */

const ADDRESS_RE = /^0x[0-9a-fA-F]{40}$/;

const configured = process.env.NEXT_PUBLIC_MOTH_ADDRESS?.trim() ?? "";

/** Lowercased contract address, or `null` when unset/invalid. */
export const TOKEN_ADDRESS: string | null = ADDRESS_RE.test(configured)
  ? configured.toLowerCase()
  : null;

export const IS_DEPLOYED = TOKEN_ADDRESS !== null;

export const SYMBOL = "MOTH";

/** BNB Smart Chain mainnet. */
export const CHAIN_ID = 56;
export const CHAIN_ID_HEX = "0x38";
export const CHAIN_NAME = "BNB Smart Chain";

/**
 * Public RPC. Chosen because it answers with `access-control-allow-origin: *`,
 * so the browser can read a balance directly without us proxying it — one less
 * server route, and no key to leak.
 */
export const BSC_RPC = "https://bsc-dataseed.binance.org";

/** DexScreener's identifier for this chain. */
export const DEX_CHAIN = "bsc";

export const explorerTokenUrl = (address: string) =>
  `https://bscscan.com/token/${address}`;

/**
 * Deep link into PancakeSwap's own interface. The swap is executed by their
 * audited contracts in their UI — this site never builds, signs, or submits a
 * transaction, and never asks for a token allowance.
 */
export const pancakeSwapUrl = (address: string) =>
  `https://pancakeswap.finance/swap?chain=bsc&outputCurrency=${address}`;

export const shortenAddress = (address: string, lead = 6, tail = 4) =>
  `${address.slice(0, lead)}…${address.slice(-tail)}`;

/* -----------------------------------------------------------------------
   Formatting.

   Every formatter pins the locale to en-US. Number formatting that follows
   the runtime's locale renders differently on the server than in the
   browser, and React reports that as a hydration mismatch.
   ----------------------------------------------------------------------- */

const compact = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const grouped = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

const usd2 = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

const usdCompact = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});

/** Sub-cent prices are the norm for a memecoin, so they keep significant digits. */
const usdSmall = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumSignificantDigits: 4,
});

export function formatUsdPrice(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return "—";
  return value < 0.01 ? usdSmall.format(value) : usd2.format(value);
}

export function formatUsdCompact(value: number): string {
  if (!Number.isFinite(value) || value < 0) return "—";
  return value < 1000 ? usd2.format(value) : usdCompact.format(value);
}

export function formatCount(value: number): string {
  if (!Number.isFinite(value) || value < 0) return "—";
  return value < 10_000 ? grouped.format(value) : compact.format(value);
}

/**
 * Converts a raw on-chain integer to a display string. Token amounts exceed
 * `Number.MAX_SAFE_INTEGER` routinely, so the split happens in bigint and only
 * the (small) whole part is handed to `Number`.
 */
export function formatTokenAmount(
  raw: bigint,
  decimals: number,
): { compact: string; exact: string } {
  const base = 10n ** BigInt(decimals);
  const whole = raw / base;
  const fraction = raw % base;

  const asNumber = Number(whole) + Number(fraction) / Number(base);

  return {
    compact: compact.format(asNumber),
    exact: grouped.format(whole),
  };
}
