import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { rateLimit, getClientIp, RATE_LIMIT_STRICT } from "@/lib/rateLimit";
import { createPendingRequest, sendTelegramLoginRequest } from "@/lib/adminAuth";

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const { allowed, retryAfterMs } = rateLimit(ip, "admin-auth", RATE_LIMIT_STRICT);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(Math.ceil(retryAfterMs / 1000)) },
      },
    );
  }

  const requestId = randomBytes(27).toString("hex");
  const userAgent = req.headers.get("user-agent") || "Unknown";
  await createPendingRequest(requestId, { userAgent, ip });

  try {
    await sendTelegramLoginRequest(requestId);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[admin/auth/request] Telegram error:", msg);
    return NextResponse.json(
      { error: "Failed to send verification message. Check Telegram configuration." },
      { status: 500 },
    );
  }

  return NextResponse.json({ requestId });
}
