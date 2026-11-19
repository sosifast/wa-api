import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt, COOKIE_NAME } from "@/lib/session";

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const cookie = req.cookies.get(COOKIE_NAME)?.value;
  const session = await decrypt(cookie);

  // 1. Protect Admin Routes (/admin, /admin/*)
  if (pathname.startsWith("/admin")) {
    if (!session || session.status !== "Active") {
      const loginUrl = new URL("/auth/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (session.level !== "Admin") {
      // Member trying to access Admin area is redirected to member dashboard with notice
      const memberUrl = new URL("/member", req.url);
      memberUrl.searchParams.set("error", "unauthorized_admin_access");
      return NextResponse.redirect(memberUrl);
    }
  }

  // 2. Protect Member Routes (/member, /member/*)
  if (pathname.startsWith("/member")) {
    if (!session || session.status !== "Active") {
      const loginUrl = new URL("/auth/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Both Admin and Member can access /member, but status must be Active
    if (session.level !== "Member" && session.level !== "Admin") {
      const loginUrl = new URL("/auth/login", req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 3. Auth Routes (/auth/login, /auth/register)
  // If already logged in, redirect user to their respective dashboard
  if (
    pathname === "/auth/login" ||
    pathname === "/auth/register" ||
    pathname === "/auth"
  ) {
    if (session && session.status === "Active") {
      const target = session.level === "Admin" ? "/admin" : "/member";
      return NextResponse.redirect(new URL(target, req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/member/:path*",
    "/auth",
    "/auth/:path*",
  ],
};
