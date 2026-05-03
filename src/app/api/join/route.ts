import { NextResponse } from "next/server";

import { createJoinApplication } from "@/lib/join";
import type { JoinApplicationInput } from "@/lib/supabase";

const interestOptions = new Set(["线下交流", "主题共创", "项目展示", "内容分享", "合作咨询"]);

const isString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

export async function POST(request: Request) {
  const payload = (await request.json()) as Partial<JoinApplicationInput>;

  const name = payload.name?.trim();
  const contact = payload.contact?.trim();
  const role = payload.role?.trim();
  const message = payload.message?.trim() || "";
  const interests = Array.isArray(payload.interests)
    ? payload.interests.filter((item): item is string => isString(item) && interestOptions.has(item))
    : [];

  if (!name || !contact || !role) {
    return NextResponse.json(
      { message: "请补充姓名、联系方式和身份描述。" },
      { status: 400 },
    );
  }

  const result = await createJoinApplication({
    name,
    contact,
    role,
    interests,
    message,
    source: "website",
  });

  if (!result.ok) {
    return NextResponse.json(
      {
        message:
          result.status === 503 ? result.message : "提交失败，请稍后再试。",
      },
      { status: result.status },
    );
  }

  return NextResponse.json({ message: result.message });
}
