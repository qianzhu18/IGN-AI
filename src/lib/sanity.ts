import { fallbackContentItems, type CommunityContentItem } from "@/content/platform";

const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET || "production";
const apiVersion = process.env.SANITY_API_VERSION || "2025-02-19";

type SanityQueryResponse<T> = {
  result?: T;
  error?: {
    description?: string;
    message?: string;
  };
};

export const isSanityConfigured = Boolean(projectId && dataset);

export async function sanityFetch<T>(query: string, params?: Record<string, string>) {
  if (!isSanityConfigured) {
    return null;
  }

  const url = new URL(
    `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}`,
  );
  url.searchParams.set("query", query);

  Object.entries(params || {}).forEach(([key, value]) => {
    url.searchParams.set(`$${key}`, JSON.stringify(value));
  });

  const response = await fetch(url, {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error(`Sanity request failed: ${response.status}`);
  }

  const payload = (await response.json()) as SanityQueryResponse<T>;
  if (payload.error) {
    throw new Error(payload.error.description || payload.error.message || "Sanity query failed");
  }

  return payload.result ?? null;
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
