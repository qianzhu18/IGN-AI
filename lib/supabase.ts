import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export type JoinApplicationStatus =
  | "submitted"
  | "reviewing"
  | "contacted"
  | "accepted"
  | "waitlisted"
  | "withdrawn"
  | "spam"
  | "archived";

export const joinStatusOptions: JoinApplicationStatus[] = [
  "submitted",
  "reviewing",
  "contacted",
  "accepted",
  "waitlisted",
  "withdrawn",
  "spam",
  "archived",
];

export const joinStatusLabel: Record<JoinApplicationStatus, string> = {
  submitted: "新提交",
  reviewing: "查看中",
  contacted: "已联系",
  accepted: "已接纳",
  waitlisted: "待定",
  withdrawn: "已撤回",
  spam: "无效",
  archived: "已归档",
};

export type JoinMemberProfileDraft = {
  avatarUrl?: string;
  headline?: string;
  website?: string;
  github?: string;
  xiaohongshu?: string;
};

export type JoinApplicationMetadata = {
  is_test?: boolean;
  member_profile?: JoinMemberProfileDraft;
  [key: string]: unknown;
};

export type JoinApplicationRecord = {
  id: string;
  name: string;
  contact: string;
  role: string;
  interests: string[];
  message: string;
  source: string;
  status: JoinApplicationStatus;
  created_at: string;
  updated_at: string;
  metadata?: JoinApplicationMetadata;
};

export function getSupabaseServerClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();

  if (!url || !key) {
    return null;
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export function isJoinDatabaseEnabled(): boolean {
  return Boolean(getSupabaseServerClient());
}
