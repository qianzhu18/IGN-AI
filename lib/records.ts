import { records, type RecordItem } from "@/src/content/records";

export async function getAllRecords(): Promise<RecordItem[]> {
  return records;
}

export async function getFeaturedRecords(limit = 3): Promise<RecordItem[]> {
  return records.slice(0, limit);
}

export async function getRecordBySlug(slug: string): Promise<RecordItem | null> {
  return records.find((record) => record.slug === slug) ?? null;
}
