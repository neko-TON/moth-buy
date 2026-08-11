import Image from "next/image";
import Link from "next/link";

/**
 * Top navigation. Note this bar is `relative`, not sticky — it scrolls away
 * with the page, matching the source.
 */
export function SiteHeader() {
  return (
    <nav className="relative z-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src="/images/logo/full-logo-on-dark.svg"
            alt="Yieldra Logo"
            width={380}
            height={120}
            className="h-8 w-auto"
            priority
            unoptimized
          />
        </Link>
        <button
          type="button"
          className="inline-flex transform items-center gap-2 rounded-xl bg-lime-600 px-8 py-3 font-sans text-lg font-medium text-white transition-all duration-200 hover:scale-105 hover:bg-lime-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acid"
        >
          Launch App
        </button>
      </div>
    </nav>
  );
}
