# $MOTH

Landing page for **$MOTH**, a memecoin about a moth. One page, no backend, no API.

The site makes no product claims on purpose: there is no yield, no utility, and no
roadmap, and the copy says exactly that. The joke is the register — institutional
DeFi typography making entirely honest statements.

```bash
npm install
npm run dev
```

## Stack

- **Next.js 16** — App Router, React 19, TypeScript strict
- **Tailwind CSS v4** — tokens in `src/app/globals.css` under `@theme inline`
- **Funnel Display** via `next/font/google`, the only family on the page
- **lucide-react** for icons; the brand mark is hand-drawn in `src/components/moth-mark.tsx`

## Commands

```bash
npm run dev        # dev server on :3000
npm run build      # production build
npm run check      # lint + typecheck + build
node scripts/build-icons.mjs   # regenerate favicons and the OG image from the SVGs
```

`build-icons.mjs` needs `sharp` (`npm i -D sharp`); it is not a runtime dependency.

## Layout of the code

```
src/
  app/            layout.tsx (metadata, fonts, motion flag), page.tsx, globals.css
  components/     one file per section, plus moth-mark.tsx and motion-driver.tsx
  types/          shared interfaces
public/
  images/logo/    the mark as SVG, and the OG composition
  seo/            generated — do not hand-edit
docs/research/    design tokens, page topology, motion behaviors
```

Three things in here are easy to break; each is documented where it lives:

- **`@theme inline` and `:root` must change together.** The second block mirrors every
  token for shadcn, and editing only the first leaves those components behind.
- **Scroll reveals hide content only when `html[data-motion="on"]` is set**, by an inline
  script before first paint. With JS off or `prefers-reduced-motion`, nothing hides.
- **The glow is layered, not a single wide shadow** — see "Light" in `globals.css`.

See `docs/research/` for the full account.

## Known placeholders

- Total supply is an em-dash. No token has been deployed.
- `#contract` has no target yet, so both "Read the contract" links go nowhere.
- The "Buy $MOTH" buttons are inert.

## Origins

Built from [ai-website-cloner-template](https://github.com/JCodesMore/ai-website-cloner-template)
by JCodesMore (MIT — see `LICENSE`).

The layout began as a study of [yieldra.io](https://yieldra.io/) and was then rebranded:
their name, marks, icons, copy, domains, and social accounts are all gone, and so are the
markup and stylesheet copies that backed the original work. What remains is structure —
section order, grid ratios, type scale — rebuilt in this codebase and re-skinned. The
measurements that guided it are recorded in `docs/research/` rather than quietly dropped.

## License

MIT
