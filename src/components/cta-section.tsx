import { GetStartedButton } from "@/components/get-started-button";

/** Closing band: headline left, CTA right-aligned, rules top and bottom. */
export function CtaSection() {
  return (
    <section aria-labelledby="staking-heading" className="pb-24 sm:pb-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* `.band-glow` puts a slow warm pool behind this band, so the closing
            CTA reads as lit from the same source as the hero rather than as a
            second, unrelated gold object. */}
        <div
          className="band-glow cta-grid grid grid-cols-12 items-end gap-8 border-y border-edge py-12 sm:py-14"
          data-stagger
        >
          <div className="col-span-12 md:col-span-8" data-reveal>
            <h2
              id="staking-heading"
              className="text-3xl font-bold tracking-[-0.03em] text-heading sm:text-5xl"
            >
              See you at the lamp.
            </h2>
          </div>
          <div
            className="col-span-12 flex md:col-span-4 md:justify-end"
            data-reveal
          >
            <GetStartedButton />
          </div>
        </div>
      </div>
    </section>
  );
}
