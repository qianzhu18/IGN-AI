import type { NextApiRequest, NextApiResponse } from "next";

import { createJoinApplication, normalizeJoinSubmission } from "@/lib/join";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Method not allowed." });
  }

  try {
    const input = normalizeJoinSubmission((req.body || {}) as Record<string, unknown>);
    await createJoinApplication(input);
    return res.status(200).json({ message: "已收到申请，我们会尽快联系你。" });
  } catch (error) {
    if (error instanceof Error && error.message === "MISSING_REQUIRED_FIELDS") {
      return res.status(400).json({ message: "请完整填写姓名、联系方式和身份。" });
    }

    return res.status(500).json({ message: "提交失败，请稍后再试。" });
  }
}
