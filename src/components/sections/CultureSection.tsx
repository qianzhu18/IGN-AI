"use client";

import { Reveal } from "@/components/motion/Reveal";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { cultureContent } from "@/content/community";

export function CultureSection() {
  return (
    <SectionContainer id="culture">
      <div className="grid gap-14 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] xl:gap-16">
        <div className="xl:sticky xl:top-24 xl:h-fit">
          <Reveal>
            <p className="text-xs font-medium uppercase tracking-[0.34em] text-[#F0CB8A]/78">
              03 / Culture
            </p>
            <h2 className="mt-6 max-w-[7ch] text-[3.1rem] font-semibold leading-[1.02] tracking-[-0.05em] text-white sm:text-[4.5rem] lg:text-[5.4rem]">
              不是围观，
              <br />
              而是上场。
            </h2>
            <p className="mt-6 max-w-xl text-[1.25rem] font-medium leading-[1.55] text-white/88 sm:text-[1.42rem]">
              {cultureContent.support}
            </p>
            <p className="mt-5 max-w-xl text-base leading-8 text-white/58 sm:text-lg">
              {cultureContent.paragraph}
            </p>
          </Reveal>
        </div>

        <div className="grid auto-rows-fr gap-4 md:grid-cols-2">
          {cultureContent.cards.map((card, index) => (
            <Reveal key={card.title} delay={index * 0.08}>
              <div
                className={`surface-card-strong presence-card relative h-full overflow-hidden p-6 sm:p-7 ${
                  index === 0 ? "md:col-span-2" : ""
                }`}
                style={{ animationDelay: `${index * 0.7}s` }}
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#F0CB8A]/80 to-transparent opacity-80" />
                <div className="absolute inset-x-6 top-12 h-px bg-[linear-gradient(90deg,transparent,rgba(255,197,107,0.22),transparent)]" />
                <p className="text-[0.68rem] uppercase tracking-[0.3em] text-white/38">
                  0{index + 1}
                </p>
                <p
                  className={`mt-4 text-[0.72rem] uppercase tracking-[0.3em] ${
                    index === 1 ? "text-[#9aceff]" : "text-[#F0CB8A]/78"
                  }`}
                >
                  {card.subtitle}
                </p>
                <h3 className="mt-5 max-w-[10ch] text-[1.85rem] font-semibold leading-[1.08] tracking-[-0.04em] text-white sm:text-[2.15rem]">
                  {card.title}
                </h3>
                <p className="mt-5 max-w-[28rem] text-base leading-8 text-white/60">
                  {card.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
}
