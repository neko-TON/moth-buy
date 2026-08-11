# Design Tokens — yieldra.io

All values extracted from `getComputedStyle()` on the live site, cross-checked against the
Tailwind classes in its SSR markup.

## Colors

Defined in `src/app/globals.css` under `@theme inline`. **This block is the rebrand surface** —
change these nine values and the entire page follows.

| Token | Hex | Role | Original class |
|---|---|---|---|
| `--color-ink` | `#10170D` | Page background; text on acid fills | `bg-[#10170D]` |
| `--color-ink-deep` | `#0C120A` | Metrics band, hero frame | `bg-[#0C120A]` |
| `--color-ink-raised` | `#121B0F` | Primary feature card | `bg-[#121B0F]` |
| `--color-acid` | `#BBFF00` | Accent: CTAs, icons, headline highlight | `bg-[#BBFF00]` |
| `--color-acid-hover` | `#A8E600` | CTA hover | `hover:bg-[#A8E600]` |
| `--color-sage` | `#AEB9A9` | Body copy | `text-[#AEB9A9]` |
| `--color-sage-dim` | `#9DA997` | Secondary body copy | `text-[#9DA997]` |
| `--color-sage-dimmer` | `#8F9C8A` | Labels, list keys | `text-[#8F9C8A]` |
| `--color-sage-faint` | `#7E8B79` | Smallest eyebrow text | `text-[#7E8B79]` |

Borders are `rgb(255 255 255 / 0.1)` (`border-white/10`) throughout; the hero gutter rules use
`white/[0.04]`. Button focus/disabled states use `white/15`.

**Stock Tailwind colors also appear** — `lime-600` `rgb(94,165,0)` / `lime-700` on the nav
button, and `gray-800 / gray-900/50 / gray-300 / gray-400` in the footer. These are *not* part
of the ink/sage system; see the footer note in PAGE_TOPOLOGY.md.

Page `theme-color` meta is `#111827` (Tailwind gray-900) — inconsistent with the actual
`#10170D` background, reproduced as-is.

## Typography

Single family: **Funnel Display** (Google Fonts, variable). Weights used: 400, 500, 600, 700.

| Role | Size | Line height | Tracking | Weight |
|---|---|---|---|---|
| Hero h1 (lg) | 84px (`5.25rem`) | 80.64px (`0.96`) | −3.78px (`-0.045em`) | 700 |
| Hero h1 (sm) | 60px | 60px | −2.4px | 700 |
| Hero h1 (base) | 48px | — | — | 700 |
| Features h2 | 48px | 60px | −1.68px (`-0.035em`) | 700 |
| CTA h2 | 48px | — | −0.03em | 700 |
| Primary feature h3 | 36px | 40px | −0.9px (`-0.025em`) | 700 |
| Card h3 | 24px | 32px | normal | 700 |
| Metrics h2 | 24px | 32px | normal | 600 |
| TVL figure | 60px | 60px | −2.4px (`-0.04em`) | 700 |
| Body large | 18px | 28–32px | normal | 400 |
| Body | 16px | 24–28px | normal | 400 |
| List / small | 14px | 20px | normal | 400 / 600 |
| Eyebrow (hero) | 12px | 16px | `0.24em` | 600 |
| Eyebrow (metrics) | 12px | 16px | 2.64px (`0.22em`) | 600 |
| Frame label | 10.4px (`0.65rem`) | 15.6px | 2.08px (`0.2em`) | 600 |
| Pillar label | 10.4px (`0.65rem`) | 15.6px | 1.872px (`0.18em`) | 600 |

## Spacing & shape

- Content column: `max-w-7xl` (1280px), padding `px-4 sm:px-6 lg:px-8`
- Radii: `rounded-xl` (buttons, icon chips), `rounded-2xl` (hero plate), `rounded-3xl` (hero frame), `rounded-full` (footer links)
- Feature cell padding: `4rem` primary, `3rem` secondary, `3rem 4rem` security — all `2rem 1.5rem` on mobile
- **No shadows anywhere.** Depth is conveyed purely by background steps and hairline borders.

## Icon inventory

Lucide (via `lucide-react`): `Layers3`, `ArrowRight`, `ArrowUpRight`, `ChartNoAxesCombined`,
`TrendingUp`, `Coins`, `Gift`, `ShieldCheck`.

Custom SVG in `src/components/icons.tsx`: `GitBookIcon`, `GithubIcon`, `XIcon`, `TelegramIcon`.
GitHub is hand-rolled because **lucide-react v1 removed all brand icons** — `Github` is not
exported. The other three were `i-simple-icons:*` in the source and never existed in Lucide.

### The Preflight box-model trap

The source renders icons as Iconify `<span>`s: `display: inline-block`, `vertical-align:
baseline`. Such an icon sits on the text baseline, so its line box includes ~6px of descender
space beneath the glyph.

Tailwind Preflight sets `svg { display: block; vertical-align: middle }`. A drop-in
`lucide-react` SVG therefore renders **6px shorter** than the span it replaces.

This is invisible in `.feature-fees` / `.feature-incentives` (the grid stretches those rows to
match the primary cell) but shifted the whole page by 6px via `.feature-security`. Fixed with
the `STANDALONE_ICON` class in `features-section.tsx`: `inline-block … align-baseline`.

Only applies to icons that are a **bare inline child** of a block. Icons inside a flex
container (nav, buttons, metrics header, footer) are flex items and unaffected.
