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
  try {
    await dbConnect();

    const total = await Visit.countDocuments();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayVisitors = await Visit.countDocuments({
      createdAt: { $gte: today },
    });

    return NextResponse.json({
      success: true,
      total,
      today: todayVisitors,
    });
  } catch (err) {
    console.error("Visitor GET error", err);
    return NextResponse.json(
      { success: false, message: "Failed to fetch visitor count" },
      { status: 500 }
    );
  }
}
