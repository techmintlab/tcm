import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isAdminPath = pathname.startsWith("/admin");
  const isDashboardPath = pathname.startsWith("/dashboard");
  const isAuthPath =
    pathname.startsWith("/auth/login") || pathname.startsWith("/auth/register");
  const isApiPath = pathname.startsWith("/api");

  // Allow API routes and public paths
  if (isApiPath) return NextResponse.next();

  // Allow auth pages
  if (isAuthPath) return NextResponse.next();

  // Get the session token (edge-compatible)
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Protect dashboard routes
  if (isDashboardPath) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
  }

  // Protect admin routes
  if (isAdminPath) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
    if (token.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
