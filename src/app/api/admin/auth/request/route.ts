import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { rateLimit, getClientIp, RATE_LIMIT_STRICT } from "@/lib/rateLimit";
import { createPendingRequest, sendTelegramLoginRequest } from "@/lib/adminAuth";

export async function POST(req: Request) {
  // Rate limit: 5 attempts per minute per IP
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

  // 27 bytes = 54 hex chars; "approve:" prefix = 62 bytes total — within Telegram's 64-byte callback_data limit
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
