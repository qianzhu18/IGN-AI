const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

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

export const isSupabaseServerConfigured = Boolean(supabaseUrl && supabaseServiceRoleKey);

export async function insertJoinApplication(input: JoinApplicationInput) {
  if (!isSupabaseServerConfigured) {
    return {
      ok: false,
      status: 503,
      message: "Supabase is not configured yet.",
    };
  }

  const url = supabaseUrl as string;
  const serviceRoleKey = supabaseServiceRoleKey as string;

  const response = await fetch(`${url}/rest/v1/join_applications`, {
    method: "POST",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
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
