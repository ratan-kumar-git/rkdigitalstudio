import dbConnect from "@/lib/dbConnect";
import ServiceDetail from "@/models/ServiceDetail";
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

/* -------------------------------------------------------------------------- */
/* 🟢 ADD VIDEO                                                               */
/* -------------------------------------------------------------------------- */
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await context.params;
    const { videoUrl } = await req.json();

    if (!id || !Types.ObjectId.isValid(id))
      return NextResponse.json(
        { success: false, message: "Invalid service ID" },
        { status: 400 }
      );

    if (!videoUrl)
      return NextResponse.json(
        { success: false, message: "Video URL is required" },
        { status: 400 }
      );

    const updated = await ServiceDetail.findOneAndUpdate(
      { serviceId: id },
      { $push: { videoSamples: videoUrl }, $set: { updatedAt: new Date() } },
      { new: true }
    );

    if (!updated)
      return NextResponse.json(
        { success: false, message: "Service detail not found" },
        { status: 404 }
      );

    return NextResponse.json(
      { success: true, message: "Video added successfully", data: updated },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error adding video:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

/* -------------------------------------------------------------------------- */
/* 🔴 DELETE VIDEO                                                            */
/* -------------------------------------------------------------------------- */
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await context.params;
    const { videoUrl } = await req.json();

    if (!id || !Types.ObjectId.isValid(id))
      return NextResponse.json(
        { success: false, message: "Invalid service ID" },
        { status: 400 }
      );

    if (!videoUrl)
      return NextResponse.json(
        { success: false, message: "Video URL required" },
        { status: 400 }
      );

    const updated = await ServiceDetail.findOneAndUpdate(
      { serviceId: id },
      { $pull: { videoSamples: videoUrl }, $set: { updatedAt: new Date() } },
      { new: true }
    );

    if (!updated)
      return NextResponse.json(
        { success: false, message: "Service detail not found" },
        { status: 404 }
      );

    return NextResponse.json(
      { success: true, message: "Video deleted successfully", data: updated },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error deleting video:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
