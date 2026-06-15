import { events, type EventItem } from "@/src/content/events";

export function getUpcomingEvents(limit = events.length): EventItem[] {
  return events.slice(0, limit);
}

export function getEventBySlug(slug: string): EventItem | null {
  return events.find((event) => event.slug === slug) ?? null;
}
