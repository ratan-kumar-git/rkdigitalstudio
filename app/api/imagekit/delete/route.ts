import { requireAdmin } from "@/lib/apiAuth";
import { NextRequest, NextResponse } from "next/server";

// @adminOnly
export async function POST(req: NextRequest) {
  try {
    const { authorized, response } = await requireAdmin(req);
    if (!authorized) return response;

    const { fileId } = await req.json();
    if (!fileId) {
      return NextResponse.json({ success: false, message: "Missing fileId" }, { status: 400 });
    }

    const res = await fetch(
      `https://api.imagekit.io/v1/files/${fileId}`,
      {
        method: "DELETE",
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(process.env.IMAGEKIT_PRIVATE_KEY + ":").toString("base64"),
        },
      }
    );

    if (!res.ok) throw new Error("Failed to delete image from ImageKit");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ImageKit delete error:", error);
    return NextResponse.json(
      { success: false, message: "Error deleting image" },
      { status: 500 }
    );
  }
}
