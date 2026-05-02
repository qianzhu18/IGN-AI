import type { Metadata } from "next";

import { EventCard } from "@/components/cards/EventCard";
import { PageShell } from "@/components/layout/PageShell";
import { PageHero } from "@/components/ui/PageHero";
import { eventFormatLabel, eventStatusLabel } from "@/content/events";
import { getAllEvents } from "@/lib/events";

export const metadata: Metadata = {
  title: "Events | IGNAI",
  description: "IGNAI 近期活动、线下聚会、主题共创和公开分享。",
};

export default function EventsPage() {
  const events = getAllEvents();

  return (
    <PageShell>
      <section className="relative z-10">
        <div className="mx-auto w-full max-w-[1200px] px-5 py-20 sm:px-8 lg:py-28">
          <div className="flex flex-col gap-10">
            <PageHero
              eyebrow="Upcoming Events"
              title="Upcoming activities."
              description="近期联动活动、线下聚会、主题共创和公开分享会集中展示在这里，方便后续真实编辑和上线。"
            />

            <div className="flex flex-wrap gap-3">
              {["全部", ...Object.values(eventStatusLabel), ...Object.values(eventFormatLabel)].map((filter) => (
                <span
                  key={filter}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/60"
                >
                  {filter}
                </span>
              ))}
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
              {events.map((event, index) => (
                <EventCard key={event.slug} event={event} featured={index === 0} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
