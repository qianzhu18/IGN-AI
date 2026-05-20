"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

import { Reveal } from "@/src/components/motion/Reveal";
import { SectionContainer } from "@/src/components/ui/SectionContainer";
import { identityContent } from "@/src/content/community";

export function IdentitySection() {
  const ref = useRef<HTMLElement | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const mediaY = useTransform(
    scrollYProgress,
    [0, 1],
    [shouldReduceMotion ? 0 : 22, shouldReduceMotion ? 0 : -18],
  );

  return (
    <SectionContainer id="identity" className="overflow-hidden">
      <section
        ref={ref}
        className="section-grid-start"
      >
        <div className="section-copy">
          <Reveal>
            <p className="section-eyebrow">
              04 / Identity
            </p>
            <h2 className="section-title mt-6 max-w-[12ch]">
              {identityContent.titleLines[0]}
              <br />
              {identityContent.titleLines[1]}
            </h2>
            <p className="section-lead mt-6 max-w-[20ch] font-medium">
              {identityContent.support}
            </p>
            <p className="section-body mt-5">
              {identityContent.paragraph}
            </p>
          </Reveal>
        </div>

        <div className="space-y-5">
          <Reveal>
            <motion.div
              style={{ y: mediaY }}
              className="surface-card-strong relative overflow-hidden p-4 sm:p-5"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#F0CB8A]/80 to-transparent opacity-80" />
              <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-[#06080d]">
                <Image
                  src="/images/generated/human-energy-scene.png"
                  alt="Builders gathering around a table at night, showing the human warmth of the community"
                  width={1368}
                  height={912}
                  className="h-auto w-full object-cover"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,6,10,0.06)_0%,rgba(4,6,10,0.12)_28%,rgba(4,6,10,0.84)_100%)]" />
                <div className="absolute left-5 top-5 rounded-full border border-[#ffb879]/20 bg-[#140b07]/72 px-3 py-1.5 text-[0.68rem] uppercase text-[#f2c892]">
                  {identityContent.visualTitle}
                </div>
                <div className="absolute bottom-0 left-0 max-w-[24rem] p-5 sm:p-6">
                  <p className="text-2xl font-semibold leading-[1.28] text-white sm:text-[2rem]">
                    既能聊模型、产品和 Agent，
                    <br />
                    也能在真实连接里彼此点燃。
                  </p>
                </div>
              </div>
            </motion.div>
          </Reveal>

          <div className="grid gap-4 md:grid-cols-2">
            {identityContent.cards.map((card, index) => (
              <Reveal key={card.title} delay={index * 0.08}>
                <div
                  className={`relative h-full overflow-hidden rounded-[26px] border p-6 sm:p-7 ${
                    index === 0
                      ? "border-[#7cc8ff]/14 bg-[#08121d]/88 shadow-[0_24px_70px_rgba(0,0,0,0.44)]"
                      : "border-[#ffb879]/14 bg-[#0d1118]/90 shadow-[0_24px_70px_rgba(0,0,0,0.44)]"
                  }`}
                >
                  <p
                    className={`card-eyebrow ${
                      index === 0 ? "text-[#9aceff]" : "text-[#F0CB8A]/78"
                    }`}
                  >
                    {card.eyebrow}
                  </p>
                  <h3 className="card-title text-[1.9rem]">
                    {card.title}
                  </h3>
                  <p className="card-body">{card.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </SectionContainer>
  );
}
