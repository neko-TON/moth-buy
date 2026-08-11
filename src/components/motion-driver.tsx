"use client";

import { useEffect } from "react";

/**
 * Drives every `[data-reveal]` element on the page from a single
 * IntersectionObserver, adding `is-in` once the element crosses into view and
 * then dropping it — a reveal is one-way, so there is nothing to keep watching.
 *
 * The corresponding *hidden* state lives behind `html[data-motion="on"]`, which
 * an inline script in `layout.tsx` sets before first paint. That split is what
 * makes this safe: if this component never runs, or JS is off, or the visitor
 * prefers reduced motion, the flag is absent and the content simply renders.
 *
 * Elements added after mount are picked up by the MutationObserver, so sections
 * can be conditionally rendered without wiring anything up here.
 */
export function MotionDriver() {
  useEffect(() => {
    const root = document.documentElement;
    if (root.dataset.motion !== "on") return;

    // Nothing below may leave content stuck at opacity 0. If the observer is
    // unavailable, drop the flag entirely — that un-hides every target through
    // the `[data-motion="on"]` selector and costs only the animation.
    if (typeof IntersectionObserver === "undefined") {
      delete root.dataset.motion;
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        }
      },
      // Fire a little before the element is fully on screen, so the transition
      // is already underway by the time it reads as "arrived".
      { rootMargin: "0px 0px -10% 0px", threshold: 0.15 },
    );

    const observe = (el: Element) => {
      if (!el.classList.contains("is-in")) observer.observe(el);
    };

    const observeAll = (scope: Element | Document) => {
      if (scope instanceof Element && scope.matches("[data-reveal]")) {
        observe(scope);
      }
      for (const el of scope.querySelectorAll("[data-reveal]")) observe(el);
    };

    observeAll(document);

    const mutations = new MutationObserver((records) => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (node instanceof Element) observeAll(node);
        }
      }
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutations.disconnect();
    };
  }, []);

  return null;
}
