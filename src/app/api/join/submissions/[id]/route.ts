import { NextResponse } from "next/server";

import {
  isOpsPasswordConfigured,
  isOpsProtectionRequired,
  isOpsRequestAuthorized,
} from "@/lib/opsAuth";
import {
  joinStatusOptions,
  updateJoinApplicationStatus,
  type JoinApplicationStatus,
} from "@/lib/supabase";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (isOpsProtectionRequired && !isOpsPasswordConfigured) {
    return NextResponse.json(
      { message: "OPS_ACCESS_PASSWORD 尚未配置。", data: null },
      { status: 503 },
    );
  }

  if (isOpsPasswordConfigured && !(await isOpsRequestAuthorized())) {
    return NextResponse.json(
      { message: "未授权访问。", data: null },
      { status: 401 },
    );
  }

  const { id } = await context.params;
  const payload = (await request.json()) as { status?: string };

  if (!payload.status || !joinStatusOptions.includes(payload.status as JoinApplicationStatus)) {
    return NextResponse.json(
      { message: "无效的状态更新请求。" },
      { status: 400 },
    );
  }

  const result = await updateJoinApplicationStatus(id, payload.status as JoinApplicationStatus);

  if (!result.ok) {
    return NextResponse.json(
      {
        message: result.message,
        data: null,
      },
      { status: result.status },
    );
  }

  return NextResponse.json({
    message: result.message,
    data: result.data,
  });
}
