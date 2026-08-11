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
        <Link
          href="/"
          className="flex items-center transition-opacity duration-300 hover:opacity-80"
        >
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
          className="btn-gold inline-flex items-center gap-2 rounded-xl bg-accent px-8 py-3 font-sans text-lg font-medium text-accent-ink hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Launch App
        </button>
      </div>
    </nav>
  );
}
