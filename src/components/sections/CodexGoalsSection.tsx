"use client";

import { Target, UserRound, Zap } from "lucide-react";

import { Reveal } from "@/src/components/motion/Reveal";
import { SectionContainer } from "@/src/components/ui/SectionContainer";
import { codexGoalsContent } from "@/src/content/community";

const icons = [UserRound, Zap, Target];

export function CodexGoalsSection() {
  return (
    <SectionContainer id="codex-goals">
      <div className="section-grid-start">
        <div className="section-copy">
          <Reveal>
            <p className="section-eyebrow">{codexGoalsContent.eyebrow}</p>
            <h2 className="display-title mt-6 max-w-[11ch]">
              {codexGoalsContent.titleLines[0]}
              <br />
              {codexGoalsContent.titleLines[1]}
            </h2>
            <p className="section-body mt-6">{codexGoalsContent.intro}</p>
          </Reveal>
        </div>

        <div className="space-y-6">
          <Reveal>
            <div className="grid gap-4 lg:grid-cols-3">
              {codexGoalsContent.featureCards.map((card, index) => {
                const Icon = icons[index] || Target;
                return (
                  <div key={card.title} className="surface-card p-5 sm:p-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#ffb879]/20 bg-[#0d1118] text-[#f0cb8a]">
                        <Icon className="h-4 w-4" />
                      </div>
                      <h3 className="text-[1.05rem] font-semibold text-white">{card.title}</h3>
                    </div>
                    <p className="mt-4 text-sm leading-7 text-white/62">{card.description}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {card.goals.map((goal) => (
                        <span
                          key={goal}
                          className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/58"
                        >
                          {goal}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="surface-card-strong overflow-hidden">
              <div className="grid gap-0 md:grid-cols-[1.1fr_1fr_1.35fr]">
                <div className="border-b border-white/10 px-5 py-4 text-[0.72rem] font-medium uppercase text-[#f0cb8a]/78 md:border-b-0 md:border-r">
                  Member Goal
                </div>
                <div className="border-b border-white/10 px-5 py-4 text-[0.72rem] font-medium uppercase text-[#9aceff] md:border-b-0 md:border-r">
                  Enabled By
                </div>
                <div className="px-5 py-4 text-[0.72rem] font-medium uppercase text-white/52">
                  Community Outcome
                </div>
              </div>

              {codexGoalsContent.goalRows.map((row, index) => (
                <div
                  key={row.goal}
                  className={`grid gap-0 md:grid-cols-[1.1fr_1fr_1.35fr] ${
                    index > 0 ? "border-t border-white/10" : ""
                  }`}
                >
                  <div className="px-5 py-5 text-lg font-semibold text-white md:border-r md:border-white/10">
                    {row.goal}
                  </div>
                  <div className="px-5 py-5 text-sm text-white/72 md:border-r md:border-white/10">
                    {row.feature}
                  </div>
                  <div className="px-5 py-5 text-sm leading-7 text-white/56">{row.outcome}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </SectionContainer>
  );
}
