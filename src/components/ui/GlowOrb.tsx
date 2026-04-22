"use client";

import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

type GlowOrbProps = {
  className?: string;
  style?: CSSProperties;
  gradient?: string;
  blur?: number;
};

export function GlowOrb({
  className,
  style,
  gradient = "radial-gradient(circle, rgba(255,122,24,0.7) 0%, rgba(255,122,24,0.08) 55%, transparent 75%)",
  blur = 12,
}: GlowOrbProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute rounded-full opacity-80 mix-blend-screen",
        className,
      )}
      style={{
        background: gradient,
        filter: `blur(${blur}px)`,
        ...style,
      }}
    />
  );
}

