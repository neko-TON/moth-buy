import Image from "next/image";
import {
  GitBookIcon,
  GithubIcon,
  TelegramIcon,
  XIcon,
} from "@/components/icons";
import type { SocialLink } from "@/types/landing";

const SOCIALS: SocialLink[] = [
  { href: "https://docs.yieldra.io/", label: "Documentation", icon: GitBookIcon },
  { href: "https://github.com/yieldra-protocol", label: "GitHub", icon: GithubIcon },
  { href: "https://x.com/YieldraProtocol", label: "X", icon: XIcon },
  { href: "https://t.me/YieldraProtocol", label: "Telegram", icon: TelegramIcon },
];

/**
 * Footer. The yieldra original styled this band with stock Tailwind grays that
 * sat outside its own palette; the palette swap folded them into the token
 * system (edge / ink-deep / mute), so the footer is now consistent with the
 * rest of the page rather than an outlier.
 */
export function SiteFooter() {
  return (
    <footer className="border-t border-edge bg-ink-deep">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between md:flex-row">
          <div className="mb-4 flex items-center gap-3 md:mb-0">
            <Image
              src="/images/logo/logo-on-dark.svg"
              alt="Yieldra DEX"
              width={160}
              height={200}
              className="size-12"
              unoptimized
            />
            <span className="text-mute-1">
              © 2026 Yieldra DEX. All rights reserved.
            </span>
          </div>
          <div className="flex items-center gap-4">
            {SOCIALS.map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="inline-flex items-center gap-1.5 rounded-full p-1.5 text-xs font-medium text-mute-2 transition-colors hover:bg-accent/10 hover:text-heading focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <Icon className="size-4 shrink-0" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
