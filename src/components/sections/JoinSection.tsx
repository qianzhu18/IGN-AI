"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import type { CSSProperties } from "react";

import { Reveal } from "@/src/components/motion/Reveal";
import { CTAButton } from "@/src/components/ui/CTAButton";
import { SectionContainer } from "@/src/components/ui/SectionContainer";
import { joinContent } from "@/src/content/community";
import { primaryLinks, socialLinkSlots } from "@/src/content/links";

export function JoinSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <SectionContainer id="join" className="pb-8">
      <div className="relative overflow-hidden border-y border-white/10 py-10 sm:py-12 lg:py-16">
        <div className="converge-field">
          <span className="converge-ray" style={{ "--ray-y": "20%", "--ray-rotate": "6deg", "--ray-delay": "0s" } as CSSProperties} />
          <span className="converge-ray" style={{ "--ray-y": "42%", "--ray-rotate": "-3deg", "--ray-delay": "1.4s" } as CSSProperties} />
          <span className="converge-ray" style={{ "--ray-y": "66%", "--ray-rotate": "4deg", "--ray-delay": "2.8s" } as CSSProperties} />
        </div>

        <div className="relative grid gap-10 xl:grid-cols-2 xl:items-center xl:gap-[72px]">
          <div>
            <Reveal>
              <p className="section-eyebrow">
                06 / Join
              </p>
              <h2 className="display-title join-display-title mt-6 max-w-[20ch]">
                <span className="block sm:whitespace-nowrap">Join the fire.</span>
                <span className="block sm:whitespace-nowrap">Bring your signal.</span>
              </h2>
              <p className="section-body mt-6">
                {joinContent.support}
              </p>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="mt-8 grid max-w-[520px] gap-x-6 border-y border-white/10 sm:grid-cols-2">
                {joinContent.benefits.map((benefit) => (
                  <div
                    key={benefit}
                    className="flex min-h-12 items-center gap-3 border-t border-white/10 py-3 text-sm leading-6 text-white/72 first:border-t-0 sm:[&:nth-child(-n+2)]:border-t-0"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#ffb879]/20 bg-[#ff9a3c]/10 text-[#f2c892]">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <CTAButton
                  href={primaryLinks.joinCommunity.href}
                  className="motion-cta"
                  ariaLabel="加入社区（Join 区域）"
                  testId="join-section-join-cta"
                >
                  加入社区
                </CTAButton>
                <CTAButton
                  href={primaryLinks.contact.href}
                  variant="secondary"
                  ariaLabel="联系合作（Join 区域）"
                >
                  联系合作
                </CTAButton>
              </div>
            </Reveal>
          </div>

          <Reveal>
            <div className="relative overflow-hidden">
              <div className="relative overflow-hidden rounded-lg border border-white/10 bg-[#06080d] shadow-[0_28px_80px_rgba(0,0,0,0.24)]">
                <motion.div
                  className="absolute inset-0"
                  {...(!shouldReduceMotion
                    ? {
                        animate: {
                          x: [0, -14, 0],
                          y: [0, 10, 0],
                        },
                      }
                    : {})}
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
                <div className="absolute left-4 top-4 rounded-full border border-[#7cc8ff]/20 bg-[#08131e]/72 px-3 py-1.5 text-[0.68rem] uppercase text-[#9aceff]">
                  Signal threads
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="max-w-[16ch] text-xl font-semibold leading-[1.35] text-white">
                    把你的表达、行动和信号，
                    <br />
                    带进这团火里。
                  </p>
                </div>
              </div>

              <p className="section-eyebrow mt-5 text-[#F0CB8A]/72">
                Platforms
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                {socialLinkSlots.map((slot, index) => (
                  <Reveal key={slot.label} delay={index * 0.05}>
                    {slot.configured ? (
                      <a
                        href={slot.href}
                        target="_blank"
                        rel="noreferrer"
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
