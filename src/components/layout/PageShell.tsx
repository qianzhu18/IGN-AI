import type { ReactNode } from "react";

import { PageBackdrop } from "@/components/layout/PageBackdrop";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { BackgroundFX } from "@/components/motion/BackgroundFX";
import { Footer } from "@/components/sections/Footer";

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
