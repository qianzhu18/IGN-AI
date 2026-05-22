import type { NextApiRequest, NextApiResponse } from "next";

import { isOpsAuthorized, listJoinApplications } from "@/lib/join";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ message: "Method not allowed." });
  }

  if (!isOpsAuthorized(req)) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const data = await listJoinApplications();
    return res.status(200).json({ data });
  } catch {
    return res.status(500).json({ message: "读取申请记录失败。" });
  }
}
