import type { ReactNode } from "react";

import { PageBackdrop } from "@/src/components/layout/PageBackdrop";
import { SiteHeader } from "@/src/components/layout/SiteHeader";
import { BackgroundFX } from "@/src/components/motion/BackgroundFX";
import { Footer } from "@/src/components/sections/Footer";

type PageShellProps = {
  children: ReactNode;
};

export function PageShell({ children }: PageShellProps) {
  return (
    <main className="relative isolate min-h-screen overflow-hidden">
      <PageBackdrop />
      <BackgroundFX />
      <SiteHeader />
      {children}
      <Footer />
    </main>
  );
}
