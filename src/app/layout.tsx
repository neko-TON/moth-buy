import type { Metadata, Viewport } from "next";
import { Funnel_Display } from "next/font/google";
import { MotionDriver } from "@/components/motion-driver";
import "./globals.css";

/**
 * Runs before first paint, so scroll-reveal targets are hidden from the very
 * first frame rather than flashing in and back out. Everything motion-related
 * hangs off this one flag: no flag, no hiding, no animation — which is exactly
 * what we want when JS is unavailable or the visitor asked for less motion.
 */
const MOTION_FLAG = `try{if(!matchMedia("(prefers-reduced-motion: reduce)").matches){document.documentElement.dataset.motion="on"}}catch(e){}`;

const funnelDisplay = Funnel_Display({
  variable: "--font-funnel",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Absolute URLs for OG need a base, and it must never be the localhost default
 * in production — a share card with a localhost image URL renders as a broken
 * box everywhere it is pasted. `NEXT_PUBLIC_SITE_URL` wins so a custom domain
 * can override; failing that, Vercel injects the project's production host at
 * build time, which is right for both preview and production deploys.
 */
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "$MOTH — a memecoin about a moth",
  description:
    "$MOTH is a memecoin. No protocol, no yield, no roadmap — just a token, a moth, and whatever the market decides that is worth.",
  keywords: ["MOTH", "memecoin", "token"],
  robots: { follow: true, index: true },
  icons: {
    icon: [
      { url: "/seo/favicon.ico" },
      { url: "/seo/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/seo/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/seo/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    type: "website",
    siteName: "$MOTH",
    title: "$MOTH — a memecoin about a moth",
    description:
      "No protocol, no yield, no roadmap. Just a token, a moth, and whatever the market decides that is worth.",
    images: ["/seo/og.png"],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#05070b",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${funnelDisplay.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: MOTION_FLAG }} />
      </head>
      <body className="flex min-h-full flex-col">
        <MotionDriver />
        {children}
      </body>
    </html>
  );
}
