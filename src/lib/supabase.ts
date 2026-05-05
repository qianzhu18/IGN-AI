const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const supabaseWriteKey = supabaseSecretKey || supabaseServiceRoleKey || supabasePublishableKey;

export type JoinApplicationInput = {
  name: string;
  contact: string;
  role: string;
  interests: string[];
  message: string;
  source?: string;
  status?: "submitted" | "reviewing" | "contacted" | "accepted" | "waitlisted" | "withdrawn" | "spam" | "archived";
  metadata?: Record<string, unknown>;
};

export type JoinApplicationRecord = {
  id: string;
  name: string;
  contact: string;
  role: string;
  interests: string[];
  message: string;
  source: string;
  status: string;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  last_activity_at: string;
  reviewed_at: string | null;
  contacted_at: string | null;
  resolved_at: string | null;
  archived_at: string | null;
  delete_after: string | null;
};

export const joinStatusOptions = [
  "submitted",
  "reviewing",
  "contacted",
  "accepted",
  "waitlisted",
  "withdrawn",
  "spam",
  "archived",
] as const;

export type JoinApplicationStatus = (typeof joinStatusOptions)[number];

export const joinStatusLabel: Record<JoinApplicationStatus, string> = {
  submitted: "待处理",
  reviewing: "处理中",
  contacted: "已联系",
  accepted: "已接受",
  waitlisted: "待后续",
  withdrawn: "已撤回",
  spam: "无效 / 垃圾",
  archived: "已归档",
};

export const isSupabaseServerConfigured = Boolean(supabaseUrl && supabaseWriteKey);
export const isSupabaseUsingServiceRole = Boolean(
  supabaseUrl && (supabaseSecretKey || supabaseServiceRoleKey),
);

export async function insertJoinApplication(input: JoinApplicationInput) {
  if (!isSupabaseServerConfigured) {
    return {
      ok: false,
      status: 503,
      message: "Supabase is not configured yet.",
    };
  }

  const url = supabaseUrl as string;
  const writeKey = supabaseWriteKey as string;

  const response = await fetch(`${url}/rest/v1/join_applications`, {
    method: "POST",
    headers: {
      apikey: writeKey,
      Authorization: `Bearer ${writeKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      name: input.name,
      contact: input.contact,
      role: input.role,
      interests: input.interests,
      message: input.message,
      source: input.source || "website",
      status: input.status || "submitted",
      metadata: input.metadata || {},
    }),
  });

  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      message: await response.text(),
    };
  }

  return {
    ok: true,
    status: response.status,
    message: "Application received.",
  };
}

export async function listJoinApplications(limit = 20) {
  if (!isSupabaseServerConfigured) {
    return {
      ok: false,
      status: 503,
      message: "Supabase is not configured yet.",
      data: [] as JoinApplicationRecord[],
    };
  }

  const url = supabaseUrl as string;
  const writeKey = supabaseWriteKey as string;

  const response = await fetch(
    `${url}/rest/v1/join_applications?select=*&order=created_at.desc&limit=${limit}`,
    {
      headers: {
        apikey: writeKey,
        Authorization: `Bearer ${writeKey}`,
        Accept: "application/json",
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      message: await response.text(),
      data: [] as JoinApplicationRecord[],
    };
  }

  return {
    ok: true,
    status: response.status,
    message: "Applications fetched.",
    data: (await response.json()) as JoinApplicationRecord[],
  };
}

export async function updateJoinApplicationStatus(
  id: string,
  status: JoinApplicationStatus,
) {
  if (!isSupabaseServerConfigured) {
    return {
      ok: false,
      status: 503,
      message: "Supabase is not configured yet.",
      data: null as JoinApplicationRecord | null,
    };
  }

  const url = supabaseUrl as string;
  const writeKey = supabaseWriteKey as string;

  const nextFields: Record<string, unknown> = {
    status,
  };

  if (status === "reviewing") {
    nextFields.reviewed_at = new Date().toISOString();
  }

  if (status === "contacted") {
    nextFields.contacted_at = new Date().toISOString();
  }

  if (status === "accepted" || status === "withdrawn" || status === "archived" || status === "spam") {
    nextFields.resolved_at = new Date().toISOString();
  }

  if (status === "archived") {
    nextFields.archived_at = new Date().toISOString();
  }

  const response = await fetch(
    `${url}/rest/v1/join_applications?id=eq.${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      headers: {
        apikey: writeKey,
        Authorization: `Bearer ${writeKey}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(nextFields),
    },
  );

  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      message: await response.text(),
      data: null as JoinApplicationRecord | null,
    };
  }

  const rows = (await response.json()) as JoinApplicationRecord[];

  return {
    ok: true,
    status: response.status,
    message: "Application updated.",
    data: rows[0] || null,
  };
}
