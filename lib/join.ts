import { promises as fs } from "fs";
import path from "path";
import { createHash, randomUUID, timingSafeEqual } from "crypto";
import type { IncomingMessage } from "http";

import {
  getSupabaseServerClient,
  isJoinDatabaseEnabled,
  joinStatusOptions,
  type JoinApplicationMetadata,
  type JoinApplicationRecord,
  type JoinApplicationStatus,
  type JoinMemberProfileDraft,
} from "@/lib/supabase";

export type JoinExperienceMode = "database" | "local" | "external" | "email";

type RawJoinPayload = {
  name?: unknown;
  contact?: unknown;
  role?: unknown;
  message?: unknown;
  interests?: unknown;
  memberProfile?: unknown;
  source?: unknown;
};

export type JoinSubmissionInput = {
  name: string;
  contact: string;
  role: string;
  message: string;
  interests: string[];
  source: string;
  metadata: JoinApplicationMetadata;
};

const JOIN_DATA_DIR = path.join(process.cwd(), ".data");
const JOIN_DATA_FILE = path.join(JOIN_DATA_DIR, "join-applications.json");
const OPS_COOKIE_NAME = "ignai_ops_session";

type JoinApplicationRow = Record<string, unknown>;

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeOptionalUrl(value: unknown) {
  const input = readString(value);
  if (!input) return "";
  if (/^https?:\/\//i.test(input) || /^mailto:/i.test(input)) {
    return input;
  }
  return `https://${input}`;
}

function normalizeMemberProfile(raw: unknown): JoinMemberProfileDraft | undefined {
  if (!raw || typeof raw !== "object") return undefined;

  const record = raw as Record<string, unknown>;
  const memberProfile: JoinMemberProfileDraft = {
    avatarUrl: normalizeOptionalUrl(record.avatarUrl),
    headline: readString(record.headline),
    website: normalizeOptionalUrl(record.website),
    github: normalizeOptionalUrl(record.github),
    xiaohongshu: normalizeOptionalUrl(record.xiaohongshu),
  };

  const hasValue = Object.values(memberProfile).some(Boolean);
  return hasValue ? memberProfile : undefined;
}

export function normalizeJoinSubmission(payload: RawJoinPayload): JoinSubmissionInput {
  const name = readString(payload.name);
  const contact = readString(payload.contact);
  const role = readString(payload.role);
  const message = readString(payload.message);
  const source = readString(payload.source) || "website";
  const interests = Array.isArray(payload.interests)
    ? payload.interests
        .map((value) => readString(value))
        .filter(Boolean)
        .slice(0, 12)
    : [];

  const memberProfile = normalizeMemberProfile(payload.memberProfile);

  if (!name || !contact || !role) {
    throw new Error("MISSING_REQUIRED_FIELDS");
  }

  return {
    name,
    contact,
    role,
    message,
    source,
    interests,
    metadata: memberProfile ? { member_profile: memberProfile } : {},
  };
}

function ensureStatus(value: unknown): JoinApplicationStatus {
  return joinStatusOptions.includes(value as JoinApplicationStatus)
    ? (value as JoinApplicationStatus)
    : "submitted";
}

async function ensureJoinFile() {
  await fs.mkdir(JOIN_DATA_DIR, { recursive: true });
  try {
    await fs.access(JOIN_DATA_FILE);
  } catch {
    await fs.writeFile(JOIN_DATA_FILE, "[]\n", "utf8");
  }
}

async function readLocalJoinApplications(): Promise<JoinApplicationRecord[]> {
  await ensureJoinFile();
  const raw = await fs.readFile(JOIN_DATA_FILE, "utf8");
  const data: unknown = JSON.parse(raw);
  return Array.isArray(data)
    ? data.map((item) => normalizeJoinApplicationRecord(item))
    : [];
}

async function writeLocalJoinApplications(items: JoinApplicationRecord[]) {
  await ensureJoinFile();
  await fs.writeFile(JOIN_DATA_FILE, `${JSON.stringify(items, null, 2)}\n`, "utf8");
}

