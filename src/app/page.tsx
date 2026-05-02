import { PageBackdrop } from "@/components/layout/PageBackdrop";
import { BackgroundFX } from "@/components/motion/BackgroundFX";
import { CommunityRolesSection } from "@/components/sections/CommunityRolesSection";
import { CultureSection } from "@/components/sections/CultureSection";
import { FieldNotesSection } from "@/components/sections/FieldNotesSection";
import { Footer } from "@/components/sections/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { JoinSection } from "@/components/sections/JoinSection";
import { UpcomingEventsSection } from "@/components/sections/UpcomingEventsSection";
import { WhatIsSection } from "@/components/sections/WhatIsSection";

export default function HomePage() {
  return (
    <main className="relative isolate overflow-hidden">
      <PageBackdrop />
      <BackgroundFX />
      <HeroSection />
      <WhatIsSection />
      <CultureSection />
      <UpcomingEventsSection />
      <FieldNotesSection />
      <CommunityRolesSection />
      <JoinSection />
      <Footer />
    </main>
  );
}
