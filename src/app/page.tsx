import { ContractSection } from "@/components/contract-section";
import { CtaSection } from "@/components/cta-section";
import { FeaturesSection } from "@/components/features-section";
import { HeroSection } from "@/components/hero-section";
import { MarketSection } from "@/components/market-section";
import { MetricsSection } from "@/components/metrics-section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

/**
 * The page is prerendered and regenerated at most once a minute. That covers
 * every on-chain read on it, including the JSON-RPC calls, which `fetch`
 * caching would not touch on its own because they are POSTs.
 *
 * A minute is chosen against what the figures are for: someone deciding
 * whether the pool is deep enough to bother with. Second-by-second ticks would
 * make the page dynamic, cost a render per visitor, and tell them nothing more.
 */
export const revalidate = 60;

export default function Home() {
  return (
    <div className="min-h-screen bg-ink">
      <SiteHeader />
      <main>
        <div className="overflow-hidden bg-ink text-heading">
          <HeroSection />
          <MetricsSection />
          <MarketSection />
          <FeaturesSection />
          <ContractSection />
          <CtaSection />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
