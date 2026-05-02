"use client";

import { Reveal } from "@/components/motion/Reveal";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { whatIsContent } from "@/content/community";

export function WhatIsSection() {
  return (
    <SectionContainer id="what-is-ignai">
      <div className="grid gap-12 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] xl:gap-16">
        <div className="xl:sticky xl:top-24 xl:h-fit">
          <Reveal>
            <p className="text-xs font-medium uppercase tracking-[0.34em] text-[#F0CB8A]/78">
              01 / What is IGNAI
            </p>
            <h2 className="mt-6 max-w-[10ch] font-display text-[3.6rem] italic leading-[0.9] tracking-[-0.045em] text-white sm:text-[4.8rem] lg:text-[5.8rem]">
              What is
              <br />
              IGNAI?
            </h2>
            <p className="mt-6 max-w-xl text-[1.35rem] leading-[1.5] text-white/88 sm:text-[1.55rem]">
              {whatIsContent.definition}
            </p>
            <p className="mt-5 max-w-xl text-base leading-8 text-white/58 sm:text-lg">
              {whatIsContent.support}
            </p>
          </Reveal>
        </div>

        <Reveal>
          <div className="surface-card-strong relative overflow-hidden p-6 sm:p-8">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#F0CB8A]/80 to-transparent opacity-80" />
            <div className="absolute right-[-6rem] top-[-6rem] h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(255,154,60,0.18)_0%,transparent_72%)] blur-3xl" />

            <p className="text-[0.7rem] uppercase tracking-[0.32em] text-[#F0CB8A]/72">
              Keywords
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {whatIsContent.keywords.map((keyword, index) => (
                <div
                  key={keyword}
                  className={`rounded-[22px] border p-5 ${
                    index % 3 === 1
                      ? "border-[#7cc8ff]/14 bg-[#08121d]/88"
                      : "border-white/10 bg-[#0e131c]/88"
                  }`}
                >
                  <p
                    className={`text-[0.68rem] uppercase tracking-[0.32em] ${
                      index % 3 === 1 ? "text-[#9aceff]" : "text-[#F0CB8A]/72"
                    }`}
                  >
                    Keyword 0{index + 1}
                  </p>
                  <h3 className="mt-4 font-display text-[1.75rem] italic leading-none text-white">
                    {keyword}
                  </h3>
                </div>
              ))}
            </div>

            <p className="mt-6 max-w-[36rem] text-sm leading-7 text-white/54">
              从技术、产品到内容、创业与社区，IGNAI 更关心人与人之间能否形成持续的
              行动回路。
            </p>
          </div>
        </Reveal>
      </div>
    </SectionContainer>
  );
}
