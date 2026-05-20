"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useRef } from "react";

import { BrandLockup } from "@/src/components/layout/BrandLockup";
import { CTAButton } from "@/src/components/ui/CTAButton";
import { primaryLinks } from "@/src/content/links";
import { siteContent } from "@/src/content/site";

export function HeroSection() {
  const ref = useRef<HTMLElement | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const contentY = useTransform(scrollYProgress, [0, 0.68], [0, shouldReduceMotion ? 0 : -44]);
  const contentOpacity = useTransform(
    scrollYProgress,
    [0, 0.75, 1],
    [1, 1, shouldReduceMotion ? 1 : 0.35],
  );
  const imageY = useTransform(scrollYProgress, [0, 1], [0, shouldReduceMotion ? 0 : 56]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.02, shouldReduceMotion ? 1.02 : 1.08]);

  return (
    <section ref={ref} className="relative min-h-[760px] overflow-hidden lg:min-h-[880px]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_18%,rgba(255,122,24,0.18),transparent_32%),radial-gradient(circle_at_84%_16%,rgba(93,169,255,0.1),transparent_26%),linear-gradient(180deg,#06080C_0%,#090B10_56%,#06080C_100%)]" />
      <div className="absolute inset-x-0 top-0 h-[34vh] bg-[linear-gradient(180deg,rgba(255,154,60,0.06)_0%,transparent_100%)]" />
      <div className="absolute bottom-[-16rem] left-[-10rem] h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(255,122,24,0.16)_0%,transparent_72%)] blur-3xl" />
      <div className="absolute right-[-10rem] top-[20%] h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle,rgba(93,169,255,0.1)_0%,transparent_72%)] blur-3xl" />
      <div className="ignite-field" />

      <div className="relative mx-auto flex min-h-[760px] max-w-[1200px] flex-col px-5 pb-8 pt-5 sm:px-8 lg:min-h-[880px]">
          <div className="flex items-center justify-between gap-4 border-b border-white/10 py-4">
            <BrandLockup />

            <nav className="hidden items-center gap-5 text-sm text-white/68 lg:flex">
              {siteContent.navItems.map((item) => (
                <a
                  key={item.href}
                    href={item.href}
                    aria-label={`首页首屏导航：${item.label}`}
                    className="transition hover:text-white"
                  >
                    {item.label}
                  </a>
                ))}
            </nav>
          </div>

          <div className="section-grid flex-1 pb-10 pt-12 lg:pb-12 lg:pt-16">
            <motion.div
              style={{ y: contentY, opacity: contentOpacity }}
              className="relative z-10"
            >
              <div className="eyebrow-label">
                <Sparkles className="h-3.5 w-3.5" />
                {siteContent.eyebrow}
              </div>

              <p className="section-eyebrow mt-8 text-[#f0d48d]/84">
                {siteContent.name}
              </p>

              <h1 className="display-title mt-4 max-w-[14ch] lg:text-[5.6rem]">
                {siteContent.slogan}
              </h1>

              <p className="section-lead mt-7 max-w-[17ch] font-medium">
                在 AGI 到来之前，
                <br />
                先点燃一群真实行动的人。
              </p>

              <p className="section-body mt-6">
                {siteContent.heroSummary}
                <br />
                <span className="text-white/56">{siteContent.heroDescription}</span>
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <CTAButton
                  href={primaryLinks.joinCommunity.href}
                  ariaLabel="加入社区（首屏）"
                  testId="hero-join-cta"
                >
                  加入社区
                </CTAButton>
                <CTAButton
                  href="#upcoming-events"
                  variant="secondary"
                  ariaLabel="查看近期活动（首屏）"
                >
                  查看近期活动
                </CTAButton>
              </div>
            </motion.div>

            <motion.div style={{ y: imageY, scale: imageScale }} className="relative z-10">
              <div className="relative">
                <div className="relative overflow-hidden rounded-lg border border-white/10 bg-black/50 shadow-[0_28px_80px_rgba(0,0,0,0.26)]">
                  <Image
                    src="/images/generated/local-global-embers.png"
                    alt="Warm local embers and blue signal lines showing local roots connected to a wider world"
                    width={1368}
                    height={912}
                    priority
                    className="slow-pan h-auto w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,8,12,0.12)_0%,rgba(5,8,12,0.18)_28%,rgba(5,8,12,0.82)_100%)]" />
                  <div className="absolute left-5 top-5 rounded-full border border-[#7cc8ff]/20 bg-[#08131e]/70 px-3 py-1.5 text-[0.68rem] uppercase text-[#9aceff]">
                    Local roots / Global signal
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                    <p className="max-w-[16ch] text-2xl font-semibold leading-[1.28] text-white sm:text-[2rem]">
                      让本地土壤和全球信号，
                      <br />
                      同时亮起来。
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-5 border-y border-white/10 py-5 sm:grid-cols-3 sm:gap-6">
                  {siteContent.heroSignals.map((signal, index) => (
                    <div
                      key={signal.title}
                      className={index > 0 ? "sm:border-l sm:border-white/10 sm:pl-6" : ""}
                    >
                      <p
                        className={`text-[0.7rem] font-medium uppercase ${
                          index === 1 ? "text-[#9aceff]" : "text-[#f0c78e]/84"
                        }`}
                      >
                        {signal.eyebrow}
                      </p>
                      <h3 className="mt-3 text-base font-semibold leading-[1.32] text-white">
                        {signal.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-white/64">
                        {signal.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
      </div>
    </section>
  );
}
