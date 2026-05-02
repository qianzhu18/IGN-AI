"use client";

import { Reveal } from "@/components/motion/Reveal";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { whatIsContent } from "@/content/community";

export function WhatIsSection() {
  return (
    <SectionContainer id="what-is-ignai">
      <div className="section-grid-start">
        <div className="section-copy">
          <Reveal>
            <p className="section-eyebrow">
              01 / What is IGNAI
            </p>
            <h2 className="display-title mt-6 max-w-[12ch]">
              What is
              <br />
              IGNAI?
            </h2>
            <p className="section-lead mt-6 max-w-[15ch] font-medium">
              {whatIsContent.definitionLines[0]}
              <br />
              {whatIsContent.definitionLines[1]}
            </p>
            <p className="section-body mt-5">
              {whatIsContent.support}
            </p>
          </Reveal>
        </div>

        <Reveal>
          <div className="surface-card-strong relative overflow-hidden p-5 sm:p-6">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#F0CB8A]/80 to-transparent opacity-80" />
            <div className="absolute right-[-6rem] top-[-6rem] h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(255,154,60,0.18)_0%,transparent_72%)] blur-3xl" />

            <p className="section-eyebrow">
              Community Members
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {whatIsContent.memberCards.map((card, index) => (
                <div
                  key={card.title}
                  className={`info-card min-h-[160px] ${
                    index % 2 === 1
                      ? "border-[#7cc8ff]/14 bg-[#08121d]/88"
                      : "border-white/10 bg-[#0e131c]/88"
                  }`}
                >
                  <p
                    className={`card-eyebrow ${
                      index % 2 === 1 ? "text-[#9aceff]" : "text-[#F0CB8A]/72"
                    }`}
                  >
                    {card.eyebrow}
                  </p>
                  <h3 className="card-title">
                    {card.title}
                  </h3>
                  <p className="card-body">{card.description}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </SectionContainer>
  );
}
