import { createClient } from "next-sanity";

import { fallbackContentItems, type CommunityContentItem } from "@/content/platform";
import {
  isSanityConfigured,
  sanityApiVersion,
  sanityDataset,
  sanityProjectId,
  sanityReadToken,
} from "@/sanity/env";

export { isSanityConfigured };

const client = createClient({
  projectId: sanityProjectId,
  dataset: sanityDataset,
  apiVersion: sanityApiVersion,
  useCdn: !sanityReadToken,
  token: sanityReadToken,
});

export async function sanityFetch<T>(
  query: string,
  params?: Record<string, unknown>,
): Promise<T | null> {
  if (!isSanityConfigured) {
    return null;
  }

  return client.fetch<T>(query, params || {}, {
    next: { revalidate: 60 },
  });
}

const contentQuery = `*[_type in ["post", "event", "story", "resource"]] | order(coalesce(publishedAt, _createdAt) desc)[0...12] {
  "type": select(_type == "post" => "article", _type),
  "eyebrow": select(_type == "post" => "Article", _type == "event" => "Event", _type == "story" => "Story", "Resource"),
  title,
  "description": coalesce(excerpt, description, summary),
  "date": coalesce(publishedAt, startsAt, _createdAt),
  "location": location,
  "coverImage": coverImage.asset->url,
  "actionLabel": select(_type == "event" => "查看活动", _type == "story" => "阅读故事", _type == "resource" => "查看资源", "阅读文章"),
  "href": select(_type == "event" => "/events", _type == "story" => "/stories", "/blog"),
  "tags": coalesce(tags, [])
}`;

export async function getCommunityContentItems(): Promise<CommunityContentItem[]> {
  const items = await sanityFetch<CommunityContentItem[]>(contentQuery);
  return items && items.length > 0 ? items : fallbackContentItems;
}
