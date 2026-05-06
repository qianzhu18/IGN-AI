import {
  events as fallbackEvents,
  eventFormatLabel,
  eventStatusLabel,
  type EventFormat,
  type EventItem,
  type EventStatus,
} from "@/content/events";
import { sanityFetch } from "@/lib/sanity";

type SanityEvent = Omit<EventItem, "slug" | "status" | "format"> & {
  slug?: string;
  status?: string;
  format?: string;
  cover?: string;
};

const eventQuery = `*[
  _type == "event" &&
  defined(slug.current) &&
  !(_id in path("drafts.**"))
] | order(coalesce(sortOrder, 100) asc, _createdAt desc) {
  "slug": slug.current,
  title,
  subtitle,
  status,
  dateText,
  location,
  format,
  "cover": coalesce(coverImage.asset->url, coverUrl),
  excerpt,
  "tags": coalesce(tags, []),
  registrationUrl,
  "registrationQrImage": registrationQrImage.asset->url,
  "audience": coalesce(audience, []),
  "agenda": coalesce(agenda, []),
  "hosts": coalesce(hosts, []),
  "notes": coalesce(notes, []),
  "content": coalesce(content[]{heading, body}, [])
}`;

const isEventStatus = (status: string | undefined): status is EventStatus =>
  Boolean(status && status in eventStatusLabel);

const isEventFormat = (format: string | undefined): format is EventFormat =>
  Boolean(format && format in eventFormatLabel);

const normalizeEvent = (event: SanityEvent): EventItem | null => {
  if (!event.slug || !event.title || !event.excerpt) {
    return null;
  }

  return {
    slug: event.slug,
    title: event.title,
    subtitle: event.subtitle,
    status: isEventStatus(event.status) ? event.status : "planning",
    dateText: event.dateText || "筹备中",
    location: event.location || "待定",
    format: isEventFormat(event.format) ? event.format : "offline",
    cover: event.cover || "/images/generated/human-energy-scene.png",
    excerpt: event.excerpt,
    tags: event.tags || [],
    registrationUrl: event.registrationUrl || "/join",
    registrationQrImage: event.registrationQrImage || "",
    audience: event.audience || [],
    agenda: event.agenda || [],
    hosts: event.hosts || ["IGNAI"],
    notes: event.notes || [],
    content: event.content?.length
      ? event.content
      : [{ heading: "活动介绍", body: event.excerpt }],
  };
};

export async function getAllEvents(): Promise<EventItem[]> {
  try {
    const sanityEvents = await sanityFetch<SanityEvent[]>(eventQuery);
    const normalized = sanityEvents
      ?.map(normalizeEvent)
      .filter((event): event is EventItem => Boolean(event));

    return normalized && normalized.length > 0 ? normalized : fallbackEvents;
  } catch {
    return fallbackEvents;
  }
}

export async function getUpcomingEvents() {
  const events = await getAllEvents();
  return events.filter((event) => event.status !== "finished").slice(0, 3);
}

export async function getEventBySlug(slug: string) {
  const events = await getAllEvents();
  return events.find((event) => event.slug === slug);
}
