import type { NextApiRequest, NextApiResponse } from "next";

import { isOpsAuthorized, updateJoinApplicationStatus } from "@/lib/join";
import { joinStatusOptions, type JoinApplicationStatus } from "@/lib/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PATCH") {
    res.setHeader("Allow", "PATCH");
    return res.status(405).json({ message: "Method not allowed." });
  }

  if (!isOpsAuthorized(req)) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const id = typeof req.query.id === "string" ? req.query.id : "";
  const body = (req.body || {}) as { status?: unknown };
  const status =
    typeof body.status === "string" ? (body.status as JoinApplicationStatus) : undefined;

  if (!id || !status || !joinStatusOptions.includes(status)) {
    return res.status(400).json({ message: "Invalid request payload." });
  }

  try {
    const data = await updateJoinApplicationStatus(id, status);
    if (!data) {
      return res.status(404).json({ message: "Record not found." });
    }
    return res.status(200).json({ data });
  } catch {
    return res.status(500).json({ message: "更新状态失败。" });
  }
}
