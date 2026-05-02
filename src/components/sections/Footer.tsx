import { footerLines } from "@/content/community";
import { siteLinks } from "@/content/links";
import { siteContent } from "@/content/site";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/8">
      <div className="mx-auto flex w-full max-w-[1380px] flex-col gap-8 px-6 py-10 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:px-12">
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
          <a href="#what-is-ignai" className="transition hover:text-white">
            What is IGNAI
          </a>
          <a href="#culture" className="transition hover:text-white">
            Culture
          </a>
          <a href="#identity" className="transition hover:text-white">
            Identity
          </a>
          <a href="#join" className="transition hover:text-white">
            Join
          </a>
          <a href={`mailto:${siteLinks.contactEmail}`} className="transition hover:text-white">
            {siteLinks.contactEmail}
          </a>
          <p className="pt-2 text-xs uppercase tracking-[0.24em] text-white/34">
            Copyright © {new Date().getFullYear()} IGNAI
          </p>
        </div>
      </div>
    </footer>
  );
}
