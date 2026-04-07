// ─── Input Sanitization & XSS / Injection Protection ──────────────────────

/**
 * Encodes dangerous HTML characters to their entity equivalents.
 * This prevents stored/reflected XSS when data is rendered in HTML context.
 */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

/**
 * Strips dangerous patterns from user input.
 * Covers: HTML tags, javascript: URIs, inline event handlers, data: URIs,
 * vbscript:, expression(), null bytes, and NoSQL $ operators.
 */
export function sanitizeText(value: string | undefined | null): string {
  if (typeof value !== "string") return "";

  return (
    value
      // Remove HTML/XML tags
      .replace(/<[^>]*>?/g, "")
      // Remove javascript: protocol (with optional whitespace/encoding tricks)
      .replace(/javascript\s*:/gi, "")
      // Remove vbscript: protocol
      .replace(/vbscript\s*:/gi, "")
      // Remove data: URIs (often used for XSS)
      .replace(/data\s*:[^,]*,/gi, "")
      // Remove inline event handlers (onclick=, onerror=, onload=, etc.)
      .replace(/on\w+\s*=/gi, "")
      // Remove CSS expression() calls
      .replace(/expression\s*\(/gi, "")
      // Remove -moz-binding
      .replace(/-moz-binding\s*:/gi, "")
      // Remove NoSQL injection operators ($ prefix used in MongoDB)
      .replace(/[$]/g, "")
      // Remove null bytes
      .replace(/\0/g, "")
      // Remove other control characters (except newline/tab for textarea)
      .replace(/[\x01-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
      .trim()
  );
}

/**
 * Ensures a value is purely a valid phone number.
 * Strips everything except digits, +, spaces, dashes, parentheses.
 */
export function sanitizePhone(value: string | undefined | null): string {
  if (typeof value !== "string") return "";
  const cleaned = sanitizeText(value);
  return cleaned.replace(/[^\d\s\-()+]/g, "").trim();
}

/**
 * Enforces a maximum length on a string after sanitization.
 * Useful for preventing oversized payloads that could cause DoS.
 */
export function sanitizeWithLimit(
  value: string | undefined | null,
  maxLength: number,
): string {
  const sanitized = sanitizeText(value);
  return sanitized.slice(0, maxLength);
}

/**
 * Sanitizes a MongoDB ObjectId string.
 * Allows only hex characters and ensures correct length (24 chars).
 */
export function sanitizeObjectId(value: string | undefined | null): string {
  if (typeof value !== "string") return "";
  const cleaned = value.replace(/[^a-fA-F0-9]/g, "");
  return cleaned.length === 24 ? cleaned : "";
}

/**
 * Deep-sanitizes a plain object to protect against prototype pollution
 * and NoSQL injection. Removes keys starting with $ or __proto__.
 * Recursively processes nested objects and arrays.
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  if (obj === null || typeof obj !== "object") return obj;

  if (Array.isArray(obj)) {
    return obj.map((item) =>
      typeof item === "object" && item !== null
        ? sanitizeObject(item as Record<string, unknown>)
        : item,
    ) as unknown as T;
  }

  const clean: Record<string, unknown> = {};
  for (const key of Object.keys(obj)) {
    // Block prototype pollution vectors and MongoDB operators
    if (
      key === "__proto__" ||
      key === "constructor" ||
      key === "prototype" ||
      key.startsWith("$")
    ) {
      continue;
    }

    const value = obj[key];
    if (typeof value === "object" && value !== null) {
      clean[key] = sanitizeObject(value as Record<string, unknown>);
    } else if (typeof value === "string") {
      clean[key] = sanitizeText(value);
    } else {
      clean[key] = value;
    }
  }

  return clean as T;
}
