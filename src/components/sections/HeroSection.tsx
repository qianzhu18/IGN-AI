"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useRef } from "react";

import { CTAButton } from "@/components/ui/CTAButton";
import { primaryLinks } from "@/content/links";
import { siteContent } from "@/content/site";

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
    <section ref={ref} className="relative min-h-[132vh]">
      <div className="sticky top-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_18%,rgba(255,122,24,0.24),transparent_32%),radial-gradient(circle_at_84%_16%,rgba(93,169,255,0.14),transparent_26%),linear-gradient(180deg,#06080C_0%,#090B10_56%,#06080C_100%)]" />
        <div className="absolute inset-x-0 top-0 h-[34vh] bg-[linear-gradient(180deg,rgba(255,154,60,0.08)_0%,transparent_100%)]" />
        <div className="absolute bottom-[-16rem] left-[-10rem] h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(255,122,24,0.22)_0%,transparent_72%)] blur-3xl" />
        <div className="absolute right-[-10rem] top-[20%] h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle,rgba(93,169,255,0.14)_0%,transparent_72%)] blur-3xl" />
        <div className="ignite-field" />

        <div className="relative mx-auto flex min-h-screen max-w-[1380px] flex-col px-6 pb-8 pt-5 sm:px-8 lg:px-12">
          <div className="surface-card flex items-center justify-between gap-4 px-4 py-3 sm:px-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#ffb879]/20 bg-[radial-gradient(circle,rgba(255,168,94,0.92)_0%,rgba(93,169,255,0.28)_100%)] text-sm font-semibold text-white shadow-[0_12px_34px_rgba(255,140,76,0.16)]">
                IG
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.34em] text-white/92">
                  {siteContent.name}
                </p>
                <p className="text-xs text-white/50">{siteContent.slogan}</p>
              </div>
            </div>

            <nav className="hidden items-center gap-5 text-sm text-white/68 lg:flex">
              {siteContent.navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="transition hover:text-white"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="grid flex-1 items-center gap-12 pb-10 pt-10 lg:grid-cols-[minmax(0,0.96fr)_minmax(0,0.84fr)] lg:gap-10 lg:pb-12 lg:pt-12">
            <motion.div
              style={{ y: contentY, opacity: contentOpacity }}
              className="relative z-10 max-w-[780px]"
            >
              <div className="eyebrow-label">
                <Sparkles className="h-3.5 w-3.5" />
                洋来社 / Living AI Community
              </div>

              <p className="mt-8 text-xs font-medium uppercase tracking-[0.34em] text-[#f0d48d]/84 sm:text-[0.8rem]">
                {siteContent.name}
              </p>

              <h1 className="mt-4 max-w-[9ch] font-display text-[4.6rem] italic leading-[0.88] tracking-[-0.05em] text-white sm:text-[6.2rem] lg:text-[8.2rem]">
                {siteContent.slogan}
              </h1>

              <p className="mt-7 max-w-[12ch] text-[1.7rem] font-medium leading-[1.42] tracking-[-0.03em] text-white/92 sm:text-[2rem] lg:text-[2.45rem]">
                在 AGI 到来之前，
                <br />
                最重要的不是空谈未来，
                <br />
                是先点燃一群人。
              </p>

              <div className="mt-8 max-w-[640px] surface-card p-5 sm:p-6">
                <p className="text-[0.72rem] uppercase tracking-[0.34em] text-[#f0c78e]/72">
                  {siteContent.eyebrow}
                </p>
                <div className="mt-4 space-y-1 text-base leading-8 text-white/78 sm:text-lg">
                  <p>{siteContent.heroSummary}</p>
                  <p className="text-white/60">{siteContent.heroDescription}</p>
                </div>
              </div>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <CTAButton href={primaryLinks.joinCommunity.href}>加入社区</CTAButton>
                <CTAButton href="#culture" variant="secondary">
                  了解文化
                </CTAButton>
              </div>
            </motion.div>

            <motion.div style={{ y: imageY, scale: imageScale }} className="relative z-10">
              <div className="surface-card-strong energy-panel p-4 sm:p-5">
                <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-black/60">
                  <Image
                    src="/images/generated/local-global-embers.png"
                    alt="Warm local embers and blue signal lines showing local roots connected to a wider world"
                    width={1368}
                    height={912}
                    priority
                    className="slow-pan h-auto w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,8,12,0.12)_0%,rgba(5,8,12,0.18)_28%,rgba(5,8,12,0.82)_100%)]" />
                  <div className="absolute left-5 top-5 rounded-full border border-[#7cc8ff]/20 bg-[#08131e]/70 px-3 py-1.5 text-[0.68rem] uppercase tracking-[0.3em] text-[#9aceff]">
                    Local roots / Global signal
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                    <p className="max-w-[18ch] text-2xl font-semibold leading-[1.28] tracking-[-0.03em] text-white sm:text-[2.15rem]">
                      让本地土壤和全球信号，同时亮起来。
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {siteContent.heroSignals.map((signal, index) => (
                    <div
                      key={signal.title}
                      className={`rounded-[22px] border p-4 ${
                        index === 1
                          ? "border-[#7cc8ff]/14 bg-[#08121d]/88"
                          : "border-[#ffb879]/14 bg-[#0c1118]/88"
                      }`}
                    >
                      <p
                        className={`text-[0.68rem] uppercase tracking-[0.3em] ${
                          index === 1 ? "text-[#9aceff]" : "text-[#f0c78e]/84"
                        }`}
                      >
                        {signal.title}
                      </p>
                      <p className="mt-3 text-sm leading-6 text-white/64">
                        {signal.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
