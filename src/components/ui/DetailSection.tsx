import type { ReactNode } from "react";

type DetailSectionProps = {
  title: string;
  children: ReactNode;
};

export function DetailSection({ title, children }: DetailSectionProps) {
  return (
    <section className="border-t border-white/10 py-8 first:border-t-0 first:pt-0">
      <h2 className="text-[1.55rem] font-semibold leading-[1.28] text-white">
        {title}
      </h2>
      <div className="mt-4 text-base leading-8 text-white/64">{children}</div>
    </section>
  );
}
