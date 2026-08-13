"use client";

import { useActionState } from "react";
import { type LoginState, login } from "@/app/admin/actions";

const INITIAL: LoginState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, INITIAL);

  return (
    <form action={formAction} className="mt-8 max-w-sm">
      <label
        htmlFor="password"
        className="block text-sm font-semibold text-heading"
      >
        Password
      </label>

      <input
        id="password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        autoFocus
        className="mt-3 w-full rounded-xl border border-edge-strong bg-ink-deep px-4 py-3 font-mono text-base text-heading outline-none focus-visible:border-accent/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      />

      {/* aria-live so the failure is announced, not only coloured. */}
      <p className="mt-3 min-h-5 text-sm text-accent" aria-live="polite">
        {state.error ?? ""}
      </p>

      <button
        type="submit"
        disabled={pending}
        className="btn-gold mt-3 inline-flex min-h-12 items-center rounded-xl bg-accent px-7 font-semibold text-accent-ink transition-colors duration-300 hover:bg-accent-hover disabled:cursor-wait disabled:opacity-70 disabled:hover:bg-accent"
      >
        {pending ? "Checking…" : "Sign in"}
      </button>
    </form>
  );
}
