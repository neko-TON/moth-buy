import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * One page, one entry. `lastModified` is left off deliberately: it is only
 * useful if it is true, and a build timestamp would claim the content changed
 * every time the site is redeployed for unrelated reasons.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: SITE_URL, changeFrequency: "monthly", priority: 1 }];
}
