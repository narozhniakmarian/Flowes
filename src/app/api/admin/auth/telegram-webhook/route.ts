import { NextResponse } from "next/server";
import { resolvePendingRequest, answerCallbackQuery } from "@/lib/adminAuth";

const WEBHOOK_SECRET = process.env.TELEGRAM_WEBHOOK_SECRET ?? "";

export async function POST(req: Request) {
  const incomingSecret = req.headers.get("x-telegram-bot-api-secret-token") ?? "";
  if (!WEBHOOK_SECRET || incomingSecret !== WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: true });
  }

  const callbackQuery = body?.callback_query as
    | { id: string; data?: string }
    | undefined;

  if (!callbackQuery) {
    return NextResponse.json({ ok: true });
  }

  const callbackData = callbackQuery.data ?? "";
  const callbackQueryId = callbackQuery.id;

  if (callbackData.startsWith("approve:")) {
    const requestId = callbackData.slice("approve:".length);
    const ok = resolvePendingRequest(requestId, "approved");
    await answerCallbackQuery(
      callbackQueryId,
      ok ? "✅ Access granted!" : "⚠️ Request not found or expired.",
    );
  } else if (callbackData.startsWith("deny:")) {
    const requestId = callbackData.slice("deny:".length);
    const ok = resolvePendingRequest(requestId, "denied");
    await answerCallbackQuery(
      callbackQueryId,
      ok ? "❌ Access denied." : "⚠️ Request not found or expired.",
    );
  }

  return NextResponse.json({ ok: true });
}
