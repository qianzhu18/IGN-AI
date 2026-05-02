import { events } from "@/content/events";

export const getAllEvents = () => events;

export const getUpcomingEvents = () =>
  events.filter((event) => event.status !== "finished").slice(0, 3);

export const getEventBySlug = (slug: string) =>
  events.find((event) => event.slug === slug);
