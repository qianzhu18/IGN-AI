"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

import { Reveal } from "@/components/motion/Reveal";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { introKeywords, whyNowCards } from "@/content/community";
import { siteContent } from "@/content/site";

export function WhyNowSection() {
  const ref = useRef<HTMLDivElement | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const glowX = useTransform(scrollYProgress, [0, 1], ["-10%", shouldReduceMotion ? "-10%" : "110%"]);
  const lineX = useTransform(scrollYProgress, [0, 1], ["0%", shouldReduceMotion ? "0%" : "280%"]);

  return (
    <SectionContainer id="what-is-ignai" className="border-t-0">
      <div className="grid gap-12 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] xl:gap-14">
        <div className="xl:sticky xl:top-24 xl:h-fit">
          <Reveal>
            <p className="text-xs font-medium uppercase tracking-[0.34em] text-[#E7D47C]/74">
              01 / Manifesto
            </p>
            <h2 className="mt-6 max-w-[9ch] font-display text-[3.7rem] italic leading-[0.9] tracking-[-0.04em] text-white sm:text-[4.8rem] lg:text-[5.8rem]">
              Build local.
              <br />
              Think global.
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-9 text-white/74">
              {siteContent.description}
            </p>
            <p className="mt-4 max-w-xl text-base leading-8 text-white/54">
              我们想做的不是又一个信息群，而是一个让表达、行动、协作和被看见持续发生的 AI 行动场。
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="mt-8 flex flex-wrap gap-3">
              {introKeywords.map((keyword) => (
                <span
                  key={keyword}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white/68"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="space-y-4">
          {whyNowCards.map((card, index) => (
            <Reveal key={card.title} delay={index * 0.08}>
              <div className="surface-card-strong group overflow-hidden p-6 sm:p-7">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <p className="text-[0.7rem] uppercase tracking-[0.32em] text-[#E7D47C]/70">
                      0{index + 1}
                    </p>
                    <h3 className="mt-5 font-display text-[2.2rem] italic leading-none text-white sm:text-[2.6rem]">
                      {card.title}
                    </h3>
                    <p className="mt-3 text-sm uppercase tracking-[0.28em] text-white/44">
                      {card.subtitle}
                    </p>
                  </div>

                  <div className="hidden h-12 w-12 shrink-0 rounded-full border border-white/10 bg-[radial-gradient(circle,rgba(255,255,255,0.12)_0%,transparent_72%)] lg:block" />
                </div>

                <p className="mt-6 max-w-2xl text-base leading-8 text-white/56">
                  {card.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <div
        ref={ref}
        className="relative mt-16 overflow-hidden rounded-[34px] border border-white/10 bg-white/[0.02] px-6 py-8 sm:px-10"
      >
        <div className="absolute inset-y-0 left-0 w-full">
          <motion.div
            style={{ x: glowX }}
            className="absolute top-1/2 h-28 w-80 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.3)_0%,rgba(149,154,255,0.18)_16%,transparent_72%)] blur-2xl"
          />
        </div>
        <div className="absolute inset-x-8 top-1/2 h-px -translate-y-1/2 bg-white/10" />
        <motion.div
          style={{ x: lineX }}
          className="absolute top-1/2 h-px w-48 -translate-y-1/2 bg-gradient-to-r from-transparent via-white to-transparent"
        />

        <div className="relative flex flex-col gap-4 text-xs uppercase tracking-[0.28em] text-white/56 sm:flex-row sm:items-center sm:justify-between">
          <span>Curiosity</span>
          <span>Expression</span>
          <span>Action</span>
          <span>Collaboration</span>
        </div>
      </div>
    </SectionContainer>
  );
}
