import { NextResponse } from "next/server";

import { listJoinApplications } from "@/lib/supabase";

export async function GET() {
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
