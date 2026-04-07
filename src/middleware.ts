// ─── Admin Route Protection Middleware ───────────────────────────────────────
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "admin_session";
const LOGIN_PATH = "/admin/login";

function getEncodedKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET ?? "";
  return new TextEncoder().encode(secret);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow the login page and the Telegram webhook through without auth
  if (pathname === LOGIN_PATH || pathname.startsWith("/api/admin/auth/")) {
    return NextResponse.next();
  }

  // Protect all other /admin routes
  /*
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get(COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
    }

    try {
      await jwtVerify(token, getEncodedKey(), { algorithms: ["HS256"] });
      return NextResponse.next();
    } catch {
      // Token invalid or expired — clear cookie and redirect
      const response = NextResponse.redirect(new URL(LOGIN_PATH, request.url));
      response.cookies.delete(COOKIE_NAME);
      return response;
    }
  }
  */

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
