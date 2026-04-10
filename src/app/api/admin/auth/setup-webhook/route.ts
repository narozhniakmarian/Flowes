
import { NextResponse } from "next/server";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const WEBHOOK_SECRET = process.env.TELEGRAM_WEBHOOK_SECRET!;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret") ?? "";
  const appUrl = searchParams.get("appUrl") ?? "";

  if (!WEBHOOK_SECRET || secret !== WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!appUrl) {
    return NextResponse.json({ error: "appUrl query param is required" }, { status: 400 });
  }

  const webhookUrl = `${appUrl}/api/admin/auth/telegram-webhook`;

  const res = await fetch(
    `https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: webhookUrl,
        secret_token: WEBHOOK_SECRET,
        allowed_updates: ["callback_query"],
      }),
    },
  );

  const data = await res.json();
  return NextResponse.json({ webhookUrl, telegramResponse: data });
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;
