import Image from "next/image";
import { ArrowUpRight, Layers3 } from "lucide-react";
import { GetStartedButton } from "@/components/get-started-button";
import type { ProductPillar } from "@/types/landing";

const PILLARS: ProductPillar[] = ["AMM", "Lending", "Launchpad"];

/**
 * Hero: asymmetric two-column grid (see `.hero-grid`). The left column's
 * children stagger in via `.hero-copy > *`; the right frame reveals as a unit.
 * Collapses to a single column under 768px.
 */
export function HeroSection() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative border-b border-white/10"
    >
      {/* Hairline rules marking the content gutter */}
      <div
        className="pointer-events-none absolute inset-0 mx-auto max-w-7xl border-x border-white/[0.04]"
        aria-hidden="true"
      />

      <div className="hero-grid relative mx-auto grid min-h-[calc(100svh-92px)] max-w-7xl items-center gap-10 px-4 py-10 sm:px-6 lg:px-8">
        <div className="hero-copy max-w-3xl">
          <p className="mb-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-acid">
            <Layers3 className="size-4" aria-hidden="true" />
            Yieldra DeFi ecosystem
          </p>

          <h1
            id="hero-heading"
            className="max-w-4xl text-5xl font-bold leading-[0.96] tracking-[-0.045em] text-white sm:text-6xl lg:text-[5.25rem]"
          >
            Trading and lending,
            <span className="block text-acid">working as one.</span>
          </h1>

          <p className="mt-7 max-w-2xl text-base leading-7 text-sage sm:text-lg sm:leading-8">
            Yieldra brings an AMM, lending, and a launchpad into one connected
            platform, helping capital move efficiently across every protocol
            feature.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <GetStartedButton />
            <a
              href="https://docs.yieldra.io"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center gap-2 whitespace-nowrap rounded-xl border border-white/15 px-6 font-semibold text-white transition-colors duration-200 hover:border-acid/60 hover:text-acid"
            >
              Read Documentation
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="hero-visual relative min-h-[520px]" aria-hidden="true">
          <div className="hero-frame absolute inset-0 overflow-hidden rounded-3xl border border-white/10 bg-ink-deep">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-sage-dimmer">
              <span>Connected product layer</span>
              <span className="text-acid">Yieldra</span>
            </div>

            <div className="absolute inset-x-8 top-20 bottom-20 flex items-center justify-center overflow-hidden rounded-2xl bg-acid">
              <Image
                src="/images/yieldra.png"
                alt=""
                width={500}
                height={500}
                className="block size-[500px] max-h-full max-w-full object-contain"
                priority
              />
            </div>

            <div className="absolute right-0 bottom-0 left-0 grid grid-cols-3 border-t border-white/10 bg-ink-deep text-center text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-sage">
              {PILLARS.map((pillar, i) => (
                <span
                  key={pillar}
                  className={
                    i < PILLARS.length - 1
                      ? "border-r border-white/10 px-3 py-5"
                      : "px-3 py-5"
                  }
                >
                  {pillar}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
