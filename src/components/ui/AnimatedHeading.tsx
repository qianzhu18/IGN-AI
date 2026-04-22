"use client";

import { motion } from "framer-motion";

import { EASE, viewport } from "@/lib/motion";
import { cn } from "@/lib/utils";

type AnimatedHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function AnimatedHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: AnimatedHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      <motion.p
        className="text-xs font-medium uppercase tracking-[0.36em] text-[#F5FF65]/80"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewport}
        transition={{ duration: 0.6, ease: EASE }}
      >
        {eyebrow}
      </motion.p>
      <motion.h2
        className="mt-5 font-display text-[2.25rem] font-semibold leading-[1.02] text-balance text-white sm:text-5xl lg:text-[4rem]"
        initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={viewport}
        transition={{ duration: 0.8, delay: 0.05, ease: EASE }}
      >
        {title}
      </motion.h2>
      {description ? (
        <motion.p
          className="mt-5 max-w-2xl text-base leading-8 text-[#A1AAB8] sm:text-lg"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.75, delay: 0.12, ease: EASE }}
        >
          {description}
        </motion.p>
      ) : null}
    </div>
  );
}

