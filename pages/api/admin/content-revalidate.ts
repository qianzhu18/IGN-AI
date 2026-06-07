import type { NextApiRequest, NextApiResponse } from "next";

import { cleanCache } from "@/lib/cache/local_file_cache";
import { isOpsAuthorized, isOpsPasswordConfigured } from "@/lib/join";

const DEFAULT_PATHS = ["/", "/members", "/events", "/records"];

function normalizeSlug(value: unknown) {
  if (typeof value !== "string") return "";
  return value
    .trim()
    .replace(/^\/+|\/+$/g, "")
    .replace(/^events\//, "")
    .replace(/[^a-zA-Z0-9-_]/g, "");
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Method not allowed." });
  }

  if (!isOpsPasswordConfigured()) {
    return res.status(503).json({ message: "OPS_ACCESS_PASSWORD 未配置。" });
  }

  if (!isOpsAuthorized(req)) {
    return res.status(401).json({ message: "请先登录运营后台。" });
  }

  if (typeof res.revalidate !== "function") {
    return res.status(503).json({ message: "当前运行环境不支持即时刷新。" });
  }

  const body = (req.body || {}) as { eventSlug?: unknown };
  const eventSlug = normalizeSlug(body.eventSlug);
  const paths = eventSlug ? [...DEFAULT_PATHS, `/events/${eventSlug}`] : DEFAULT_PATHS;
  const revalidated: string[] = [];

  cleanCache();

  for (const path of paths) {
    await res.revalidate(path);
    revalidated.push(path);
  }

  return res.status(200).json({
    message: "内容缓存已刷新。",
    revalidated,
  });
}
