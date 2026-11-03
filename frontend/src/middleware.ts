import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const raw = request.cookies.get("man2_admin_token")?.value;
  const token = raw ? decodeURIComponent(raw) : undefined;

  const isLogin = pathname === "/admin/login";

  if (isLogin && token) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  if (!isLogin && !token) {
    const hasHeader =
      request.headers.get("authorization")?.startsWith("Bearer ");
    if (!hasHeader) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

/** Hanya jalankan middleware di route admin — homepage tidak ikut compile */
export const config = {
  matcher: ["/admin/:path*"],
};
