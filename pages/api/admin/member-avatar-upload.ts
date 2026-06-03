import type { NextApiRequest, NextApiResponse } from "next";

import { isOpsAuthorized } from "@/lib/join";
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

  if (!isOpsAuthorized(req)) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const body = (req.body || {}) as {
    dataUrl?: unknown;
    fileName?: unknown;
    memberId?: unknown;
    memberSlug?: unknown;
  };
  const dataUrl = typeof body.dataUrl === "string" ? body.dataUrl : "";
  const fileName = typeof body.fileName === "string" ? body.fileName : "avatar";
  const memberId = typeof body.memberId === "string" ? body.memberId : undefined;
  const memberSlug = typeof body.memberSlug === "string" ? body.memberSlug : undefined;

  if (!dataUrl) {
    return res.status(400).json({ message: "缺少头像文件。" });
  }

  try {
    const input: {
      dataUrl: string;
      fileName: string;
      memberId?: string;
      memberSlug?: string;
    } = {
      dataUrl,
      fileName,
    };
    if (memberId) input.memberId = memberId;
    if (memberSlug) input.memberSlug = memberSlug;

    const upload = await uploadMemberAvatarFromDataUrl(input);
    return res.status(200).json({ data: upload });
  } catch (error) {
    const message = error instanceof Error ? error.message : "UPLOAD_FAILED";

    if (message === "CLOUD_IMAGE_NOT_CONFIGURED") {
      return res.status(503).json({ message: "图床环境变量尚未配置。" });
    }
    if (message === "IMAGE_TOO_LARGE") {
      return res.status(413).json({ message: "图片过大，请使用 4MB 以内的头像。" });
    }
    if (message === "INVALID_DATA_URL" || message === "UNSUPPORTED_IMAGE_TYPE") {
      return res.status(400).json({ message: "图片格式不支持。" });
    }

    return res.status(500).json({ message: "头像上传失败，请稍后重试。" });
  }
}
