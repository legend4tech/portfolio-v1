import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;

  const isOnAdminPage = nextUrl.pathname.startsWith("/admin");
  const isOnLoginPage = nextUrl.pathname === "/admin/login";
  const isOnSetupPage = nextUrl.pathname === "/admin/setup";

  // Allow access to login and setup pages
  if (isOnLoginPage || isOnSetupPage) {
    // If already logged in as admin, redirect to admin dashboard
    if (isLoggedIn && userRole === "admin" && isOnLoginPage) {
      return NextResponse.redirect(new URL("/admin", nextUrl));
    }
    return NextResponse.next();
  }

  // Protect admin routes
  if (isOnAdminPage) {
    if (!isLoggedIn) {
      // Redirect to login with callback URL
      const loginUrl = new URL("/admin/login", nextUrl);
      loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (userRole !== "admin") {
      // Not an admin - redirect to home or show error
      return NextResponse.redirect(new URL("/", nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};
