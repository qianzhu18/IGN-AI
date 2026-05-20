"use client";

import { Reveal } from "@/src/components/motion/Reveal";
import { SectionContainer } from "@/src/components/ui/SectionContainer";
import { whatIsContent } from "@/src/content/community";

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
          <div>
            <p className="section-eyebrow mb-5">
              Community Members
            </p>

            <div className="open-grid">
              {whatIsContent.memberCards.map((card, index) => (
                <div
                  key={card.title}
                  className="open-grid-item"
                >
                  <p
                    className={
                      index % 2 === 1
                        ? "card-eyebrow text-[#9aceff]"
                        : "card-eyebrow text-[#F0CB8A]/72"
                    }
                  >
                    0{index + 1} / {card.eyebrow}
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
