import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export default async function middleware(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  const user = session?.user;
  
  const { pathname } = req.nextUrl;

  const publicRoutes = [ "/signin", "/signup"];
  const privateRoutes = ["/dashboard", "/admin/dashboard", "/admin/add-service"];

  // 🔓 If not logged in, block access to private routes

  if (!user && privateRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  // 🚫 If logged in, block access to signin/signup
  if (user && publicRoutes.includes(pathname)) {
    // Admin → send to admin dashboard
    if (user.email === "admin@gmail.com") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    } else {
    // Normal user → send to user dashboard
    return NextResponse.redirect(new URL("/dashboard", req.url)); 
    }
  }

  // 🔒 Protect all /admin routes — only admin allowed
  if (pathname.startsWith("/admin") && user?.email !== "admin@gmail.com") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
}

// Routes Proxy should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
