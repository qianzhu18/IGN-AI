"use client";

import { Reveal } from "@/components/motion/Reveal";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { traitCards } from "@/content/community";

export function TraitsSection() {
  return (
    <SectionContainer id="traits">
      <div className="grid gap-12 xl:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] xl:gap-16">
        <div className="xl:sticky xl:top-24 xl:h-fit">
          <Reveal>
            <p className="text-xs font-medium uppercase tracking-[0.34em] text-[#F0CB8A]/78">
              05 / Traits
            </p>
            <h2 className="mt-6 max-w-[10ch] font-display text-[3.4rem] italic leading-[0.92] tracking-[-0.045em] text-white sm:text-[4.6rem] lg:text-[5.4rem]">
              What makes
              <br />
              IGNAI different
            </h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-white/58 sm:text-lg">
              本地土壤、国际视野、技术密度与真实连接，构成了 IGNAI 最核心的社区气质。
            </p>
          </Reveal>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {traitCards.map((card, index) => (
            <Reveal key={card.title} delay={index * 0.06}>
              <div
                className={`relative h-full overflow-hidden rounded-[26px] border p-6 sm:p-7 ${
                  index === 0 || index === 3
                    ? "border-[#ffb879]/14 bg-[#0d1118]/90 shadow-[0_24px_70px_rgba(0,0,0,0.44)]"
                    : "border-[#7cc8ff]/14 bg-[#08121d]/88 shadow-[0_24px_70px_rgba(0,0,0,0.44)]"
                }`}
              >
                <div
                  className={`absolute inset-y-0 left-0 w-px ${
                    index === 0 || index === 3
                      ? "bg-[linear-gradient(180deg,transparent_0%,#ff9a3c_46%,transparent_100%)]"
                      : "bg-[linear-gradient(180deg,transparent_0%,#7cc8ff_46%,transparent_100%)]"
                  }`}
                />
                <p
                  className={`text-[0.7rem] uppercase tracking-[0.32em] ${
                    index === 0 || index === 3 ? "text-[#F0CB8A]/78" : "text-[#9aceff]"
                  }`}
                >
                  {card.subtitle}
                </p>
                <h3 className="mt-5 text-[1.95rem] font-semibold leading-none tracking-[-0.03em] text-white">
                  {card.title}
                </h3>
                <p className="mt-5 text-sm leading-7 text-white/60">{card.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
}
