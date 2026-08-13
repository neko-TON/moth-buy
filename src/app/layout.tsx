import type { Metadata, Viewport } from "next";
import { Funnel_Display } from "next/font/google";
import { MotionDriver } from "@/components/motion-driver";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

/**
 * Runs before first paint, so scroll-reveal targets are hidden from the very
 * first frame rather than flashing in and back out. Everything motion-related
 * hangs off this one flag: no flag, no hiding, no animation — which is exactly
 * what we want when JS is unavailable or the visitor asked for less motion.
 *
 * The second clause restores the lamp switch. It has to happen here for the
 * same reason: setting it from the component would show a returning visitor a
 * fully lit page for one frame before darkening it. Both reads are wrapped
 * separately, because `localStorage` throws in some privacy modes and a
 * failure there must not cost the motion flag.
 */
const MOTION_FLAG = `try{if(!matchMedia("(prefers-reduced-motion: reduce)").matches){document.documentElement.dataset.motion="on"}}catch(e){}try{if(localStorage.getItem("moth-lamp")==="off"){document.documentElement.dataset.lamp="off"}}catch(e){}`;

const funnelDisplay = Funnel_Display({
  variable: "--font-funnel",
  subsets: ["latin"],
  display: "swap",
});

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

/**
 * No `maximumScale` or `userScalable: false` here on purpose. Locking zoom is
 * a habit picked up from native-app mimicry, and it takes pinch-to-zoom away
 * from exactly the people who need it. On a page whose entire job is to show
 * someone a 42-character contract address before they move money, being able
 * to magnify that address is not a nice-to-have.
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
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
