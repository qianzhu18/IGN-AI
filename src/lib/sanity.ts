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
  "slug": slug.current,
  "type": select(_type == "post" => "article", _type),
  "eyebrow": select(_type == "post" => "Article", _type == "event" => "Event", _type == "story" => "Story", "Resource"),
  title,
  "description": coalesce(excerpt, description, summary),
  "date": coalesce(publishedAt, startsAt, _createdAt),
  "location": location,
  "coverImage": coverImage.asset->url,
  "actionLabel": select(_type == "event" => "查看活动", _type == "story" => "阅读故事", _type == "resource" => "查看资源", "阅读文章"),
  "href": select(
    _type == "event" => "/events/" + slug.current,
    _type == "story" => "/stories/" + slug.current,
    "/blog/" + slug.current
  ),
  "tags": coalesce(tags, []),
  "content": coalesce(content[]{heading, body}, [])
}`;

export async function getCommunityContentItems(): Promise<CommunityContentItem[]> {
  const items = await sanityFetch<CommunityContentItem[]>(contentQuery);
  const normalized = items?.filter((item) => item.slug && item.title && item.href);
  return normalized && normalized.length > 0 ? normalized : fallbackContentItems;
}

export async function getCommunityContentItemBySlug(slug: string) {
  const items = await getCommunityContentItems();
  return items.find((item) => item.slug === slug);
}
