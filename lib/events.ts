import { events, type EventItem } from "@/src/content/events";

export async function getUpcomingEvents(limit = events.length): Promise<EventItem[]> {
  return events.slice(0, limit);
}

export async function getEventBySlug(slug: string): Promise<EventItem | null> {
  return events.find((event) => event.slug === slug) ?? null;
}
