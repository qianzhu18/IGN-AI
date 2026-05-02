"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { CSSProperties } from "react";

import { Reveal } from "@/components/motion/Reveal";
import { CTAButton } from "@/components/ui/CTAButton";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { joinContent } from "@/content/community";
import { primaryLinks, socialLinkSlots } from "@/content/links";

export function JoinSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <SectionContainer id="join" className="pb-8">
      <div className="surface-card-strong relative overflow-hidden p-6 sm:p-8 lg:p-10">
        <div className="converge-field">
          <span className="converge-ray" style={{ "--ray-y": "20%", "--ray-rotate": "6deg", "--ray-delay": "0s" } as CSSProperties} />
          <span className="converge-ray" style={{ "--ray-y": "42%", "--ray-rotate": "-3deg", "--ray-delay": "1.4s" } as CSSProperties} />
          <span className="converge-ray" style={{ "--ray-y": "66%", "--ray-rotate": "4deg", "--ray-delay": "2.8s" } as CSSProperties} />
        </div>

        <div className="relative grid gap-10 xl:grid-cols-[minmax(0,0.94fr)_minmax(0,0.86fr)] xl:items-center">
          <div>
            <Reveal>
              <p className="text-xs font-medium uppercase tracking-[0.34em] text-[#F0CB8A]/78">
                06 / Join
              </p>
              <h2 className="mt-6 max-w-[11ch] font-display text-[4rem] italic leading-[0.9] tracking-[-0.045em] text-white sm:text-[5.2rem] lg:text-[6.2rem]">
                Join the fire.
                <br />
                Bring your signal.
              </h2>
              <p className="mt-6 max-w-2xl text-base leading-8 text-white/64 sm:text-lg">
                {joinContent.support}
              </p>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <CTAButton href={primaryLinks.joinCommunity.href} className="motion-cta">
                  加入社区
                </CTAButton>
                <CTAButton href={primaryLinks.contact.href} variant="secondary">
                  联系合作
                </CTAButton>
              </div>
            </Reveal>
          </div>

          <Reveal>
            <div className="surface-card relative overflow-hidden p-4 sm:p-5">
              <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-[#06080d]">
                <motion.div
                  className="absolute inset-0"
                  animate={
                    shouldReduceMotion
                      ? undefined
                      : {
                          x: [0, -14, 0],
                          y: [0, 10, 0],
                        }
                  }
                  transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Image
                    src="/images/generated/collaboration-threads.png"
                    alt="Warm collaboration threads and blue signal lines flowing together"
                    fill
                    className="object-cover opacity-90"
                  />
                </motion.div>
                <div className="relative aspect-[1.45]" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,6,10,0.14)_0%,rgba(4,6,10,0.1)_30%,rgba(4,6,10,0.88)_100%)]" />
                <div className="absolute left-4 top-4 rounded-full border border-[#7cc8ff]/20 bg-[#08131e]/72 px-3 py-1.5 text-[0.68rem] uppercase tracking-[0.3em] text-[#9aceff]">
                  Signal threads
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="max-w-[16ch] text-xl font-semibold leading-[1.35] tracking-[-0.03em] text-white">
                    把你的表达、行动和信号，带进这团火里。
                  </p>
                </div>
              </div>

              <p className="mt-5 text-[0.7rem] uppercase tracking-[0.32em] text-[#F0CB8A]/72">
                Platforms
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                {socialLinkSlots.map((slot, index) => (
                  <Reveal key={slot.label} delay={index * 0.05}>
                    {slot.configured ? (
                      <a
                        href={slot.href}
                        target={slot.href.startsWith("mailto:") ? undefined : "_blank"}
                        rel={slot.href.startsWith("mailto:") ? undefined : "noreferrer"}
                        className="rounded-full border border-[#ffb879]/16 bg-[#0d1118]/88 px-4 py-2 text-sm text-white/76 transition duration-300 hover:-translate-y-0.5 hover:border-[#ffb879]/28 hover:bg-[#121823]"
                      >
                        {slot.label}
                      </a>
                    ) : (
                      <span className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white/46">
                        {slot.label}
                      </span>
                    )}
                  </Reveal>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </SectionContainer>
  );
}
