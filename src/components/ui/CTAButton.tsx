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
  ariaLabel?: string;
  testId?: string;
};

export function CTAButton({
  href,
  children,
  variant = "primary",
  className,
  ariaLabel,
  testId,
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
      aria-label={ariaLabel}
      data-testid={testId}
      className={cn(
        "button-shine group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full border px-5 py-3 text-sm font-medium transition duration-300",
        variant === "primary" &&
          "border-[#ffd8ae]/40 bg-[linear-gradient(135deg,#ffb062_0%,#ff9a3c_34%,#ffc56b_100%)] text-[#111111] shadow-[0_20px_48px_rgba(255,122,24,0.28)] hover:-translate-y-0.5 hover:shadow-[0_26px_58px_rgba(255,122,24,0.34)]",
        variant === "secondary" &&
          "border-[#ffb879]/16 bg-[#0c1118]/90 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] hover:-translate-y-0.5 hover:border-[#ffb879]/30 hover:bg-[#121823]",
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
