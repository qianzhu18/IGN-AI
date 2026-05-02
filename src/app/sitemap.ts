import type { MetadataRoute } from "next";

import { siteLinks } from "@/content/links";
import { getAllEvents } from "@/lib/events";
import { getAllRecords } from "@/lib/records";

const absoluteUrl = (path: string) => new URL(path, siteLinks.siteUrl).toString();

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/events"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/records"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: absoluteUrl("/join"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  const eventRoutes = getAllEvents().map((event) => ({
    url: absoluteUrl(`/events/${event.slug}`),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: event.status === "open" ? 0.9 : 0.7,
  }));

  const recordRoutes = getAllRecords().map((record) => ({
    url: absoluteUrl(`/records/${record.slug}`),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  return [...staticRoutes, ...eventRoutes, ...recordRoutes];
}
