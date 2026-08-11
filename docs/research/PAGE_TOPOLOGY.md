# Page Topology — yieldra.io

Single page, no routes beyond `/`. Total document height **2815px @ 1440w**, **3860px @ 390w**.

## Source stack

| | Original | Clone |
|---|---|---|
| Framework | Nuxt 3 (Vue), SSR | Next.js 16 App Router, RSC |
| Styling | Tailwind v4 + Nuxt UI | Tailwind v4 + shadcn |
| Icons | Iconify CSS masks (`i-lucide:*`, `i-simple-icons:*`) | `lucide-react` + 4 hand-rolled brand SVGs |
| Font | Funnel Display (self-hosted woff2) | Funnel Display via `next/font/google` |

The original ships **literal Tailwind utility classes in its SSR markup**, so the design was
recovered verbatim rather than inferred. See `original-body.html` (cleaned markup) and
`index.DctJJbnr.css` (scoped layout CSS).

## Section order

All sections are static flow content. **Nothing is sticky, fixed, or scroll-driven.**
The nav is `relative` and scrolls away with the page.

| # | Section | Component | y@1440 | h@1440 | Notes |
|---|---------|-----------|--------|--------|-------|
| 0 | Nav | `site-header.tsx` | 0 | 100 | Logo + "Launch App". Not sticky. |
| 1 | Hero | `hero-section.tsx` | 100 | 809 | `.hero-grid` 1.12fr/0.88fr. Only animated section. |
| 2 | Metrics | `metrics-section.tsx` | 909 | 315 | 7/5 col split, `bg-ink-deep`. |
| 3 | Features | `features-section.tsx` | 1224 | 1200 | `.feature-grid` mosaic. |
| 4 | CTA | `cta-section.tsx` | 2424 | 278 | 8/4 col split, rules top+bottom. |
| 5 | Footer | `site-footer.tsx` | 2702 | 113 | Was stock grays — see below. |

## Layer / structure notes

- **Hero gutter rules** — an `absolute inset-0 max-w-7xl border-x border-white/[0.04]`
  overlay draws the hairline verticals framing the content column. `pointer-events-none`.
- **Hero frame** — the right panel is a single `absolute inset-0` card containing three
  stacked children: a header strip, an `inset-x-8 top-20 bottom-20` acid-green plate holding
  the 3D logo, and a bottom-anchored 3-column pillar row.
- **Feature mosaic** — `.feature-primary` spans two grid rows on the left; fees/incentives
  stack on the right; `.feature-security` spans `1 / -1` beneath. The right column's row
  heights are *grid-stretched* to match the primary cell (264 + 263 = 527), not content-driven.
- **Footer palette — resolved.** The yieldra original styled this band with stock Tailwind
  grays (`border-gray-800 bg-gray-900/50 text-gray-300/400`) that sat outside its own palette,
  and the 1:1 clone reproduced that inconsistency deliberately. The myblockfirm palette swap
  folded them into the token system (`border-edge` / `bg-ink-deep` / `text-mute-1` /
  `text-mute-2`), so the footer is no longer an outlier.

## Assets

| Asset | Size | Use |
|---|---|---|
| `images/logo/full-logo-on-dark.svg` | 380×120 | Nav wordmark, rendered at `h-8` |
| `images/logo/logo-on-dark.svg` | 160×200 | Footer mark, rendered at `size-12` |
| `images/yieldra.png` | 1024×1024 | 3D glass logo in hero plate |
| `seo/*` | — | favicon.ico, 16/32px PNGs, apple-touch-icon, OG image |

No videos, no CSS background images, no inline SVG in the source (icons were all CSS masks).
