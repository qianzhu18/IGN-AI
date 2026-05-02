"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

import { Reveal } from "@/components/motion/Reveal";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { identityContent } from "@/content/community";

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
        className="grid gap-12 xl:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] xl:gap-16"
      >
        <div className="xl:sticky xl:top-24 xl:h-fit">
          <Reveal>
            <p className="text-xs font-medium uppercase tracking-[0.34em] text-[#F0CB8A]/78">
              04 / Identity
            </p>
            <h2 className="mt-6 max-w-[9ch] text-[3.1rem] font-semibold leading-[1.02] tracking-[-0.05em] text-white sm:text-[4.5rem] lg:text-[5.4rem]">
              有技术密度，
              <br />
              也有人的温度。
            </h2>
            <p className="mt-6 max-w-3xl text-[1.25rem] leading-[1.55] text-white/88 sm:text-[1.42rem]">
              {identityContent.support}
            </p>
            <p className="mt-5 max-w-3xl text-base leading-8 text-white/58 sm:text-lg">
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
              <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#06080d]">
                <Image
                  src="/images/generated/human-energy-scene.png"
                  alt="Builders gathering around a table at night, showing the human warmth of the community"
                  width={1368}
                  height={912}
                  className="h-auto w-full object-cover"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,6,10,0.06)_0%,rgba(4,6,10,0.12)_28%,rgba(4,6,10,0.84)_100%)]" />
                <div className="absolute left-5 top-5 rounded-full border border-[#ffb879]/20 bg-[#140b07]/72 px-3 py-1.5 text-[0.68rem] uppercase tracking-[0.3em] text-[#f2c892]">
                  Human warmth
                </div>
                <div className="absolute bottom-0 left-0 max-w-[24rem] p-5 sm:p-6">
                  <p className="text-2xl font-semibold leading-[1.28] tracking-[-0.03em] text-white sm:text-[2.1rem]">
                    既能聊模型、产品和 Agent，也能在真实连接里彼此点燃。
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
                    className={`text-[0.7rem] uppercase tracking-[0.32em] ${
                      index === 0 ? "text-[#9aceff]" : "text-[#F0CB8A]/78"
                    }`}
                  >
                    {card.subtitle}
                  </p>
                  <h3 className="mt-5 text-[2rem] font-semibold leading-none tracking-[-0.04em] text-white">
                    {card.title}
                  </h3>
                  <p className="mt-5 text-sm leading-7 text-white/60">{card.description}</p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {card.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`rounded-full border px-3 py-1.5 text-xs ${
                          index === 0
                            ? "border-[#7cc8ff]/14 bg-[#08131e]/80 text-[#c7e6ff]"
                            : "border-white/10 bg-white/[0.04] text-white/68"
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </SectionContainer>
  );
}
