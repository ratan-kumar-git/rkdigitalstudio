import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function requireAdmin(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });

  if (!session || !session.user) {
    return {
      authorized: false,
      response: NextResponse.json(
        { success: false, message: "Unauthorized: Please login" },
        { status: 401 }
      ),
    };
  }

  if (session.user.email !== "admin@gmail.com") {
    return {
      authorized: false,
      response: NextResponse.json(
        { success: false, message: "Forbidden: Admins only" },
        { status: 403 }
      ),
    };
  }

  return { authorized: true, user: session.user };
}

export async function requireUser(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });

  if (!session || !session.user) {
    return {
      authorized: false,
      response: NextResponse.json(
        { success: false, message: "Unauthorized: Please login" },
        { status: 401 }
      ),
    };
  }

  return { authorized: true, user: session.user };
}
