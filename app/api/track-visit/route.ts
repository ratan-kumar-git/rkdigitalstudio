import { NextResponse } from "next/server";
import Visit from "@/models/Visit";
import dbConnect from "@/lib/dbConnect";

export async function POST() {
  try {
    await dbConnect();
    await Visit.create({});
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, message: "Error tracking visit" },
      { status: 500 }
    );
  }
}

export async function GET() {
  await dbConnect();

  const total = await Visit.countDocuments();

  return NextResponse.json({ total });
}

