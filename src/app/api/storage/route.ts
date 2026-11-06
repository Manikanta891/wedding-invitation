import { NextRequest, NextResponse } from "next/server";
import { getStorageMetrics } from "@/lib/storage";
import { getAuthUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const user = getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const stats = await getStorageMetrics();
    return NextResponse.json(stats);
  } catch (error) {
    console.error("Storage stats error:", error);
    return NextResponse.json({ error: "Failed to retrieve storage metrics" }, { status: 500 });
  }
}
