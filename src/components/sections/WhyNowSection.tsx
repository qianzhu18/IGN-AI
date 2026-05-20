"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

import { Reveal } from "@/src/components/motion/Reveal";
import { SectionContainer } from "@/src/components/ui/SectionContainer";
import { whyNowContent } from "@/src/content/community";

export function WhyNowSection() {
  const ref = useRef<HTMLElement | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const mediaY = useTransform(
    scrollYProgress,
    [0, 1],
    [shouldReduceMotion ? 0 : 26, shouldReduceMotion ? 0 : -18],
  );
  const mediaScale = useTransform(
    scrollYProgress,
    [0, 1],
    [1.01, shouldReduceMotion ? 1.01 : 0.985],
  );

  return (
    <SectionContainer id="why-now" className="overflow-hidden">
      <section
        ref={ref}
        className="section-grid-start"
      >
        <div className="section-copy">
          <Reveal>
            <p className="section-eyebrow">
              02 / Why now
            </p>
            <h2 className="display-title mt-6 max-w-[13ch]">
              Ignite people
              <br />
              before hype.
            </h2>
            <p className="section-lead mt-6 max-w-[15ch] font-medium">
              {whyNowContent.supportLines[0]}
              <br />
              {whyNowContent.supportLines[1]}
            </p>
            <p className="section-body mt-5">
              {whyNowContent.paragraph}
            </p>
          </Reveal>
        </div>

        <div className="space-y-5">
          <Reveal>
            <motion.div
              style={{ y: mediaY, scale: mediaScale }}
              className="surface-card-strong energy-panel relative overflow-hidden p-4 sm:p-5"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#F0CB8A]/80 to-transparent opacity-80" />
              <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-[#05080d]">
                <Image
                  src="/images/generated/ignite-core.png"
                  alt="A concentrated ignition core radiating sparks and signal traces in the dark"
                  width={1368}
                  height={912}
                  className="slow-pan h-auto w-full object-cover"
                />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,8,13,0.1)_0%,rgba(5,8,13,0.18)_38%,rgba(5,8,13,0.84)_100%)]" />
                <div className="absolute left-5 top-5 rounded-full border border-[#ffb879]/20 bg-[#140b07]/72 px-3 py-1.5 text-[0.68rem] uppercase text-[#f2c892]">
                  {whyNowContent.visualTitle}
                </div>
                <div className="absolute bottom-0 left-0 max-w-[22rem] p-5 sm:p-6">
                  <p className="text-2xl font-semibold leading-[1.28] text-white sm:text-[2rem]">
                    热源先被点亮，
                    <br />
                    连接和行动才会真正扩散。
                  </p>
                </div>
              </div>
            </motion.div>
          </Reveal>

          <div className="grid gap-4 md:grid-cols-2">
            {whyNowContent.cards.map((card, index) => (
              <Reveal key={card.title} delay={index * 0.06}>
                <motion.div
                  className="surface-card energy-card relative h-full overflow-hidden p-6 sm:p-7"
                  style={{ animationDelay: `${index * 0.85}s` }}
                  {...(!shouldReduceMotion
                    ? {
                        whileInView: {
                          filter: ["brightness(0.78)", "brightness(1.12)", "brightness(1)"],
                        },
                      }
                    : {})}
                  viewport={{ once: true, amount: 0.45 }}
                  transition={{ duration: 1.6, delay: index * 0.16, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div
                    className={`absolute inset-x-0 top-0 h-1 ${
                      index % 2 === 0
                        ? "bg-[linear-gradient(90deg,#ff7a18_0%,#ffc56b_100%)]"
                        : "bg-[linear-gradient(90deg,#5da9ff_0%,#7cc8ff_100%)]"
                    }`}
                  />
                  <p className={`card-eyebrow ${index % 2 === 0 ? "text-[#F0CB8A]/74" : "text-[#9aceff]"}`}>
                    {card.eyebrow}
                  </p>
                  <h3 className="card-title">
                    {card.title}
                  </h3>
                  <p className="card-body">{card.description}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </SectionContainer>
  );
}
