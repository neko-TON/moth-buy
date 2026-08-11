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

export const metadata: Metadata = {
  metadataBase: new URL("https://yieldra.io"),
  title: "Unifying trading and lending into a multi-yield engine | Yieldra",
  description:
    "Yieldra is an all-in-one DeFi ecosystem, bringing together an AMM, lending, and launchpad into a united platform.",
  keywords: ["Yield", "DeFi", "Staking", "Lending", "Capital"],
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
    siteName: "Yieldra",
    title: "Yieldra - Unifying trading and lending into a multi-yield engine",
    description:
      "Yieldra is an all-in-one DeFi ecosystem, bringing together an AMM, lending, and launchpad into a united platform.",
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
