"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

type CTAButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
};

export function CTAButton({
  href,
  children,
  variant = "primary",
  className,
}: CTAButtonProps) {
  const isExternal =
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("mailto:");

  return (
    <Link
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noreferrer" : undefined}
      className={cn(
        "button-shine group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full border px-5 py-3 text-sm font-medium transition duration-300",
        variant === "primary" &&
          "border-white/80 bg-[#F8F3EE] text-[#111111] shadow-[0_14px_40px_rgba(255,255,255,0.14)] hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_20px_48px_rgba(255,255,255,0.18)]",
        variant === "secondary" &&
          "border-white/12 bg-white/[0.04] text-white hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.08]",
        variant === "ghost" &&
          "border-transparent bg-transparent px-0 py-0 text-[#DDE4F0] hover:text-white",
        className,
      )}
    >
      <span>{children}</span>
      <ArrowRight className="h-4 w-4 transition duration-300 group-hover:translate-x-1" />
    </Link>
  );
}
