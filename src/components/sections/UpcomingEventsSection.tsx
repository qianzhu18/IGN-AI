import { Reveal } from "@/components/motion/Reveal";
import { EventCard } from "@/components/cards/EventCard";
import { CTAButton } from "@/components/ui/CTAButton";
import { getUpcomingEvents } from "@/lib/events";

export async function UpcomingEventsSection() {
  const events = await getUpcomingEvents();

  return (
    <section id="upcoming-events" className="relative z-10 border-t border-white/8">
      <div className="mx-auto w-full max-w-[1200px] px-5 py-24 sm:px-8 lg:py-[120px]">
        <Reveal>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="section-eyebrow">Upcoming Events</p>
              <h2 className="section-title mt-6 max-w-[13ch]">
                近期活动，
                <br />
                真实发生。
              </h2>
              <p className="section-body mt-6">
                线下聚会、主题共创、工作坊和社区实验，都会在这里持续更新。
              </p>
            </div>
            <div className="flex gap-4">
              <CTAButton href="/events">查看全部活动</CTAButton>
            </div>
          </div>
        </Reveal>

        <div className="mt-16 grid items-stretch gap-6 lg:grid-cols-3">
          {events.map((event, index) => (
            <Reveal key={event.slug} delay={index * 0.06} className="h-full">
              <EventCard event={event} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
