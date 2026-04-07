import { NextResponse } from "next/server";
import { getPendingStatus } from "@/lib/adminAuth";
import { createAdminSession } from "@/lib/session";

const REQUEST_ID_PATTERN = /^[a-f0-9]{54}$/;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const requestId = searchParams.get("requestId") ?? "";

  if (!REQUEST_ID_PATTERN.test(requestId)) {
    return NextResponse.json({ error: "Invalid request ID" }, { status: 400 });
  }

  const status = getPendingStatus(requestId);

  if (status === "approved") {
    // Mint JWT and set httpOnly session cookie
    await createAdminSession();
  }

  return NextResponse.json({ status });
}
