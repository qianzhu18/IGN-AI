import type { NextApiRequest, NextApiResponse } from "next";

import {
  createJoinApplication,
  enforceJoinSubmissionGuard,
  normalizeJoinSubmission,
} from "@/lib/join";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Method not allowed." });
  }

  try {
    const input = normalizeJoinSubmission((req.body || {}) as Record<string, unknown>);
    enforceJoinSubmissionGuard(req, input);
    const record = await createJoinApplication(input);
    const duplicateDetected = Boolean(record.metadata?.duplicate_detected);

    return res.status(200).json({
      message: duplicateDetected
        ? "我们已经收到过这份申请，不需要重复提交。"
        : "已收到申请，我们会尽快联系你。",
      duplicate: duplicateDetected,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "MISSING_REQUIRED_FIELDS") {
      return res.status(400).json({ message: "请完整填写姓名、联系方式和身份。" });
    }
    if (error instanceof Error && error.message === "DUPLICATE_SUBMISSION") {
      return res.status(409).json({ message: "我们已经收到这份申请，请不要重复提交。" });
    }
    if (error instanceof Error && error.message === "RATE_LIMITED") {
      const retryAfterSeconds =
        typeof (error as Error & { retryAfterSeconds?: unknown }).retryAfterSeconds === "number"
          ? (error as Error & { retryAfterSeconds: number }).retryAfterSeconds
          : 60;
      res.setHeader("Retry-After", String(retryAfterSeconds));
      return res.status(429).json({
        message: "提交太频繁了，请稍后再试。",
        retryAfterSeconds,
      });
    }

    return res.status(500).json({ message: "提交失败，请稍后再试。" });
  }
}
