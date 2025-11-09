import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export default async function middleware(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  const user = session?.user;
  const pathname = req.nextUrl.pathname.replace(/\/$/, ""); // normalize

  const publicRoutes = ["/signin", "/signup"];
  const privateRoutes = ["/dashboard", "/admin/dashboard", "/admin/add-service"];

  const isAdmin = user?.email === "admin@gmail.com";
  const isPrivateRoute = privateRoutes.some(route => pathname.startsWith(route));

  // 🔒 Block unauthenticated access to private routes
  if (!user && isPrivateRoute) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  // 🚫 Prevent logged-in users from visiting signin/signup
  if (user && publicRoutes.includes(pathname)) {
    return NextResponse.redirect(
      new URL(isAdmin ? "/admin/dashboard" : "/dashboard", req.url)
    );
  }

  // 🔐 Restrict /admin routes to admin only
  if (pathname.startsWith("/admin") && !isAdmin) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
}

// Middleware should not run on these
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
