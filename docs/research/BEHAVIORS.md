# Behaviors — $MOTH

The yieldra original this layout was recovered from was almost entirely static: no
scroll-driven state, no `IntersectionObserver`, one keyframe. **That is no longer true.**
The light/motion pass added a reveal system and a set of hover states, and the $MOTH
rebrand changed every string they act on. What follows describes this build.

## Entrance: the hero

`reveal-up` — `opacity 0 → 1`, `translateY(14px) → 0`. Fires once on load, CSS only.

| Target | Duration | Delay | Fill |
|---|---|---|---|
| `.hero-copy > *` (child 1) | 0.6s ease-out | 0 | both |
| `.hero-copy > *` (child 2) | 0.6s ease-out | 60ms | both |
| `.hero-copy > *` (child 3) | 0.6s ease-out | 120ms | both |
| `.hero-copy > *` (child 4) | 0.6s ease-out | 180ms | both |
| `.hero-copy > *` (child 5) | 0.6s ease-out | 240ms | both |
| `.hero-visual` | 0.7s ease-out | 140ms | both |

## Entrance: everything below the fold

18 `[data-reveal]` targets across sections 2–5, driven by a single `IntersectionObserver`
in `motion-driver.tsx` (`threshold 0.15`, `rootMargin 0 0 -10% 0`). On intersection the
element gets `is-in` and is unobserved — a reveal is one-way.

The *hidden* half lives behind `html[data-motion="on"]`, set by an inline script in
`layout.tsx` before first paint. That split is the whole safety story: no flag means no
hiding, so content renders plainly with JS off, under `prefers-reduced-motion`, or if the
driver never mounts. The driver additionally drops the flag outright when
`IntersectionObserver` is missing.

Reveals use `transition`, not `animation`, so they cannot re-fire and stay on the
compositor. `[data-stagger]` adds 90ms per child.

## Ambient loops

| Selector | Keyframe | Period |
|---|---|---|
| `.hero-ambient::before` | `light-drift` | 26s |
| `.hero-ambient::after` | `light-drift` | 34s, reversed, −12s |
| `.hero-plate::before` | `bloom-breathe` | 11s |
| `.band-glow::before` | `bloom-breathe` | 17s, −6s |
| `.hero-logo` | `float-soft` | 7.5s |
| `.hero-frame::after` | `sheen-pass` | 15s, 4s delay — suppressed ≤767px |

The two drift periods are deliberately coprime-ish so the rig never visibly returns to
the same frame.

## Hover states

| Element | Change |
|---|---|
| `.btn-gold` (nav + both CTAs) | bloom widens across 4 radii, `translateY(-2px)`, accent *lightens* |
| CTA arrow | `translateX(0 → 0.375rem)`, 300ms |
| "Read the contract" | border → `accent/60`, text → accent, warm shadow, arrow moves diagonally |
| `.feature-grid > article` | tinted by `background-image` + inset pooled light |
| `.feature-icon` | drop-shadow glow, `translateY(-2px)` |
| `.pillar` | text → accent, faint accent wash |

Cards are tinted with a background **image**, not colour: `.feature-primary` carries
`bg-ink-raised`, and a colour here wins on specificity and would drop it to page black.

## Reduced motion

`@media (prefers-reduced-motion: reduce)` kills every ambient loop, hides the sheen,
forces `[data-reveal]` visible, and removes the hover translations. Combined with the
inline flag never being set, the motion system is inert there rather than merely instant.

## Responsive

Exactly **one breakpoint that restructures layout: `max-width: 767px`.** Tailwind's `sm:`
(640px) and `lg:` (1024px) only adjust type sizes and padding.

At ≤767px the hero, metrics, features and CTA grids all collapse to one column, the
`.metrics-secondary` rule flips from a left border to a top border, feature cells drop to
`2rem 1.5rem`, and the ambient rig is re-aimed (key light moves over the copy, fill
stretches full width, sheen is disabled).

Type ramp: h1 `48px → 60px (sm) → 84px (lg)`.

> **Headline fits are measured, not guessed.** At the `lg` size the h1 column is 659px.
> `Drawn to light,` is 540px and `same as you.` is 481px, so neither line breaks. The
> earlier `Drawn to the light,` measured 677px and orphaned a word onto its own line.

## QA notes

- `reveal-up` starts at `translateY(14px)`, and `getBoundingClientRect()` includes
  transforms. Finish animations before measuring — but skip the infinite ones, since
  `finish()` throws on them and can leave the element parked at a keyframe extreme.
- **A hidden document suspends `IntersectionObserver` entirely.** In a background or
  offscreen tab no callback ever fires, so all 18 reveals stay at `opacity: 0` and the page
  screenshots black below the fold. Delete `document.documentElement.dataset.motion` to
  measure or capture — that is the same path reduced-motion users take.

## Non-behaviors worth recording

- The nav button and both CTAs are still inert `<button>`s. The hero's second action and
  the security card both point at `#contract`, which does not exist yet.
- The supply figure is a placeholder em-dash and the three rows are hardcoded "None".
  There is no data fetch, and the copy no longer implies there is one.
