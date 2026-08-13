"use client";

import { Wallet } from "lucide-react";
import { useState } from "react";
import {
  BSC_RPC,
  SYMBOL,
  formatTokenAmount,
  shortenAddress,
} from "@/lib/token";

/**
 * Reads the visitor's $MOTH balance. Read-only, and aggressively so.
 *
 * The only wallet method called is `eth_requestAccounts`. This component never
 * requests an allowance, never asks for a signature, never builds a
 * transaction, and never even asks the wallet to switch networks — the balance
 * is read from a public RPC directly, so it works while the wallet sits on any
 * chain it likes.
 *
 * That restraint is the feature. A memecoin page that trains its visitors to
 * click "connect" and then approve whatever appears next is doing the
 * groundwork for whoever phishes them later, so this one demonstrates the
 * opposite habit and says so on screen.
 */

interface Eip1193Provider {
  request(args: { method: string; params?: unknown[] }): Promise<unknown>;
}

declare global {
  interface Window {
    ethereum?: Eip1193Provider;
  }
}

// keccak("balanceOf(address)")[0:4] followed by the address, left-padded to
// a full 32-byte word as the ABI requires.
const balanceOfCalldata = (address: string) =>
  `0x70a08231${address.slice(2).toLowerCase().padStart(64, "0")}`;

type State =
  | { status: "idle" }
  | { status: "busy" }
  | { status: "ready"; account: string; balance: bigint }
  | { status: "error"; message: string };

/**
 * `address` arrives as a prop rather than from a module constant, because the
 * address is now set at runtime and this component runs in the browser. It is
 * always the vetted one — a server component passes `getTokenAddress()`, which
 * is `null` for anything that is not a real BEP-20 address, so this can never
 * be pointed at an arbitrary string.
 */
export function WalletBalance({
  address,
  decimals,
}: {
  address: string | null;
  decimals: number;
}) {
  const [state, setState] = useState<State>({ status: "idle" });

  async function read() {
    if (!address) return;

    const provider = window.ethereum;
    if (!provider) {
      setState({
        status: "error",
        message: "No browser wallet detected.",
      });
      return;
    }

    setState({ status: "busy" });

    try {
      const accounts = (await provider.request({
        method: "eth_requestAccounts",
      })) as string[];

      const account = accounts?.[0];
      if (!account) {
        setState({ status: "error", message: "No account was shared." });
        return;
      }

      const res = await fetch(BSC_RPC, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "eth_call",
          params: [
            { to: address, data: balanceOfCalldata(account) },
            "latest",
          ],
        }),
      });

      const body: { result?: string } = await res.json();
      if (!body.result || body.result === "0x") {
        setState({ status: "error", message: "The node did not answer." });
        return;
      }

      setState({
        status: "ready",
        account,
        balance: BigInt(body.result),
      });
    } catch (error) {
      // 4001 is the EIP-1193 code for "user rejected", which is not a fault.
      const rejected =
        typeof error === "object" &&
        error !== null &&
        (error as { code?: number }).code === 4001;

      setState({
        status: "error",
        message: rejected ? "Cancelled." : "Could not read the balance.",
      });
    }
  }

  if (!address) return null;

  return (
    <div className="mt-8 border-t border-edge pt-8">
      {state.status === "ready" ? (
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-mute-4">
            {shortenAddress(state.account)} holds
          </p>
          <p className="mt-3 text-3xl font-bold tabular-nums tracking-[-0.03em] text-accent">
            {formatTokenAmount(state.balance, decimals).compact}{" "}
            <span className="text-heading">{SYMBOL}</span>
          </p>
        </div>
      ) : (
        <button
          type="button"
          onClick={read}
          disabled={state.status === "busy"}
          className="group inline-flex min-h-12 items-center gap-2.5 rounded-xl border border-edge-strong px-6 font-semibold text-heading transition-[color,border-color] duration-300 hover:border-accent/60 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-60"
        >
          <Wallet className="size-4" aria-hidden="true" />
          {state.status === "busy" ? "Asking your wallet…" : "Check my balance"}
        </button>
      )}

      {state.status === "error" && (
        <p className="mt-3 text-sm text-mute-2">{state.message}</p>
      )}

      <p className="mt-4 max-w-md text-xs leading-5 text-mute-3">
        Read-only. This page never asks you to sign anything, never requests a
        token approval, and cannot move your funds.
      </p>
    </div>
  );
}
