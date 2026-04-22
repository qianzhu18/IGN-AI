import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type SectionContainerProps = {
  id?: string;
  className?: string;
  children: ReactNode;
};

export function SectionContainer({
  id,
  className,
  children,
}: SectionContainerProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative z-10 border-t border-white/8 first:border-t-0",
        className,
      )}
    >
      <div className="mx-auto w-full max-w-[1280px] px-6 py-24 sm:px-8 lg:px-12 lg:py-32">
        {children}
      </div>
    </section>
  );
}

