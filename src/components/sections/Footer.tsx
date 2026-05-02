import Link from "next/link";

import { footerLines } from "@/content/community";
import { siteLinks } from "@/content/links";
import { siteContent } from "@/content/site";

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
          <Link href="/#what-is-ignai" className="transition hover:text-white">
            What is IGNAI
          </Link>
          <Link href="/#culture" className="transition hover:text-white">
            Culture
          </Link>
          <Link href="/events" className="transition hover:text-white">
            Events
          </Link>
          <Link href="/records" className="transition hover:text-white">
            Records
          </Link>
          <Link href="/blog" className="transition hover:text-white">
            Journal
          </Link>
          <Link href="/join" className="transition hover:text-white">
            Join
          </Link>
          <a href={`mailto:${siteLinks.contactEmail}`} className="transition hover:text-white">
            {siteLinks.contactEmail}
          </a>
          <p className="pt-2 text-xs uppercase text-white/34">
            Copyright © {new Date().getFullYear()} IGNAI
          </p>
        </div>
      </div>
    </footer>
  );
}
