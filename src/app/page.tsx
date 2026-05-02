import { PageBackdrop } from "@/components/layout/PageBackdrop";
import { BackgroundFX } from "@/components/motion/BackgroundFX";
import { CultureSection } from "@/components/sections/CultureSection";
import { Footer } from "@/components/sections/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { IdentitySection } from "@/components/sections/IdentitySection";
import { JoinSection } from "@/components/sections/JoinSection";
import { TraitsSection } from "@/components/sections/TraitsSection";
import { WhatIsSection } from "@/components/sections/WhatIsSection";
import { WhyNowSection } from "@/components/sections/WhyNowSection";

export default function HomePage() {
  return (
    <main className="relative isolate overflow-hidden">
      <PageBackdrop />
      <BackgroundFX />
      <HeroSection />
      <WhatIsSection />
      <WhyNowSection />
      <CultureSection />
      <IdentitySection />
      <TraitsSection />
      <JoinSection />
      <Footer />
    </main>
  );
}
