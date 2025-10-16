import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Middleware to protect admin routes
 * Edge-compatible - no database calls
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect admin routes (except login and setup)
  if (
    pathname.startsWith("/admin") &&
    pathname !== "/admin/login" &&
    pathname !== "/admin/setup"
  ) {
    // Get JWT token from request
    const token = await getToken({
      req,
      secret: process.env.AUTH_SECRET,
    });

    if (!token) {
      // Not authenticated - redirect to login
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    if (token.role !== "admin") {
      // Not an admin - redirect to home
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
