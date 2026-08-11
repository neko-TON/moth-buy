import { CtaSection } from "@/components/cta-section";
import { FeaturesSection } from "@/components/features-section";
import { HeroSection } from "@/components/hero-section";
import { MetricsSection } from "@/components/metrics-section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function Home() {
  return (
    <div className="min-h-screen bg-ink">
      <SiteHeader />
      <main>
        <div className="overflow-hidden bg-ink text-white">
          <HeroSection />
          <MetricsSection />
          <FeaturesSection />
          <CtaSection />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
