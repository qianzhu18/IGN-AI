"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

import { EASE, viewport } from "@/lib/motion";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  y?: number;
};

export function Reveal({
  children,
  className,
  delay = 0,
  duration = 0.8,
  y = 32,
}: RevealProps) {
  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, y, filter: "brightness(0.72) contrast(0.92)" }}
      whileInView={{ opacity: 1, y: 0, filter: "brightness(1) contrast(1)" }}
      viewport={viewport}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
