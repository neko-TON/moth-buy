# Behaviors — yieldra.io

Interaction sweep result: **this page is almost entirely static.** No scroll-driven state,
no tabs, no carousels, no modals, no smooth-scroll library (no Lenis / Locomotive), no
`IntersectionObserver`, no `scroll-snap`, no sticky header. Everything below is the
complete set of moving parts.

## Entrance animations (the only animation on the page)

One keyframe, `reveal-up`: `opacity 0 → 1`, `translateY(14px) → 0`.

| Target | Duration | Delay | Fill |
|---|---|---|---|
| `.hero-copy > *` (child 1) | 0.6s ease-out | 0 | both |
| `.hero-copy > *` (child 2) | 0.6s ease-out | 60ms | both |
| `.hero-copy > *` (child 3) | 0.6s ease-out | 120ms | both |
| `.hero-copy > *` (child 4) | 0.6s ease-out | 180ms | both |
| `.hero-copy > *` (child 5) | 0.6s ease-out | 240ms | both |
| `.hero-visual` | 0.7s ease-out | 140ms | both |

Fires once on load. Not scroll-triggered — sections 2–5 have no entrance animation at all.

`@media (prefers-reduced-motion: reduce)` sets `animation: none` on both selectors. Honoured.

> **QA note.** `reveal-up` starts at `translateY(14px)`, and `getBoundingClientRect()`
> includes transforms. When measuring in a hidden/background tab the document timeline is
> frozen at 0, so elements report 14px low. Call
> `document.getAnimations().forEach(a => a.finish())` before measuring, or you will chase a
> phantom 14px offset.

## Hover states

| Element | Change | Transition |
|---|---|---|
| "Launch App" (nav) | `bg-lime-600 → bg-lime-700`, `scale(1) → scale(1.05)` | `all 200ms` |
| "Get Started" (×2) | `bg-acid → bg-acid-hover` (#BBFF00 → #A8E600) | `colors 200ms` |
| "Get Started" arrow | `translateX(0) → translateX(0.25rem)` via `group-hover` | `transform 200ms` |
| "Read Documentation" | border `white/15 → acid/60`, text `white → acid` | `colors 200ms` |
| Footer social links | text `gray-400 → white`, bg `transparent → acid/10` | `colors` |

No hover states on cards, list rows, metrics, or the logo.

## Responsive

Exactly **one breakpoint that restructures layout: `max-width: 767px`.** Tailwind's `sm:`
(640px) and `lg:` (1024px) only adjust type sizes and padding.

At ≤767px:
- `.hero-grid` → single column, `min-height: auto`, 3.5rem vertical padding
- `.hero-visual` → `min-height: 380px`
- `.metrics-grid` → single column; `.metrics-secondary` swaps left border for top border
- `.feature-grid` → single column; `.feature-primary` drops row-span and right border
- all feature cells → `2rem 1.5rem` padding
- `.feature-security` → single column, `align-items: start`, no top border
- `.cta-grid` → single column

Verified at 1440 / 768 / 390. Type ramp: h1 `48px → 60px (sm) → 84px (lg)`.

## Non-behaviors worth recording

- "Launch App" and both "Get Started" buttons are `<button>` with **no click handler** in the
  source — they are inert. Reproduced as inert. Wire them up during the rebrand.
- The TVL figure is hardcoded `$0`; the three availability rows are hardcoded "Coming Soon".
  There is no live data fetch despite the "Live protocol data" label.
- A `<ol>` toast container (`z-[100]`, height 0) exists in the source — Nuxt UI boilerplate,
  never populated. Omitted.
