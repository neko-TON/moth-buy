"use client";

import { useSyncExternalStore } from "react";

/**
 * Turns off every light on the page.
 *
 * The joke the whole site is built on is that the expensive-looking part and
 * the honest part are unrelated. This is that joke as a control: take the
 * glow away and nothing underneath has changed — the same three Nones, the
 * same address, the same moth.
 *
 * The state is set on `<html>` so a stylesheet can do all the work, and it is
 * restored before first paint by the inline script in `layout.tsx`; doing it
 * here alone would show a lit page for one frame before darkening it.
 *
 * With JS off this does not render, which is right: a switch that cannot
 * switch should not be on the page.
 */
const KEY = "moth-lamp";

/**
 * The `<html>` attribute is the source of truth, not React state — the inline
 * script may already have set it from a previous visit before this component
 * ever mounts, and the stylesheet reads it either way. `useSyncExternalStore`
 * is the one hook that models exactly that: an external mutable value, with a
 * separate server snapshot so hydration starts from what the server rendered
 * and corrects itself immediately after.
 */
const listeners = new Set<() => void>();

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

const isLit = () => document.documentElement.dataset.lamp !== "off";

/** The server has no DOM and renders the lit page, so this must agree. */
const litOnServer = () => true;

export function LampSwitch() {
  const lit = useSyncExternalStore(subscribe, isLit, litOnServer);

  function toggle() {
    const next = !lit;

    const root = document.documentElement;
    if (next) delete root.dataset.lamp;
    else root.dataset.lamp = "off";

    try {
      localStorage.setItem(KEY, next ? "on" : "off");
    } catch {
      // Private modes throw on write. The switch still works for this visit.
    }

    for (const onChange of listeners) onChange();
  }

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
      {/* The label names the action, never the state; `aria-pressed` carries
          the state. A button reading "Lamp: on" leaves a screen-reader user
          guessing what pressing it does. */}
      <button
        type="button"
        onClick={toggle}
        aria-pressed={!lit}
        className="link-underline text-xs text-mute-2 transition-colors duration-300 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        {lit ? "Turn the lamp off" : "Turn the lamp on"}
      </button>
      <span className="text-xs text-mute-4">
        The moth is still there. It just isn’t lit.
      </span>
    </div>
  );
}
