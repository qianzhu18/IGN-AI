import { siteLinks } from "@/content/links";
import { siteContent } from "@/content/site";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10">
      <div className="mx-auto flex w-full max-w-[1380px] flex-col gap-8 px-6 py-10 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:px-12">
        <div>
          <p className="font-display text-3xl italic text-white">{siteContent.name}</p>
          <p className="mt-2 text-sm text-[#DDE4F0]/82">{siteContent.slogan}</p>
          <p className="mt-4 text-sm leading-7 text-[#A1AAB8]">
            {siteContent.footerNote}
            <br />
            {siteContent.footerLocation}
          </p>
        </div>

        <div className="flex flex-col gap-2 text-sm text-[#A1AAB8]">
          <a href="#what-is-ignai" className="transition hover:text-white">
            Manifesto
          </a>
          <a href="#core-spirit" className="transition hover:text-white">
            Core Spirit
          </a>
          <a href="#community-vibe" className="transition hover:text-white">
            Community Vibe
          </a>
          <a href={`mailto:${siteLinks.contactEmail}`} className="transition hover:text-white">
            {siteLinks.contactEmail}
          </a>
          <p className="pt-2 text-xs uppercase tracking-[0.24em] text-[#DDE4F0]/50">
            Copyright © {new Date().getFullYear()} IGNAI
          </p>
        </div>
      </div>
    </footer>
  );
}
