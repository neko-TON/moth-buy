/**
 * Server-side reads of public chain state. Nothing here is authenticated and
 * nothing here needs a key, which is deliberate: the page must keep working
 * for anyone who clones the repo, with no dashboard to sign up for.
 *
 * Every reader resolves to `null` on any failure rather than throwing. A dead
 * third-party API should degrade one figure to an em-dash, not take the
 * landing page down with it.
 *
 * Freshness comes from the route's `revalidate` (see `app/page.tsx`) plus the
 * per-request hints below. `cache()` deduplicates within a single render, so
 * two sections asking for the same snapshot cost one request.
 */
import { cache } from "react";
import { getTokenAddress } from "@/lib/address-store";
import { BSC_RPC, DEX_CHAIN } from "@/lib/token";

const REVALIDATE_SECONDS = 60;

/**
 * Rendered verbatim by `components/colophon-section.tsx`, which tells visitors
 * where each figure on the page was read.
 *
 * Declared here, beside the readers, because that block is the one on the site
 * that can turn false by sitting still. If you change a provider below, change
 * its row here in the same commit — otherwise the page keeps naming a source it
 * no longer uses, on a site whose entire claim is that it states nothing untrue.
 */
export const SOURCES: { reads: string; from: string }[] = [
  { reads: "Price, liquidity, 24h volume", from: "DexScreener, deepest pool only" },
  { reads: "Total supply and decimals", from: "The contract, over a public BSC node" },
  { reads: "Holders and concentration", from: "GeckoTerminal" },
];

export interface MarketSnapshot {
  priceUsd: number;
  liquidityUsd: number;
  volume24hUsd: number;
  marketCapUsd: number | null;
  /** Which DEX the deepest pool lives on, e.g. "pancakeswap". */
  dexId: string;
  /** DexScreener's page for that pool, for anyone who wants to verify. */
  pairUrl: string;
}

export interface SupplySnapshot {
  raw: bigint;
  decimals: number;
}

export interface HolderSnapshot {
  count: number;
  /** Share of supply held by rank bands, as percentages that sum to ~100. */
  distribution: { label: string; percent: number }[];
}

/* -------------------------------------------------------------- DexScreener */

interface DexPair {
  chainId?: string;
  dexId?: string;
  url?: string;
  baseToken?: { address?: string };
  priceUsd?: string;
  liquidity?: { usd?: number };
  volume?: { h24?: number };
  marketCap?: number;
  fdv?: number;
}

/**
 * A token with several pools has several rows here. The deepest pool is the
 * one that sets the price a buyer actually gets, so that is the one reported —
 * picking the first row would let a $50 pool speak for the token.
 *
 * Rows where our token is the *quote* side are skipped: their `priceUsd` is
 * the price of the other asset.
 */
export const getMarket = cache(async (): Promise<MarketSnapshot | null> => {
  // Read inside the function, never at module scope: a module-scope read would
  // be evaluated once per process and freeze the address all over again.
  const address = await getTokenAddress();
  if (!address) return null;

  try {
    const res = await fetch(
      `https://api.dexscreener.com/latest/dex/tokens/${address}`,
      { next: { revalidate: REVALIDATE_SECONDS } },
    );
    if (!res.ok) return null;

    const body: { pairs?: DexPair[] | null } = await res.json();

    const candidates = (body.pairs ?? []).filter(
      (pair) =>
        pair.chainId === DEX_CHAIN &&
        pair.baseToken?.address?.toLowerCase() === address &&
        Number(pair.priceUsd) > 0,
    );
    if (candidates.length === 0) return null;

    const deepest = candidates.reduce((best, pair) =>
      (pair.liquidity?.usd ?? 0) > (best.liquidity?.usd ?? 0) ? pair : best,
    );

    return {
      priceUsd: Number(deepest.priceUsd),
      liquidityUsd: deepest.liquidity?.usd ?? 0,
      volume24hUsd: deepest.volume?.h24 ?? 0,
      marketCapUsd: deepest.marketCap ?? deepest.fdv ?? null,
      dexId: deepest.dexId ?? "unknown",
      pairUrl: deepest.url ?? "",
    };
  } catch {
    return null;
  }
});

/* ---------------------------------------------------------------- JSON-RPC */

/**
 * `totalSupply()` and `decimals()` in one batched call. Reading supply from
 * the contract rather than from an aggregator means the figure on the page is
 * the chain's answer, not somebody's index of it.
 */
export const getSupply = cache(async (): Promise<SupplySnapshot | null> => {
  const address = await getTokenAddress();
  if (!address) return null;

  try {
    const res = await fetch(BSC_RPC, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify([
        {
          jsonrpc: "2.0",
          id: 1,
          method: "eth_call",
          // keccak("totalSupply()")[0:4]
          params: [{ to: address, data: "0x18160ddd" }, "latest"],
        },
        {
          jsonrpc: "2.0",
          id: 2,
          method: "eth_call",
          // keccak("decimals()")[0:4]
          params: [{ to: address, data: "0x313ce567" }, "latest"],
        },
      ]),
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return null;

    const body: { id: number; result?: string }[] = await res.json();
    const supplyHex = body.find((r) => r.id === 1)?.result;
    const decimalsHex = body.find((r) => r.id === 2)?.result;

    if (!supplyHex || supplyHex === "0x") return null;

    // A contract without `decimals()` returns "0x"; 18 is the BEP-20 default.
    const decimals =
      decimalsHex && decimalsHex !== "0x" ? Number(BigInt(decimalsHex)) : 18;

    return { raw: BigInt(supplyHex), decimals };
  } catch {
    return null;
  }
});

/* ------------------------------------------------------------ GeckoTerminal */

interface GeckoInfo {
  data?: {
    attributes?: {
      holders?: {
        count?: number;
        distribution_percentage?: Record<string, string>;
      };
    };
  };
}

const BANDS: { key: string; label: string }[] = [
  { key: "top_10", label: "Top 10" },
  { key: "11_30", label: "11–30" },
  { key: "31_50", label: "31–50" },
  { key: "rest", label: "Everyone else" },
];

/**
 * Holder count and concentration. Concentration is the honest metric here: a
 * token whose top ten addresses hold most of the supply is one insider away
 * from a very bad day, and that is worth showing plainly rather than burying.
 *
 * The named top-holder list is deliberately absent — every provider that
 * offers one (Etherscan, Moralis) puts it behind an API key, and a section
 * that only works when a key is present is a section that will silently break.
 */
export const getHolders = cache(async (): Promise<HolderSnapshot | null> => {
  const address = await getTokenAddress();
  if (!address) return null;

  try {
    const res = await fetch(
      `https://api.geckoterminal.com/api/v2/networks/${DEX_CHAIN}/tokens/${address}/info`,
      { next: { revalidate: REVALIDATE_SECONDS * 5 } },
    );
    if (!res.ok) return null;

    const body: GeckoInfo = await res.json();
    const holders = body.data?.attributes?.holders;
    if (typeof holders?.count !== "number") return null;

    const raw = holders.distribution_percentage ?? {};
    const distribution = BANDS.map(({ key, label }) => ({
      label,
      percent: Number(raw[key] ?? 0),
    })).filter((band) => Number.isFinite(band.percent));

    return { count: holders.count, distribution };
  } catch {
    return null;
  }
});
