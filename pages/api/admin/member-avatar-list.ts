import type { NextApiRequest, NextApiResponse } from "next";

import { isOpsAuthorized } from "@/lib/join";
import { listMemberAvatars } from "@/lib/server/cloudImageUploader";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ message: "Method not allowed." });
  }

  if (!isOpsAuthorized(req)) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const memberId = typeof req.query.memberId === "string" ? req.query.memberId : undefined;
  const memberSlug = typeof req.query.memberSlug === "string" ? req.query.memberSlug : undefined;
  const rawLimit = typeof req.query.limit === "string" ? Number(req.query.limit) : 300;
  const limit = Number.isFinite(rawLimit) ? Math.min(Math.max(rawLimit, 1), 300) : 300;

  if (!memberId && !memberSlug) {
    return res.status(400).json({ message: "缺少成员 ID 或 slug。" });
  }

  try {
    const input: { memberId?: string; memberSlug?: string; limit: number } = { limit };
    if (memberId) input.memberId = memberId;
    if (memberSlug) input.memberSlug = memberSlug;

    const items = await listMemberAvatars(input);
    return res.status(200).json({ data: { items } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "LIST_FAILED";

    if (message === "CLOUD_IMAGE_NOT_CONFIGURED") {
      return res.status(503).json({ message: "图床环境变量尚未配置。" });
    }

    return res.status(500).json({ message: "读取头像历史失败，请稍后重试。" });
  }
}
