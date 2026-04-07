// ─── Admin Auth — Pending Request Store + Telegram Bot Helpers ────────────────
//
// NOTE: Uses an in-memory Map. For multi-instance/serverless deployments,
// replace with a Redis or MongoDB-backed store.

type PendingStatus = "pending" | "approved" | "denied" | "expired";

interface PendingRequest {
  status: PendingStatus;
  expiresAt: number;
}

const pendingRequests = new Map<string, PendingRequest>();
const REQUEST_TTL_MS = 5 * 60 * 1000; // 5 minutes

// Cleanup stale entries every minute
const cleanup = setInterval(() => {
  const now = Date.now();
  for (const [id, req] of pendingRequests) {
    if (now > req.expiresAt) pendingRequests.delete(id);
  }
}, 60_000);
// Allow Node to exit without waiting for this timer
if (typeof cleanup === "object" && cleanup !== null && "unref" in cleanup) {
  (cleanup as { unref: () => void }).unref();
}

// ─── Store helpers ────────────────────────────────────────────────────────────

export function createPendingRequest(requestId: string): void {
  pendingRequests.set(requestId, {
    status: "pending",
    expiresAt: Date.now() + REQUEST_TTL_MS,
  });
}

export function getPendingStatus(requestId: string): PendingStatus {
  const req = pendingRequests.get(requestId);
  if (!req) return "expired";
  if (Date.now() > req.expiresAt) {
    pendingRequests.delete(requestId);
    return "expired";
  }
  return req.status;
}

export function resolvePendingRequest(
  requestId: string,
  decision: "approved" | "denied",
): boolean {
  const req = pendingRequests.get(requestId);
  if (!req || Date.now() > req.expiresAt) return false;
  req.status = decision;
  pendingRequests.set(requestId, req);
  return true;
}

// ─── Telegram Bot API helpers ─────────────────────────────────────────────────

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID!;
const TG = `https://api.telegram.org/bot${BOT_TOKEN}`;

/**
 * Sends a Telegram message with Approve / Deny inline buttons.
 */
export async function sendTelegramLoginRequest(requestId: string): Promise<void> {
  const shortId = requestId.slice(0, 8);
  const payload = {
    chat_id: CHAT_ID,
    text:
      `🔐 *Login Attempt*\n\n` +
      `Someone is requesting access to the *FlowerS Admin Panel*.\n\n` +
      `Request ID: \`${shortId}…\`\n` +
      `_Expires in 5 minutes._`,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [
          { text: "✅ Approve", callback_data: `approve:${requestId}` },
          { text: "❌ Deny", callback_data: `deny:${requestId}` },
        ],
      ],
    },
  };

  const res = await fetch(`${TG}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Telegram sendMessage failed: ${res.status} — ${err}`);
  }
}

/**
 * Acknowledges a Telegram callback_query (removes the loading spinner).
 */
export async function answerCallbackQuery(
  callbackQueryId: string,
  text: string,
): Promise<void> {
  await fetch(`${TG}/answerCallbackQuery`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ callback_query_id: callbackQueryId, text }),
  });
}
