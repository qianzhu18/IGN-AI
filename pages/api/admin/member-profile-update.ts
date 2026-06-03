import type { NextApiRequest, NextApiResponse } from "next";

import { isOpsAuthorized } from "@/lib/join";
import {
  updateNotionMemberProfile,
  type MemberProfileFields,
} from "@/lib/server/notionMemberUpdater";

const allowedFields = new Set<keyof MemberProfileFields>([
  "avatar",
  "bio",
  "role",
  "summary",
  "quote",
  "website",
  "social_github",
  "social_x",
  "social_linkedin",
  "featured",
  "verified",
  "status",
]);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Method not allowed." });
  }

  if (!isOpsAuthorized(req)) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const body = (req.body || {}) as {
    pageId?: unknown;
    memberSlug?: unknown;
    fields?: unknown;
  };
  const pageId = typeof body.pageId === "string" ? body.pageId.trim() : "";
  const memberSlug = typeof body.memberSlug === "string" ? body.memberSlug.trim() : "";
  if (!pageId) {
    return res.status(400).json({ message: "缺少 Notion pageId。" });
  }

  const rawFields = body.fields && typeof body.fields === "object"
    ? (body.fields as Record<string, unknown>)
    : {};
  const fields: MemberProfileFields = {};

  for (const [key, value] of Object.entries(rawFields)) {
    if (!allowedFields.has(key as keyof MemberProfileFields)) continue;
    if (typeof value === "boolean") {
      if (key === "featured") fields.featured = value;
      if (key === "verified") fields.verified = value;
      continue;
    }

    if (typeof value !== "string" || !value.trim()) continue;
    const text = value.trim();
    switch (key) {
      case "avatar":
        fields.avatar = text;
        break;
      case "bio":
        fields.bio = text;
        break;
      case "role":
        fields.role = text;
        break;
      case "summary":
        fields.summary = text;
        break;
      case "quote":
        fields.quote = text;
        break;
      case "website":
        fields.website = text;
        break;
      case "social_github":
        fields.social_github = text;
        break;
      case "social_x":
        fields.social_x = text;
        break;
      case "social_linkedin":
        fields.social_linkedin = text;
        break;
      case "status":
        fields.status = text;
        break;
    }
  }

  try {
    const data: unknown = await updateNotionMemberProfile(pageId, fields);
    const revalidated: string[] = [];
    const revalidateTargets = ["/members", memberSlug ? `/members/${memberSlug}` : ""].filter(
      Boolean,
    );

    for (const target of revalidateTargets) {
      try {
        await res.revalidate(target);
        revalidated.push(target);
      } catch {
        // Revalidation is best-effort because local dev and export mode may not support it.
      }
    }

    return res.status(200).json({ data, revalidated });
  } catch (error) {
    const message = error instanceof Error ? error.message : "NOTION_UPDATE_FAILED";

    if (message === "NOTION_MEMBER_UPDATE_NOT_CONFIGURED") {
      return res.status(503).json({ message: "Notion 写入环境变量尚未配置。" });
    }
    if (message === "NO_VALID_MEMBER_FIELDS") {
      return res.status(400).json({ message: "没有可写入的成员字段。" });
    }

    return res.status(500).json({ message: "成员资料写回 Notion 失败。" });
  }
}
