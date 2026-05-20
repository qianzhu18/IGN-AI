import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";

import { eventFormatLabel, eventStatusLabel, type EventItem } from "@/src/content/events";

type EventCardProps = {
  event: EventItem;
};

export function EventCard({ event }: EventCardProps) {
  return (
    <Link
      href={`/events/${event.slug}`}
      className="group flex h-full min-h-[580px] flex-col overflow-hidden rounded-lg border border-white/10 bg-[#080d14]/72 transition duration-300 hover:-translate-y-1 hover:border-[#ffb879]/28 hover:bg-[#0a1018]/82 sm:min-h-[620px] lg:min-h-[0]"
    >
      <div className="relative overflow-hidden">
        <img
          src={event.cover}
          alt=""
          className="aspect-[16/9] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,6,10,0.06)_0%,rgba(4,6,10,0.18)_42%,rgba(4,6,10,0.82)_100%)]" />
        <div className="absolute left-4 top-4 rounded-full border border-[#ffb879]/20 bg-[#140b07]/74 px-3 py-1.5 text-xs font-medium text-[#ffd09a]">
          {eventStatusLabel[event.status]}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex flex-wrap gap-3 text-sm text-white/56">
          <span className="inline-flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-[#F0CB8A]/78" />
            {event.dateText}
          </span>
          <span className="inline-flex items-center gap-2">
            <MapPin className="h-4 w-4 text-[#9aceff]" />
            {event.location} · {eventFormatLabel[event.format]}
          </span>
        </div>

        <h3 className="mt-4 min-h-[3.7rem] text-[1.45rem] font-semibold leading-[1.26] text-white transition group-hover:text-[#ffd09a]">
          {event.title}
        </h3>
        {event.subtitle ? (
          <p className="mt-2 min-h-5 text-sm text-white/42">{event.subtitle}</p>
        ) : null}
        <p className="mt-4 line-clamp-2 text-sm leading-7 text-white/62">
          {event.excerpt}
        </p>

        <div className="mt-auto flex flex-wrap gap-2 pt-5">
          {event.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/58"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
