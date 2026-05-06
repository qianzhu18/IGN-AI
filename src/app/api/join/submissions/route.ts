import { NextResponse } from "next/server";

import {
  isOpsPasswordConfigured,
  isOpsProtectionRequired,
  isOpsRequestAuthorized,
} from "@/lib/opsAuth";
import { listJoinApplications } from "@/lib/supabase";

export async function GET() {
  if (isOpsProtectionRequired && !isOpsPasswordConfigured) {
    return NextResponse.json(
      { message: "OPS_ACCESS_PASSWORD 尚未配置。", data: [] },
      { status: 503 },
    );
  }

  if (isOpsPasswordConfigured && !(await isOpsRequestAuthorized())) {
    return NextResponse.json(
      { message: "未授权访问。", data: [] },
      { status: 401 },
    );
  }

  const result = await listJoinApplications(20);

  if (!result.ok) {
    return NextResponse.json(
      {
        message: result.message,
        data: [],
      },
      { status: result.status },
    );
  }

  return NextResponse.json({
    message: result.message,
    data: result.data,
  });
}
