export type EventStatus = "planning" | "ongoing" | "recap" | "open" | "closed" | "finished";
export type EventFormat = "offline" | "online" | "hybrid";
export type EventKind = "hosted" | "cohosted" | "promoted" | "participating";

export type EventItem = {
  slug: string;
  title: string;
  subtitle?: string;
  kind?: EventKind;
  status: EventStatus;
  dateText: string;
  location: string;
  format: EventFormat;
  cover: string;
  coverPosition?: string;
  externalUrl?: string;
  excerpt: string;
  tags: string[];
  registrationUrl?: string;
  registrationQrImage?: string;
  audience: string[];
  agenda: string[];
  hosts: string[];
  notes: string[];
  content: Array<{
    heading: string;
    body: string;
  }>;
};

export const eventStatusLabel: Record<EventStatus, string> = {
  planning: "筹备中",
  ongoing: "进行中",
  recap: "已复盘",
  open: "开放报名",
  closed: "已满员",
  finished: "已结束",
};

export const eventFormatLabel: Record<EventFormat, string> = {
  offline: "线下",
  online: "线上",
  hybrid: "线上 + 线下",
};

export const eventKindLabel: Record<EventKind, string> = {
  hosted: "成员组织",
  cohosted: "联动活动",
  promoted: "协助宣发",
  participating: "成员参与",
};

// Last-known seeds from the real Notion Event rows.
// Runtime pages prefer Notion `type=Event` data; this array is only an offline fallback.
export const events: EventItem[] = [];