function normalizeJoinApplicationRecord(row: unknown): JoinApplicationRecord {
  const item = (row || {}) as JoinApplicationRow;

  return {
    id: readString(item.id) || randomUUID(),
    name: readString(item.name),
    contact: readString(item.contact),
    role: readString(item.role),
    interests: Array.isArray(item.interests)
      ? item.interests.map((value) => readString(value)).filter(Boolean)
      : [],
    message: readString(item.message),
    source: readString(item.source) || "website",
    status: ensureStatus(item.status),
    created_at: readString(item.created_at) || new Date(0).toISOString(),
    updated_at: readString(item.updated_at) || readString(item.created_at) || new Date(0).toISOString(),
    metadata:
      item.metadata && typeof item.metadata === "object"
        ? (item.metadata as JoinApplicationMetadata)
        : {},
  };
}

const NOTION_MEMBERS_DB_ID = 'a3ae45c4-da1e-821e-8e69-010ad0a42134';
const NOTION_MEMBER_DRAFT_STATUS =
  process.env.NOTION_MEMBERS_STATUS_DRAFT_VALUE || 'Invisible';

export function isJoinNotionEnabled(): boolean {
  return Boolean(process.env.NOTION_API_TOKEN?.trim());
}

async function createNotionMemberApplication(
  input: JoinSubmissionInput,
): Promise<JoinApplicationRecord | null> {
  const token = process.env.NOTION_API_TOKEN;
  if (!token) return null;

  const profile = input.metadata?.member_profile;
  const now = new Date().toISOString();

  // 将 interests + message + 小红书拼入 bio
  const bioParts: string[] = [];
  if (input.message) bioParts.push(input.message);
  if (input.interests.length > 0) bioParts.push(`兴趣方向：${input.interests.join('、')}`);
  if (profile?.xiaohongshu) bioParts.push(`小红书：${profile.xiaohongshu}`);
  bioParts.push(`联系方式：${input.contact}`);
  bioParts.push(`来源：${input.source} | 提交时间：${now}`);
  const bio = bioParts.join('\n\n');

  const properties: Record<string, unknown> = {
    title: { title: [{ text: { content: input.name } }] },
    role: { rich_text: [{ text: { content: input.role.slice(0, 200) } }] },
    bio: { rich_text: [{ text: { content: bio.slice(0, 2000) } }] },
    status: { select: { name: NOTION_MEMBER_DRAFT_STATUS } },
    type: { select: { name: 'Member' } },
    featured: { checkbox: false },
    verified: { checkbox: false },
  };

  if (profile?.headline) {
    properties.summary = { rich_text: [{ text: { content: profile.headline.slice(0, 200) } }] };
  }
  if (profile?.avatarUrl) {
    properties.avatar = { url: profile.avatarUrl };
  }
  if (profile?.website) {
    properties.website = { url: profile.website };
  }
  if (profile?.github) {
    properties.social_github = { url: profile.github };
  }

  try {
    const response = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        parent: { database_id: NOTION_MEMBERS_DB_ID },
        properties,
        ...(profile?.avatarUrl
          ? { icon: { external: { url: profile.avatarUrl } } }
          : {}),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[join:notion] page creation failed', {
        status: response.status,
        statusText: response.statusText,
        body: errorText.slice(0, 500),
      });
      return null;
    }

    const page = (await response.json()) as { id?: string };
    if (!page?.id) {
      console.warn('[join:notion] page creation succeeded but response id is missing');
      return null;
    }

    return {
      id: page.id,
      name: input.name,
      contact: input.contact,
      role: input.role,
      interests: input.interests,
      message: input.message,
      source: input.source,
      status: 'submitted',
      created_at: now,
      updated_at: now,
      metadata: {
        ...input.metadata,
        notion_page_id: page.id,
        join_writeback_target: 'notion',
      },
    };
  } catch (error) {
    console.error('[join:notion] page creation threw', error);
    return null;
  }
}

