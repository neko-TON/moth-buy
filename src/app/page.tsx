import { ColophonSection } from "@/components/colophon-section";
import { ContractSection } from "@/components/contract-section";
import { CtaSection } from "@/components/cta-section";
import { FeaturesSection } from "@/components/features-section";
import { HeroSection } from "@/components/hero-section";
import { MarketSection } from "@/components/market-section";
import { MetricsSection } from "@/components/metrics-section";
import { RiskSection } from "@/components/risk-section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { TermsSection } from "@/components/terms-section";

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
          {/* Terms sits directly under the hero because the three words it
              defines are ~200px above it, along the bottom of the frame.
              Defining them four sections later would be a footnote.

              Risk sits between the market figures and the four statements: two
              of its items point back at the liquidity number and the
              concentration bar the reader has just passed, and separating a
              claim from its evidence by a whole section costs more than the
              tidier ordering gains. */}
          <HeroSection />
          <TermsSection />
          <MetricsSection />
          <MarketSection />
          <RiskSection />
          <FeaturesSection />
          <ContractSection />
          <CtaSection />
          <ColophonSection />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
