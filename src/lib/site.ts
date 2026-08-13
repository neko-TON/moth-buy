/**
 * The canonical origin, resolved once and shared by everything that needs an
 * absolute URL: OG card images, robots, and the sitemap.
 *
 * It must never fall back to localhost in production — a share card whose
 * image URL points at localhost renders as a broken box everywhere it is
 * pasted, and a sitemap full of localhost URLs is worse than no sitemap.
 * `NEXT_PUBLIC_SITE_URL` wins so a custom domain can override; failing that,
 * Vercel injects the project's production host at build time, which is right
 * for both preview and production deploys.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");
