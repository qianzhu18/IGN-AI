import { NextResponse } from "next/server";

import {
  joinStatusOptions,
  updateJoinApplicationStatus,
  type JoinApplicationStatus,
} from "@/lib/supabase";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
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
