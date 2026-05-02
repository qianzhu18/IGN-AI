import Link from "next/link";

import { siteContent } from "@/content/site";

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
      <div className="surface-card flex items-center justify-between gap-4 px-4 py-3 sm:px-5">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#ffb879]/20 bg-[radial-gradient(circle,rgba(255,168,94,0.92)_0%,rgba(93,169,255,0.28)_100%)] text-sm font-semibold text-white shadow-[0_12px_34px_rgba(255,140,76,0.16)]">
            IG
          </div>
          <div>
            <p className="text-sm font-semibold uppercase text-white/92">
              {siteContent.name}
            </p>
            <p className="text-xs text-white/50">{siteContent.slogan}</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-5 text-sm text-white/68 lg:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