export async function createJoinApplication(
  input: JoinSubmissionInput,
): Promise<JoinApplicationRecord> {
  // 优先写入 Notion Members 数据库（Status=Draft，不会出现在前台）
  const notionResult = await createNotionMemberApplication(input);
  if (notionResult) return notionResult;

  const client = getSupabaseServerClient();

  if (client) {
    const now = new Date().toISOString();
    const result = await client
      .from("join_applications")
      .insert({
        name: input.name,
        contact: input.contact,
        role: input.role,
        interests: input.interests,
        message: input.message,
        source: input.source,
        status: "submitted",
        metadata: input.metadata,
        created_at: now,
        updated_at: now,
        last_activity_at: now,
      })
      .select("*")
      .single();

    if (result.error) throw result.error;

    return normalizeJoinApplicationRecord(result.data);
  }

  const now = new Date().toISOString();
  const record: JoinApplicationRecord = {
    id: randomUUID(),
    name: input.name,
    contact: input.contact,
    role: input.role,
    interests: input.interests,
    message: input.message,
    source: input.source,
    status: "submitted",
    created_at: now,
    updated_at: now,
    metadata: input.metadata,
  };

  const items = await readLocalJoinApplications();
  items.unshift(record);
  await writeLocalJoinApplications(items);
  return record;
}

export async function listJoinApplications(): Promise<JoinApplicationRecord[]> {
  const client = getSupabaseServerClient();

  if (client) {
    const result = await client
      .from("join_applications")
      .select("*")
      .order("created_at", { ascending: false });

    if (result.error) throw result.error;

    return (result.data || []).map((item) => normalizeJoinApplicationRecord(item));
  }

  return readLocalJoinApplications();
}

export async function updateJoinApplicationStatus(
  id: string,
  status: JoinApplicationStatus,
): Promise<JoinApplicationRecord | null> {
  if (!joinStatusOptions.includes(status)) {
    throw new Error("INVALID_STATUS");
  }

  const client = getSupabaseServerClient();

  if (client) {
    const now = new Date().toISOString();
    const result = await client
      .from("join_applications")
      .update({
        status,
        updated_at: now,
        last_activity_at: now,
      })
      .eq("id", id)
      .select("*")
      .single();

    if (result.error) throw result.error;
    if (!result.data) return null;

    return normalizeJoinApplicationRecord(result.data);
  }

  const items = await readLocalJoinApplications();
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return null;

  const existing = items[index];
  if (!existing) return null;

  const updated = normalizeJoinApplicationRecord({
    ...existing,
    status,
    updated_at: new Date().toISOString(),
  });
  items[index] = updated;
  await writeLocalJoinApplications(items);
  return updated;
}

export function getJoinExperienceMode(): JoinExperienceMode {
  const configured = process.env.NEXT_PUBLIC_JOIN_FORM_URL?.trim();
  const forced = process.env.NEXT_PUBLIC_JOIN_EXPERIENCE_MODE?.trim();

  if (forced === "external" || forced === "email" || forced === "local" || forced === "database") {
    return forced;
  }
  if (configured) return "external";
  if (isJoinNotionEnabled()) return "database";
  if (isJoinDatabaseEnabled()) return "database";
  return "local";
}

function getOpsPasswordHash(password: string) {
  return createHash("sha256").update(password).digest("hex");
}

export function isOpsPasswordConfigured(): boolean {
  return Boolean(process.env.OPS_ACCESS_PASSWORD?.trim());
}

export function buildOpsSessionCookie(password: string) {
  const value = getOpsPasswordHash(password);
  const parts = [
    `${OPS_COOKIE_NAME}=${value}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    "Max-Age=2592000",
  ];

  if (process.env.NODE_ENV === "production") {
    parts.push("Secure");
  }

  return parts.join("; ");
}

export function buildOpsLogoutCookie() {
  return `${OPS_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

function readCookieValue(req: IncomingMessage, key: string) {
  const raw = req.headers.cookie || "";
  const chunks = raw.split(";").map((part) => part.trim());
  for (const chunk of chunks) {
    if (chunk.startsWith(`${key}=`)) {
      return decodeURIComponent(chunk.slice(key.length + 1));
    }
  }
  return "";
}

export function isOpsAuthorized(req: IncomingMessage): boolean {
  const configured = process.env.OPS_ACCESS_PASSWORD?.trim();
  if (!configured) return false;

  const expected = Buffer.from(getOpsPasswordHash(configured));
  const actual = Buffer.from(readCookieValue(req, OPS_COOKIE_NAME));

  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
