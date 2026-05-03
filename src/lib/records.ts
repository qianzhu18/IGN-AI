import {
  records as fallbackRecords,
  recordTypeLabel,
  type RecordItem,
  type RecordType,
} from "@/content/records";
import { sanityFetch } from "@/lib/sanity";

type SanityRecord = Omit<RecordItem, "slug" | "type"> & {
  slug?: string;
  type?: string;
  cover?: string;
};

const recordQuery = `*[
  _type == "record" &&
  defined(slug.current) &&
  !(_id in path("drafts.**"))
] | order(coalesce(sortOrder, 100) asc, _createdAt desc) {
  "slug": slug.current,
  title,
  type,
  dateText,
  location,
  "cover": coalesce(coverImage.asset->url, coverUrl),
  excerpt,
  "outcomes": coalesce(outcomes, []),
  "tags": coalesce(tags, []),
  "content": coalesce(content[]{heading, body}, []),
  links
}`;

const isRecordType = (type: string | undefined): type is RecordType =>
  Boolean(type && type in recordTypeLabel);

const normalizeRecord = (record: SanityRecord): RecordItem | null => {
  if (!record.slug || !record.title || !record.excerpt) {
    return null;
  }

  return {
    slug: record.slug,
    title: record.title,
    type: isRecordType(record.type) ? record.type : "recap",
    dateText: record.dateText || "持续更新",
    location: record.location,
    cover: record.cover || "/images/generated/collaboration-threads.png",
    excerpt: record.excerpt,
    outcomes: record.outcomes || [],
    tags: record.tags || [],
    content: record.content?.length
      ? record.content
      : [{ heading: "记录摘要", body: record.excerpt }],
    links: record.links,
  };
};

export async function getAllRecords(): Promise<RecordItem[]> {
  try {
    const sanityRecords = await sanityFetch<SanityRecord[]>(recordQuery);
    const normalized = sanityRecords
      ?.map(normalizeRecord)
      .filter((record): record is RecordItem => Boolean(record));

    return normalized && normalized.length > 0 ? normalized : fallbackRecords;
  } catch {
    return fallbackRecords;
  }
}

export async function getFeaturedRecords() {
  const records = await getAllRecords();
  return records.slice(0, 3);
}

export async function getRecordBySlug(slug: string) {
  const records = await getAllRecords();
  return records.find((record) => record.slug === slug);
}
