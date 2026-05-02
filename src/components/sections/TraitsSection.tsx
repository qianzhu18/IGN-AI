"use client";

import { Reveal } from "@/components/motion/Reveal";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { traitCards } from "@/content/community";

export function TraitsSection() {
  return (
    <SectionContainer id="traits">
      <div className="section-grid-start">
        <div className="section-copy">
          <Reveal>
            <p className="section-eyebrow">
              05 / Traits
            </p>
            <h2 className="display-title mt-6 max-w-[13ch]">
              What makes
              <br />
              IGNAI different
            </h2>
            <p className="section-lead mt-6 max-w-[15ch] font-medium">
              本地土壤、国际视野、
              <br />
              技术密度与真实连接。
            </p>
            <p className="section-body mt-5">
              它们构成了 IGNAI 最核心的社区气质。
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
                  className={`card-eyebrow ${
                    index === 0 || index === 3 ? "text-[#F0CB8A]/78" : "text-[#9aceff]"
                  }`}
                >
                  {card.eyebrow}
                </p>
                <h3 className="card-title">
                  {card.title}
                </h3>
                <p className="card-body">{card.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
}
