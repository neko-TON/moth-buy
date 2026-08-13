import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * Nothing here is private, so everything is allowed. The file earns its place
 * by naming the sitemap: without it, a crawler has to guess the location.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
