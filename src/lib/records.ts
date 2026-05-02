import { records } from "@/content/records";

export const getAllRecords = () => records;

export const getFeaturedRecords = () => records.slice(0, 3);

export const getRecordBySlug = (slug: string) =>
  records.find((record) => record.slug === slug);
