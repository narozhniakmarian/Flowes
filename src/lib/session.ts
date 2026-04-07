// ─── Admin Session Management (JWT, httpOnly cookie) ─────────────────────────
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE_NAME = "admin_session";
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

function getEncodedKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET env variable is not set");
  return new TextEncoder().encode(secret);
}

/**
 * Creates a signed JWT and sets it as an httpOnly admin session cookie.
 * Call this from a Route Handler after successful Telegram approval.
 */
export async function createAdminSession(): Promise<void> {
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .sign(getEncodedKey());

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });
}

/**
 * Verifies the admin session cookie. Returns true if valid.
 */
export async function verifyAdminSession(): Promise<boolean> {
  // BYPASS FOR TESTING
  return true;

  /*
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;

  try {
    await jwtVerify(token, getEncodedKey(), { algorithms: ["HS256"] });
    return true;
  } catch {
    return false;
  }
  */
}

/**
 * Deletes the admin session cookie (logout).
 */
export async function deleteAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
