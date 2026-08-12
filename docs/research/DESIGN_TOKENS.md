# Design Tokens — $MOTH

All values extracted from `getComputedStyle()` on the live site, cross-checked against the
Tailwind classes in its SSR markup.

## Colors

Defined in `src/app/globals.css` under `@theme inline`. **This block is the rebrand surface** —
change these values and the entire page follows.

The palette was swapped from yieldra.io's green/sage system to **myblockfirm.com's blue-black
and gold**. That site declares a clean named `:root`, so the mapping is by *role*, not by
eyeballing. Layout geometry was re-verified after the swap: byte-identical at both breakpoints.

| Token | Hex | Role | Source var |
|---|---|---|---|
| `--color-ink` | `#05070B` | Page background | `--ink` |
| `--color-ink-deep` | `#080B12` | Metrics band, hero frame, footer | `--ink-2` |
| `--color-ink-raised` | `#0B0F17` | Primary feature card | `--panel` |
| `--color-accent` | `#F2B84B` | CTAs, icons, headline highlight | `--gold` |
| `--color-accent-hover` | `#FFD37A` | CTA hover — **lightens**, see below | `--gold-hot` |
| `--color-accent-ink` | `#181004` | Text/icon on an accent fill | (their `.btn-gold`) |
| `--color-heading` | `#E9EEF6` | Headings — a cool off-white, *not* `#fff` | `--text` |
| `--color-mute-1` | `#8792A6` | Body copy | `--mute` |
| `--color-mute-2` | `#768195` | Secondary body copy | interpolated |
| `--color-mute-3` | `#646F83` | Labels, list keys | interpolated |
| `--color-mute-4` | `#535E72` | Smallest eyebrow text | `--dim` |
| `--color-edge` | `rgb(150 168 200 / .13)` | All hairline borders | `--edge` |
| `--color-edge-strong` | `rgb(150 168 200 / .34)` | Button borders, focus | (their hover edge) |
| `--color-edge-faint` | `rgb(150 168 200 / .06)` | Hero gutter rules | — |

Three things about this palette are easy to get wrong:

1. **The accent lightens on hover** (`#F2B84B → #FFD37A`), the inverse of the usual
   darken-on-hover reflex. The old palette darkened. Don't "fix" this.
2. **Hairlines are blue-grey, not white.** The source uses `rgba(150,168,200,.13)`, and on a
   blue-black base that reads meaningfully differently from `white/10`. All 11 border sites,
   the `divide-` rule and the hero gutter rules were migrated.
3. **Headings are `#E9EEF6`, not pure white.** 14 sites.

Token names changed with the values: `acid → accent`, `sage → mute-1..4`. The old names
described the yieldra hues (acid green, sage) and would have been actively misleading holding
gold and blue-grey. The ramp is `mute-*`, not `muted-*`, to stay clear of shadcn's `--muted`.

The `:root` block below `@theme` mirrors every token for shadcn. **Both must be changed
together** — editing only `@theme` leaves shadcn components on the old palette.

### Contrast: what the swap cost

The source runs a much wider text ramp than yieldra did, so every muted step lost ~2.0–2.5
points of contrast against the background:

| Token | Before | After | WCAG |
|---|---|---|---|
| `mute-1` (body) | 8.96:1 | 6.42:1 | AA |
| `mute-2` | 7.44:1 | 5.13:1 | AA |
| `mute-3` (labels) | 6.34:1 | **3.98:1** | AA-large only |
| `mute-4` (eyebrow) | 5.09:1 | **3.08:1** | AA-large only |
| accent | 15.14:1 | 11.26:1 | AAA |
| headings | 18.25:1 | 17.30:1 | AAA |

`mute-3` and `mute-4` are used at 10.4–14px, so AA-large does not cover them. This is faithful
— myblockfirm runs its own eyebrows at exactly `#535E72` — but it is a real regression from the
previous build. To claw it back without leaving the palette, lift `mute-4` to `#758094`
(5.06:1) and `mute-3` to `#707B8F` (4.72:1); both still read as the same family.

Their `--pos #3DDBA4` / `--neg #F06A6A` are carried into `:root` as `--success` / `--destructive`
but are unused by this page.

### Emission channels

| Var | Value | Use |
|---|---|---|
| `--glow` | `242 184 75` | Near-field light — same hue as the accent |
| `--glow-far` | `255 201 122` | Far-field light — paler and warmer |
| `--glow-cool` | `118 150 210` | The hero's fill light, opposite the key |

Stored as bare RGB triplets, not hexes, so each layer can pick its own alpha off
one hue (`rgb(var(--glow) / 0.24)`).

`--glow-far` exists because scattered light desaturates as it travels. Painting a
wide outer field in the source colour is precisely what makes a glow read as a
neon sticker, so every stack fades *through* the paler value on its way out.

Page `theme-color` meta is `#05070B`, matching the real background (the yieldra original had a
mismatched `#111827` here).

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
- **No neutral shadows.** Nothing on the page casts a grey drop shadow; depth still
  comes from background steps and hairline borders. The only shadows are *emission* —
  warm light thrown by the gold surfaces (`.hero-plate`, `.btn-gold`) and pooled
  light inside a hovered feature cell. See "Light" in `globals.css`.

## Icon inventory

Lucide (via `lucide-react`): `ArrowRight`, `ArrowUpRight`, `ChartNoAxesCombined`, `Lamp`,
`TrendingDown`, `CircleSlash`, `FileSearch`.

Icons were re-picked during the rebrand because the inherited set argued against the copy —
a `TrendingUp` arrow sat on the card that says the token has no yield. Each icon now agrees
with its card, which matters more here than usual: the whole brand rests on the copy being
literally true.

The brand mark lives in `src/components/moth-mark.tsx`, not in `icons.tsx`. The four
hand-rolled social glyphs in `icons.tsx` are currently unused — the footer's link row was
removed with the old project's accounts.

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
