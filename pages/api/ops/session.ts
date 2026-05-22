import type { NextApiRequest, NextApiResponse } from "next";

import {
  buildOpsLogoutCookie,
  buildOpsSessionCookie,
  isOpsPasswordConfigured,
} from "@/lib/join";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "DELETE") {
    res.setHeader("Set-Cookie", buildOpsLogoutCookie());
    return res.status(200).json({ message: "已退出后台访问。" });
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, DELETE");
    return res.status(405).json({ message: "Method not allowed." });
  }

  if (!isOpsPasswordConfigured()) {
    return res.status(503).json({ message: "OPS_ACCESS_PASSWORD 未配置。" });
  }

  const body = (req.body || {}) as { password?: unknown };
  const password = typeof body.password === "string" ? body.password.trim() : "";

  if (!password || password !== process.env.OPS_ACCESS_PASSWORD?.trim()) {
    return res.status(401).json({ message: "密码不正确。" });
  }

  res.setHeader("Set-Cookie", buildOpsSessionCookie(password));
  return res.status(200).json({ message: "验证通过。" });
}
