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

        <div className="grid auto-rows-fr gap-4 md:grid-cols-2">
          {cultureContent.cards.map((card, index) => (
            <Reveal key={card.title} delay={index * 0.08}>
              <div
                className="info-card presence-card min-h-[160px]"
                style={{ animationDelay: `${index * 0.7}s` }}
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#F0CB8A]/80 to-transparent opacity-80" />
                <div className="absolute inset-x-6 top-12 h-px bg-[linear-gradient(90deg,transparent,rgba(255,197,107,0.22),transparent)]" />
                <p className="card-eyebrow text-white/42">
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
