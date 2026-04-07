// ─── Configurable Rate Limiter with Auto-Cleanup ──────────────────────────

type RateLimitRecord = {
  count: number;
  lastReset: number;
};

type RateLimitConfig = {
  /** Time window in milliseconds (default: 60_000 = 1 minute) */
  windowMs: number;
  /** Max requests allowed per window (default: 10) */
  maxRequests: number;
};

// ─── Global store (survives across requests within the same Node.js process) ─
const stores = new Map<string, Map<string, RateLimitRecord>>();

// ─── Periodic cleanup: remove stale entries every 5 minutes ─────────────────
const CLEANUP_INTERVAL = 5 * 60 * 1000;
let cleanupTimer: ReturnType<typeof setInterval> | null = null;

function startCleanup() {
  if (cleanupTimer) return;
  cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [, store] of stores) {
      for (const [key, record] of store) {
        // Remove entries that haven't been touched in 10 minutes
        if (now - record.lastReset > 10 * 60 * 1000) {
          store.delete(key);
        }
      }
    }
  }, CLEANUP_INTERVAL);

  // Allow Node to exit even if timer is running (for serverless / tests)
  if (
    cleanupTimer &&
    typeof cleanupTimer === "object" &&
    "unref" in cleanupTimer
  ) {
    cleanupTimer.unref();
  }
}

/**
 * Creates or retrieves a named rate-limiter store.
 */
function getStore(name: string): Map<string, RateLimitRecord> {
  let store = stores.get(name);
  if (!store) {
    store = new Map<string, RateLimitRecord>();
    stores.set(name, store);
    startCleanup();
  }
  return store;
}

// ─── Preset configurations ──────────────────────────────────────────────────

/** Strict: 5 requests per minute (order submissions, auth) */
export const RATE_LIMIT_STRICT: RateLimitConfig = {
  windowMs: 60_000,
  maxRequests: 5,
};

/** Standard: 30 requests per minute (products listing, general API) */
export const RATE_LIMIT_STANDARD: RateLimitConfig = {
  windowMs: 60_000,
  maxRequests: 30,
};

/** Relaxed: 60 requests per minute (static assets, gallery) */
export const RATE_LIMIT_RELAXED: RateLimitConfig = {
  windowMs: 60_000,
  maxRequests: 60,
};

// ─── Main rate limit function ───────────────────────────────────────────────

/**
 * Checks if the request from the given IP is within the rate limit.
 *
 * @param ip - The client IP address (or identifier)
 * @param storeName - Name of the rate-limit store (e.g. "orders", "products")
 * @param config - Rate limit configuration (defaults to STRICT)
 * @returns Object with `allowed` boolean and `retryAfterMs` for 429 responses
 */
export function rateLimit(
  ip: string,
  storeName = "default",
  config: RateLimitConfig = RATE_LIMIT_STRICT,
): { allowed: boolean; retryAfterMs: number } {
  const store = getStore(storeName);
  const now = Date.now();
  const windowStart = now - config.windowMs;

  const record = store.get(ip) || { count: 0, lastReset: now };

  // Reset window if expired
  if (record.lastReset < windowStart) {
    record.count = 1;
    record.lastReset = now;
  } else {
    record.count += 1;
  }

  store.set(ip, record);

  if (record.count > config.maxRequests) {
    const retryAfterMs = record.lastReset + config.windowMs - now;
    return { allowed: false, retryAfterMs: Math.max(0, retryAfterMs) };
  }

  return { allowed: true, retryAfterMs: 0 };
}

/**
 * Extracts client IP from the request headers.
 * Falls back to "unknown-ip" if not available.
 */
export function getClientIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown-ip"
  );
}
