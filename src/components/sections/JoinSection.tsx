"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronRight } from "lucide-react";

import { Reveal } from "@/components/motion/Reveal";
import { CTAButton } from "@/components/ui/CTAButton";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { joinReasons } from "@/content/community";
import { primaryLinks, socialLinkSlots } from "@/content/links";

export function JoinSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <SectionContainer id="join" className="pb-6">
      <div className="surface-card-strong relative overflow-hidden p-6 sm:p-8 lg:p-12">
        <motion.div
          className="pointer-events-none absolute inset-x-[-8%] bottom-[-4%] h-[42%] sm:h-[48%]"
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  x: [0, -22, 0],
                  y: [0, 8, 0],
                }
          }
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image
            src="/images/generated/liquid-ribbon.png"
            alt="Glossy flowing ribbon visual"
            fill
            className="object-cover object-bottom opacity-95"
          />
        </motion.div>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,2,2,0.96)_0%,rgba(2,2,2,0.86)_42%,rgba(2,2,2,0.22)_100%)]" />

        <div className="relative">
          <Reveal>
            <p className="text-xs font-medium uppercase tracking-[0.34em] text-[#E7D47C]/74">
              04 / Join Us
            </p>
            <h2 className="mt-6 max-w-[12ch] font-display text-[3.9rem] italic leading-[0.9] tracking-[-0.04em] text-white sm:text-[5rem] lg:text-[6.2rem]">
              Show up.
              <br />
              Build with us.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/58 sm:text-lg">
              如果你关心 AI、产品、agents、内容、创业与未来的协作方式，欢迎来到 IGNAI。
              加入一个 base 长沙、连接本地、面向全球的成长型技术社区。
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <CTAButton href={primaryLinks.joinCommunity.href}>加入社区</CTAButton>
              <CTAButton href={primaryLinks.contact.href} variant="secondary">
                联系我们
              </CTAButton>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-10 xl:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
            <Reveal>
              <div className="rounded-[28px] border border-white/10 bg-black/36 p-6 backdrop-blur-xl">
                <p className="text-[0.7rem] uppercase tracking-[0.32em] text-[#E7D47C]/70">
                  Why join
                </p>
                <div className="mt-5 space-y-4">
                  {joinReasons.map((reason) => (
                    <div
                      key={reason}
                      className="flex items-start gap-3 rounded-[20px] border border-white/8 bg-white/[0.03] p-4"
                    >
                      <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-[#E7D47C]" />
                      <p className="text-sm leading-7 text-white/62">{reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {socialLinkSlots.map((slot, index) => (
                <Reveal key={slot.label} delay={index * 0.05}>
                  {slot.configured ? (
                    <a
                      href={slot.href}
                      target={slot.href.startsWith("mailto:") ? undefined : "_blank"}
                      rel={slot.href.startsWith("mailto:") ? undefined : "noreferrer"}
                      className="surface-card block h-full bg-black/28 p-5 transition duration-300 hover:-translate-y-1 hover:border-white/18 hover:bg-white/[0.06]"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-display text-[1.8rem] italic leading-none text-white">
                          {slot.label}
                        </p>
                        <span className="rounded-full border border-[#E7D47C]/18 bg-[#E7D47C]/10 px-2.5 py-1 text-[0.68rem] uppercase tracking-[0.24em] text-[#E7D47C]">
                          Active
                        </span>
                      </div>
                      <p className="mt-4 text-sm leading-7 text-white/54">{slot.detail}</p>
                    </a>
                  ) : (
                    <div className="surface-card h-full bg-black/20 p-5 opacity-90">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-display text-[1.8rem] italic leading-none text-white">
                          {slot.label}
                        </p>
                        <span className="rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-[0.68rem] uppercase tracking-[0.24em] text-white/54">
                          待配置
                        </span>
                      </div>
                      <p className="mt-4 text-sm leading-7 text-white/54">{slot.detail}</p>
                    </div>
                  )}
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
