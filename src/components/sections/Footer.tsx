import Link from "next/link";

import { footerLines } from "@/src/content/community";
import { siteContent } from "@/src/content/site";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/8">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-5 py-10 sm:px-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-display text-3xl italic text-white">{siteContent.name}</p>
          <div className="mt-2 space-y-1 text-sm text-white/78">
            {footerLines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          <p className="mt-4 text-sm leading-7 text-white/50">
            {siteContent.footerLocation}
          </p>
        </div>

        <div className="flex flex-col gap-2 text-sm text-white/56">
          <Link href="/#what-is-ignai" aria-label="页脚导航：What is IGNAI" className="transition hover:text-white">
            What is IGNAI
          </Link>
          <Link href="/#culture" aria-label="页脚导航：Culture" className="transition hover:text-white">
            Culture
          </Link>
          <Link href="/events" aria-label="页脚导航：Events" className="transition hover:text-white">
            Events
          </Link>
          <Link href="/records" aria-label="页脚导航：Records" className="transition hover:text-white">
            Records
          </Link>
          <Link href="/blog" aria-label="页脚导航：Journal" className="transition hover:text-white">
            Journal
          </Link>
          <Link href="/join" aria-label="页脚导航：Join" className="transition hover:text-white">
            Join
          </Link>
          <Link href="/manage" aria-label="页脚导航：Manage" className="transition hover:text-white">
            Manage
          </Link>
          <p className="pt-2 text-xs uppercase text-white/34">
            Copyright © {new Date().getFullYear()} IGNAI
          </p>
        </div>
      </div>
    </footer>
  );
}
