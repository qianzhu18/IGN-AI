import { records, type RecordItem } from "@/src/content/records";

export function getAllRecords(): RecordItem[] {
  return records;
}

export function getFeaturedRecords(limit = 3): RecordItem[] {
  return records.slice(0, limit);
}

export function getRecordBySlug(slug: string): RecordItem | null {
  return records.find((record) => record.slug === slug) ?? null;
}
