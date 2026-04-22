"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, Sparkles } from "lucide-react";
import { useRef } from "react";

import { CTAButton } from "@/components/ui/CTAButton";
import { primaryLinks } from "@/content/links";
import { siteContent } from "@/content/site";

const floatingNotes = [
  {
    label: "Local roots",
    className: "left-[7%] top-[18%]",
  },
  {
    label: "Global sight",
    className: "right-[9%] top-[32%]",
  },
  {
    label: "Build in public",
    className: "left-[18%] bottom-[18%]",
  },
];

export function HeroSection() {
  const ref = useRef<HTMLElement | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const contentY = useTransform(scrollYProgress, [0, 0.6], [0, shouldReduceMotion ? 0 : -84]);
  const contentOpacity = useTransform(
    scrollYProgress,
    [0, 0.52, 0.7],
    [1, 1, shouldReduceMotion ? 1 : 0.18],
  );
  const imageY = useTransform(scrollYProgress, [0, 1], [0, shouldReduceMotion ? 0 : 72]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.02, shouldReduceMotion ? 1.02 : 1.12]);
  const imageOpacity = useTransform(scrollYProgress, [0, 0.68, 1], [0.96, 0.92, 0.76]);

  return (
    <section ref={ref} className="relative min-h-[180vh]">
      <div className="sticky top-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(114,94,255,0.12),transparent_26%),radial-gradient(circle_at_18%_16%,rgba(255,130,56,0.08),transparent_22%),linear-gradient(180deg,#020202_0%,#050507_62%,#020202_100%)]" />
        <div className="ambient-fade absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04),transparent_44%)]" />

        <motion.div
          style={{ y: imageY, scale: imageScale, opacity: imageOpacity }}
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[50vh] overflow-hidden sm:h-[56vh] lg:h-[62vh]"
        >
          <Image
            src="/images/generated/hero-bloom.png"
            alt="Night bloom visual with luminous flowers and nebula glow"
            fill
            priority
            className="object-cover object-bottom"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,2,2,1)_0%,rgba(2,2,2,0.58)_28%,rgba(2,2,2,0.12)_52%,rgba(2,2,2,0.92)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(180deg,transparent,rgba(2,2,2,0.86))]" />
        </motion.div>

        <div className="relative mx-auto flex min-h-screen max-w-[1380px] flex-col px-6 pb-10 pt-6 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between gap-4 rounded-full border border-white/10 bg-white/[0.03] px-4 py-3 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/14 bg-[radial-gradient(circle,rgba(255,132,64,0.8)_0%,rgba(118,89,255,0.55)_100%)] text-sm font-semibold text-white shadow-[0_12px_34px_rgba(122,104,255,0.16)]">
                IG
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.34em] text-white/90">
                  {siteContent.name}
                </p>
                <p className="text-xs text-white/48">{siteContent.slogan}</p>
              </div>
            </div>

            <nav className="hidden items-center gap-5 text-sm text-white/70 lg:flex">
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

          <motion.div
            style={{ y: contentY, opacity: contentOpacity }}
            className="relative z-10 flex flex-1 flex-col justify-center pb-[28vh] pt-20 sm:pt-24 lg:pb-[31vh]"
          >
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs uppercase tracking-[0.28em] text-[#F3C18A]">
              <Sparkles className="h-3.5 w-3.5" />
              Youth AI Community
            </div>

            <p className="mt-6 text-xs font-medium uppercase tracking-[0.38em] text-[#E7D47C]/78 sm:text-[0.78rem]">
              {siteContent.eyebrow}
            </p>

            <h1 className="mt-8 max-w-[11ch] font-display text-[4.3rem] italic leading-[0.88] tracking-[-0.05em] text-white sm:text-[6rem] lg:text-[8.6rem]">
              Ignite before AGI.
            </h1>

            <p className="mt-5 max-w-3xl text-xl leading-9 text-white/88 sm:text-[1.9rem] sm:leading-[1.65]">
              在 AGI 之前，先点燃一群人。
            </p>

            <p className="mt-6 max-w-2xl text-base leading-8 text-white/56 sm:text-lg">
              {siteContent.description}
              {" "}
              {siteContent.mission}
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <CTAButton href={primaryLinks.joinCommunity.href}>加入社区</CTAButton>
              <CTAButton href="#what-is-ignai" variant="secondary">
                看看我们为什么存在
              </CTAButton>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              {siteContent.heroTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/74"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3 lg:hidden">
              {siteContent.heroHighlights.map((item) => (
                <div
                  key={item.label}
                  className="surface-card-strong p-5"
                >
                  <p className="text-[0.7rem] uppercase tracking-[0.32em] text-[#E7D47C]/72">
                    {item.label}
                  </p>
                  <p className="mt-3 font-display text-2xl italic text-white">{item.value}</p>
                  <p className="mt-2 text-sm leading-6 text-white/54">{item.detail}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="absolute inset-x-0 bottom-12 z-20 hidden lg:block">
            <div className="mx-auto grid max-w-[1380px] grid-cols-3 gap-5 px-6 lg:px-12">
              {siteContent.heroHighlights.map((item) => (
                <div
                  key={item.label}
                  className="surface-card-strong bg-black/36 p-5"
                >
                  <p className="text-[0.7rem] uppercase tracking-[0.32em] text-[#E7D47C]/70">
                    {item.label}
                  </p>
                  <p className="mt-3 font-display text-[2rem] italic leading-none text-white">
                    {item.value}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-white/52">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute bottom-8 left-6 z-20 hidden items-center gap-3 text-sm text-white/46 lg:flex">
            <span>Scroll to explore</span>
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
              <ArrowDown className="h-4 w-4" />
            </span>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 hidden lg:block">
          {floatingNotes.map((note, index) => (
            <motion.div
              key={note.label}
              className={`absolute rounded-full border border-white/10 bg-black/42 px-4 py-2 text-sm text-white/70 backdrop-blur-xl ${note.className}`}
              animate={
                shouldReduceMotion
                  ? undefined
                  : {
                      y: [0, -10, 0],
                    }
              }
              transition={{
                duration: 7 + index,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {note.label}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
