"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

import { Reveal } from "@/components/motion/Reveal";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { vibeCards, vibeQuotes } from "@/content/community";

export function VibeSection() {
  const ref = useRef<HTMLElement | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const mediaY = useTransform(scrollYProgress, [0, 1], [shouldReduceMotion ? 0 : 36, shouldReduceMotion ? 0 : -36]);
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1.02, shouldReduceMotion ? 1.02 : 0.97]);

  return (
    <SectionContainer id="community-vibe" className="overflow-hidden">
      <section ref={ref}>
        <div className="grid gap-12 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] xl:items-center xl:gap-14">
          <div>
            <Reveal>
              <p className="text-xs font-medium uppercase tracking-[0.34em] text-[#E7D47C]/74">
                03 / Community Vibe
              </p>
              <h2 className="mt-6 max-w-[11ch] font-display text-[3.6rem] italic leading-[0.9] tracking-[-0.04em] text-white sm:text-[4.8rem] lg:text-[5.7rem]">
                Technical depth.
                <br />
                Human warmth.
              </h2>
              <p className="mt-6 max-w-xl text-base leading-8 text-white/56 sm:text-lg">
                洋来社是我们的内部俗名。它保留了最初那种野生、热闹、会整活，也真的会彼此点燃的气质。
              </p>
            </Reveal>

            <div className="mt-10 space-y-4">
              {vibeQuotes.map((quote, index) => (
                <Reveal key={quote} delay={index * 0.08}>
                  <div className="surface-card p-5">
                    <p className="text-[0.7rem] uppercase tracking-[0.32em] text-[#E7D47C]/66">
                      0{index + 1}
                    </p>
                    <p className="mt-3 text-base leading-8 text-white/64">{quote}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <motion.div
            style={{ y: mediaY, scale: mediaScale }}
            className="relative"
          >
            <div className="absolute inset-0 rounded-[36px] bg-[radial-gradient(circle_at_center,rgba(122,96,255,0.24)_0%,transparent_62%)] blur-3xl" />
            <div className="surface-card-strong relative overflow-hidden p-4 sm:p-5">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent_54%)]" />
              <div className="relative overflow-hidden rounded-[26px] border border-white/10">
                <Image
                  src="/images/generated/halo-showcase.png"
                  alt="Glowing halo visual representing community energy"
                  width={1368}
                  height={768}
                  className="h-auto w-full object-cover"
                />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,2,2,0.08),transparent_35%,rgba(2,2,2,0.22)_100%)]" />
              </div>

              <div className="relative mt-5 grid gap-4 md:grid-cols-3">
                {vibeCards.map((card, index) => (
                  <motion.div
                    key={card.title}
                    className="rounded-[24px] border border-white/10 bg-black/38 p-5 backdrop-blur-xl"
                    animate={
                      shouldReduceMotion
                        ? undefined
                        : {
                            y: [0, -8, 0],
                          }
                    }
                    transition={{
                      duration: 8 + index,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <p className="text-[0.7rem] uppercase tracking-[0.32em] text-[#E7D47C]/70">
                      0{index + 1}
                    </p>
                    <h3 className="mt-4 font-display text-[1.9rem] italic leading-none text-white">
                      {card.title}
                    </h3>
                    <p className="mt-4 text-sm leading-7 text-white/56">{card.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </SectionContainer>
  );
}
