import { NextResponse } from "next/server";

import {
  createOpsSessionValue,
  getOpsSessionCookieOptions,
  isOpsPasswordConfigured,
  opsSessionCookieName,
  validateOpsPassword,
} from "@/lib/opsAuth";

export async function POST(request: Request) {
  if (!isOpsPasswordConfigured) {
    return NextResponse.json(
      { message: "OPS_ACCESS_PASSWORD 尚未配置。" },
      { status: 503 },
    );
  }

  const payload = (await request.json()) as { password?: string };
  const password = payload.password?.trim() || "";

  if (!validateOpsPassword(password)) {
    return NextResponse.json(
      { message: "访问密码不正确。" },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ message: "已进入运营后台。" });
  response.cookies.set(
    opsSessionCookieName,
    createOpsSessionValue(),
    getOpsSessionCookieOptions(),
  );

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ message: "已退出运营后台。" });
  response.cookies.set(opsSessionCookieName, "", {
    ...getOpsSessionCookieOptions(),
    maxAge: 0,
  });
  return response;
}
