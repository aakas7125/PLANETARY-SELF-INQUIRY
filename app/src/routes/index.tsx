import { createFileRoute } from "@tanstack/react-router";
import { CalculatorSection } from "@/components/calculator-section";
import { CloseSection } from "@/components/close-section";
import { FrameworkSection } from "@/components/framework-section";
import { HeroSection } from "@/components/hero-section";
import { PhoneInquiryBridge } from "@/components/phone-inquiry-bridge";
import { ProofSection } from "@/components/proof-section";
import { ResearchSection } from "@/components/research-section";
import { SiteNav } from "@/components/site-nav";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <main>
        <HeroSection />
        <CalculatorSection />
        <ProofSection />
        <FrameworkSection />
        <PhoneInquiryBridge />
        <ResearchSection />
        <CloseSection />
      </main>
      <footer className="border-t border-border px-4 py-8 text-center text-xs text-muted-foreground">
        Protect Four is a seeing-device, not a life-cycle assessor. Science citations are
        public literature; the philosophical architecture is Acharya Prashant’s AP Framework,
        offered here as a lens for study. Quotations remain with their authors. The Protect
        Four proposition is under investigation, not presented as a scientific theorem.
      </footer>
    </div>
  );
}
