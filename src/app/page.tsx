import { PageBackdrop } from "@/components/layout/PageBackdrop";
import { Footer } from "@/components/sections/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { JoinSection } from "@/components/sections/JoinSection";
import { SpiritSection } from "@/components/sections/SpiritSection";
import { VibeSection } from "@/components/sections/VibeSection";
import { WhyNowSection } from "@/components/sections/WhyNowSection";

export default function HomePage() {
  return (
    <main className="relative isolate overflow-hidden">
      <PageBackdrop />
      <HeroSection />
      <WhyNowSection />
      <SpiritSection />
      <VibeSection />
      <JoinSection />
      <Footer />
    </main>
  );
}
