import { requireAdmin } from "@/lib/apiAuth";
import dbConnect from "@/lib/dbConnect";
import ServiceDetail from "@/models/ServiceDetail";
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

// POST "/api/service-details/[id]/image" - update image url in db
// @AdminOnly
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { authorized, response } = await requireAdmin(req);
    if (!authorized) return response;

    await dbConnect();
    const { id } = await context.params;

    if (!id || !Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid or missing service detail ID." },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { imageUrl, imageFileId, thumbnailUrl } = body;
    

    if (!imageUrl || !imageFileId) {
      return NextResponse.json(
        {
          success: false,
          message: "Both imageUrl and imageFileId are required.",
        },
        { status: 400 }
      );
    }

    const updated = await ServiceDetail.findOneAndUpdate(
      { serviceId: id },
      {
        $push: {
          gallery: {
            imageUrl,
            imageFileId,
            thumbnailUrl: thumbnailUrl || "",
          },
        },
        $set: { updatedAt: new Date() },
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Service detail not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Image added to gallery successfully.",
        data: updated,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding gallery image:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE "/api/service-details/[id]/image" - delete image url in db
// @AdminOnly
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { authorized, response } = await requireAdmin(req);
    if (!authorized) return response;

    await dbConnect();
    const { id } = await context.params;

    if (!id || !Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid or missing service detail ID." },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { imageFileId } = body;

    if (!imageFileId) {
      return NextResponse.json(
        { success: false, message: "imageFileId is required to delete image." },
        { status: 400 }
      );
    }

    // Step 1: Remove image from gallery in MongoDB
    const updated = await ServiceDetail.findOneAndUpdate(
      { serviceId: id },
      {
        $pull: { gallery: { imageFileId } },
        $set: { updatedAt: new Date() },
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Service detail not found." },
        { status: 404 }
      );
    }

    // Step 2: Respond success
    return NextResponse.json(
      {
        success: true,
        message: "Image removed from gallery in MongoDB",
        data: updated,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error removing gallery image:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
