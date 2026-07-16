import { records, type RecordItem } from "@/src/content/records";

export function sortRecordsByTimeline(items: RecordItem[] = records): RecordItem[] {
  return [...items].sort((left, right) => {
    if (!left.timelineDate && !right.timelineDate) return 0;
    if (!left.timelineDate) return 1;
    if (!right.timelineDate) return -1;
    return right.timelineDate.localeCompare(left.timelineDate);
  });
}

export function getAllRecords(): RecordItem[] {
  return sortRecordsByTimeline();
}

export function getFeaturedRecords(limit = 3): RecordItem[] {
  return sortRecordsByTimeline()
    .filter((record) => record.timelineDate)
    .slice(0, limit);
}

export function getRecordBySlug(slug: string): RecordItem | null {
  return records.find((record) => record.slug === slug) ?? null;
}
