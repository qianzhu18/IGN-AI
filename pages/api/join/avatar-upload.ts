import type { NextApiRequest, NextApiResponse } from "next";

import { uploadMemberAvatarFromDataUrl } from "@/lib/server/cloudImageUploader";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "8mb",
    },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Method not allowed." });
  }

  const body = (req.body || {}) as {
    dataUrl?: unknown;
    fileName?: unknown;
    name?: unknown;
  };
  const dataUrl = typeof body.dataUrl === "string" ? body.dataUrl : "";
  const fileName = typeof body.fileName === "string" ? body.fileName : "avatar";
  const name = typeof body.name === "string" ? body.name.trim() : "";

  if (!dataUrl) {
    return res.status(400).json({ message: "请先选择一张头像图片。" });
  }

  try {
    const upload = await uploadMemberAvatarFromDataUrl({
      dataUrl,
      fileName,
      memberSlug: name ? `join-${name}` : "join-draft",
    });
    return res.status(200).json({ data: upload });
  } catch (error) {
    const message = error instanceof Error ? error.message : "UPLOAD_FAILED";

    if (message === "CLOUD_IMAGE_NOT_CONFIGURED") {
      return res.status(503).json({ message: "头像上传服务还没配置好，请先联系管理员配置图床。" });
    }
    if (message === "IMAGE_TOO_LARGE") {
      return res.status(413).json({ message: "图片太大了，请选择 4MB 以内的图片。" });
    }
    if (message === "INVALID_DATA_URL" || message === "UNSUPPORTED_IMAGE_TYPE") {
      return res.status(400).json({ message: "图片格式暂不支持，请使用 JPG、PNG 或 WebP。" });
    }

    return res.status(500).json({ message: "头像上传失败，请稍后再试。" });
  }
}
