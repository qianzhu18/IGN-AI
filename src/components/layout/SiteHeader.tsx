import Link from "next/link";

import { BrandLockup } from "@/components/layout/BrandLockup";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Events", href: "/events" },
  { label: "Records", href: "/records" },
  { label: "Journal", href: "/blog" },
  { label: "Join", href: "/join" },
];

export function SiteHeader() {
  return (
    <header className="relative z-20 mx-auto w-full max-w-[1200px] px-5 pt-5 sm:px-8">
      <div className="flex items-center justify-between gap-4 border-b border-white/10 py-4">
        <BrandLockup compact />

        <nav className="hidden items-center gap-5 text-sm text-white/68 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-label={`顶部导航：${item.label}`}
              className="transition hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
