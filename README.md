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

## The on-chain layer

Every figure on the page is read from a public source at request time. Nothing
is typed in by hand, and nothing needs an API key — the site keeps working for
anyone who clones this repo.

| Source | Gives us | Key needed |
| --- | --- | --- |
| Contract via public BSC RPC | total supply, decimals, a visitor's balance | no |
| DexScreener | price, liquidity, 24h volume, deepest pool | no |
| GeckoTerminal | holder count, concentration by rank band | no |

The page is prerendered and regenerated at most once a minute
(`export const revalidate` in `app/page.tsx`), which covers the JSON-RPC calls
too — those are POSTs, and `fetch` caching would not touch them on its own.

Each reader resolves to `null` on failure rather than throwing, so a dead
third-party API costs one em-dash instead of the whole page.

**One variable switches all of it on.** Until `NEXT_PUBLIC_MOTH_ADDRESS` holds a
valid address (see `.env.example`), the site says so plainly everywhere: no
address in `#contract`, a disabled buy button, em-dashes instead of figures. A
malformed value is ignored rather than passed through, so a typo cannot reach a
BscScan or PancakeSwap link. Nothing needs editing at launch beyond filling it in.

### What this site will never do

The buy button is a deep link into PancakeSwap's own interface; the swap runs on
their audited contracts in their UI. This site builds no transaction, requests no
token approval, and asks for no signature. `wallet-balance.tsx` calls exactly one
wallet method — `eth_requestAccounts` — and reads the balance from a public RPC,
so it does not even ask the wallet to switch networks.

That restraint is deliberate. A page that trains visitors to click "connect" and
approve whatever appears next is doing the groundwork for whoever phishes them
later.

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
