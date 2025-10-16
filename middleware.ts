import { auth } from "@/auth"
import { NextResponse } from "next/server"

/**
 * Middleware to protect admin routes
 * Uses Auth.js v5 auth() function for proper session handling
 */
export default auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth
  const userRole = req.auth?.user?.role

  // Protect admin routes (except login and setup)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login" && pathname !== "/admin/setup") {
    if (!isLoggedIn) {
      // Not authenticated - redirect to login
      const loginUrl = new URL("/admin/login", req.url)
      loginUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(loginUrl)
    }

    if (userRole !== "admin") {
      // Not an admin - redirect to home
      return NextResponse.redirect(new URL("/", req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    // Match all admin routes
    "/admin/:path*",
    // Exclude static files and API routes
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
