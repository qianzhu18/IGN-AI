type MemberProfileFields = {
  avatar?: string;
  bio?: string;
  role?: string;
  summary?: string;
  quote?: string;
  website?: string;
  social_github?: string;
  social_x?: string;
  social_linkedin?: string;
  featured?: boolean;
  verified?: boolean;
  status?: string;
};

const NOTION_API_BASE = "https://api.notion.com/v1";
const NOTION_VERSION = process.env.NOTION_API_VERSION || "2026-03-11";

const propertyNames: Record<keyof MemberProfileFields, string> = {
  avatar: process.env.NOTION_MEMBERS_PROP_AVATAR || "avatar",
  bio: process.env.NOTION_MEMBERS_PROP_BIO || "bio",
  role: process.env.NOTION_MEMBERS_PROP_ROLE || "role",
  summary: process.env.NOTION_MEMBERS_PROP_SUMMARY || "summary",
  quote: process.env.NOTION_MEMBERS_PROP_QUOTE || "quote",
  website: process.env.NOTION_MEMBERS_PROP_WEBSITE || "website",
  social_github: process.env.NOTION_MEMBERS_PROP_SOCIAL_GITHUB || "social_github",
  social_x: process.env.NOTION_MEMBERS_PROP_SOCIAL_X || "social_x",
  social_linkedin: process.env.NOTION_MEMBERS_PROP_SOCIAL_LINKEDIN || "social_linkedin",
  featured: process.env.NOTION_MEMBERS_PROP_FEATURED || "featured",
  verified: process.env.NOTION_MEMBERS_PROP_VERIFIED || "verified",
  status: process.env.NOTION_MEMBERS_PROP_STATUS || "status",
};

function readToken() {
  return process.env.NOTION_API_TOKEN?.trim() || process.env.NOTION_ACCESS_TOKEN?.trim() || "";
}

export function isNotionMemberUpdateConfigured() {
  return Boolean(readToken());
}

function richText(content: string) {
  return [
    {
      type: "text",
      text: { content },
    },
  ];
}

function cleanString(value: unknown, max = 2000) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function cleanUrl(value: unknown) {
  const input = cleanString(value, 2048);
  if (!input) return "";
  if (/^https?:\/\//i.test(input) || /^mailto:/i.test(input)) return input;
  return `https://${input}`;
}

function buildProperties(fields: MemberProfileFields) {
  const properties: Record<string, unknown> = {};

  const richTextFields: Array<keyof MemberProfileFields> = ["bio", "role", "summary", "quote"];
  for (const key of richTextFields) {
    const value = cleanString(fields[key]);
    if (value) {
      properties[propertyNames[key]] = { rich_text: richText(value) };
    }
  }

  const urlFields: Array<keyof MemberProfileFields> = [
    "avatar",
    "website",
    "social_github",
    "social_x",
    "social_linkedin",
  ];
  for (const key of urlFields) {
    const value = cleanUrl(fields[key]);
    if (value) {
      properties[propertyNames[key]] = { url: value };
    }
  }

  if (typeof fields.featured === "boolean") {
    properties[propertyNames.featured] = { checkbox: fields.featured };
  }
  if (typeof fields.verified === "boolean") {
    properties[propertyNames.verified] = { checkbox: fields.verified };
  }
  if (fields.status) {
    properties[propertyNames.status] = { select: { name: cleanString(fields.status, 80) } };
  }

  return properties;
}

export async function updateNotionMemberProfile(pageId: string, fields: MemberProfileFields) {
  const token = readToken();
  if (!token) {
    throw new Error("NOTION_MEMBER_UPDATE_NOT_CONFIGURED");
  }

  const properties = buildProperties(fields);
  if (Object.keys(properties).length === 0) {
    throw new Error("NO_VALID_MEMBER_FIELDS");
  }

  const response = await fetch(`${NOTION_API_BASE}/pages/${pageId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Notion-Version": NOTION_VERSION,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ properties }),
  });

  const text = await response.text();
  const data: unknown = text ? (JSON.parse(text) as unknown) : {};

  if (!response.ok) {
    throw new Error(
      `NOTION_MEMBER_UPDATE_FAILED:${response.status}:${JSON.stringify(data).slice(0, 500)}`,
    );
  }

  return data;
}

export type { MemberProfileFields };
