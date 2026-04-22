"use client";

import { Reveal } from "@/components/motion/Reveal";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { audienceCards, spiritCards } from "@/content/community";

export function SpiritSection() {
  return (
    <SectionContainer id="core-spirit">
      <div className="grid gap-12 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] xl:gap-14">
        <div className="xl:sticky xl:top-24 xl:h-fit">
          <Reveal>
            <p className="text-xs font-medium uppercase tracking-[0.34em] text-[#E7D47C]/74">
              02 / Core Spirit
            </p>
            <h2 className="mt-6 max-w-[10ch] font-display text-[3.6rem] italic leading-[0.9] tracking-[-0.04em] text-white sm:text-[4.8rem] lg:text-[5.7rem]">
              Less watching.
              <br />
              More showing up.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-white/56 sm:text-lg">
              IGNAI 的精髓不是“懂很多”，而是愿意公开表达、愿意先做、愿意带着问题和作品来到现场。
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <div
              id="who-is-here"
              className="mt-10 flex flex-wrap gap-3"
            >
              {audienceCards.map((card) => (
                <span
                  key={card.title}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white/68"
                  title={card.description}
                >
                  {card.title}
                </span>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {spiritCards.map((card, index) => (
            <Reveal key={card.title} delay={index * 0.08}>
              <div className="surface-card-strong group relative h-full overflow-hidden p-6 transition duration-300 hover:-translate-y-1 hover:border-white/18">
                <div className="absolute right-[-2rem] top-[-2rem] h-28 w-28 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.08)_0%,transparent_72%)] blur-2xl" />
                <div className="relative">
                  <p className="text-[0.7rem] uppercase tracking-[0.32em] text-[#E7D47C]/72">
                    0{index + 1}
                  </p>
                  <h3 className="mt-5 font-display text-[2rem] italic leading-tight text-white sm:text-[2.35rem]">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-sm uppercase tracking-[0.24em] text-white/42">
                    {card.subtitle}
                  </p>
                  <p className="mt-6 text-base leading-8 text-white/56">
                    {card.description}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
}
