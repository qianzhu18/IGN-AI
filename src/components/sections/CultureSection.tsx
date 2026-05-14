"use client";

import { Reveal } from "@/components/motion/Reveal";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { cultureContent } from "@/content/community";

export function CultureSection() {
  return (
    <SectionContainer id="culture">
      <div className="section-grid-start">
        <div className="section-copy">
          <Reveal>
            <p className="section-eyebrow">
              03 / Culture
            </p>
            <h2 className="section-title mt-6 max-w-[11ch]">
              {cultureContent.titleLines[0]}
              <br />
              {cultureContent.titleLines[1]}
            </h2>
            <p className="section-lead mt-6 max-w-[18ch] font-medium">
              {cultureContent.support}
            </p>
            <p className="section-body mt-5">
              {cultureContent.paragraph}
            </p>
          </Reveal>
        </div>

        <div className="open-grid">
          {cultureContent.cards.map((card, index) => (
            <Reveal key={card.title} delay={index * 0.08} className="open-grid-item">
              <div className="presence-card" style={{ animationDelay: `${index * 0.7}s` }}>
                <p className="card-eyebrow text-[#F0CB8A]/72">
                  {card.eyebrow}
                </p>
                <h3 className="card-title">
                  {card.title}
                </h3>
                <p className="card-body">
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
