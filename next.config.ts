import type { NextConfig } from "next";

/**
 * Security headers.
 *
 * `frame-ancestors 'none'` is the one that earns its place here. A token
 * landing page is a natural target for framing: wrap the real site in an
 * invisible iframe, overlay your own "connect wallet" button, and the visitor
 * believes they are still on the page they trust. Refusing to be framed at all
 * removes that whole class of attack. `X-Frame-Options` says the same thing to
 * anything too old to read the CSP.
 */
const SECURITY_HEADERS = [
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
];

const nextConfig: NextConfig = {
  output: "standalone",

  experimental: {
    /**
     * Ship the stylesheet inside the HTML instead of behind a <link>.
     *
     * Measured against the deployed site: the browser could not discover the
     * stylesheet until it had parsed the HTML, so the render-blocking CSS
     * became a second serial round trip on a connection whose round trip costs
     * ~270ms. First paint sat at ~2.1s while the document itself had arrived
     * long before.
     *
     * The trade-off in Next's own guidance is returning visitors, who lose a
     * separately cacheable stylesheet. That trade is easy here: this is a
     * one-page site people reach from a link once, and the CSS is atomic
     * Tailwind, so it is small enough to carry inline.
     */
    inlineCss: true,
  },

  async headers() {
    return [{ source: "/:path*", headers: SECURITY_HEADERS }];
  },
};

export default nextConfig;
