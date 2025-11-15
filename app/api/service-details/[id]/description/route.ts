import { requireAdmin } from "@/lib/apiAuth";
import dbConnect from "@/lib/dbConnect";
import ServiceDetail from "@/models/ServiceDetail";
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

// POUT "/api/service-details/[id]/description" - update description 
// @AdminOnly
export async function PUT(
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
    const { title, description, coverImage } = body;

    if (!title || !description) {
      return NextResponse.json(
        { success: false, message: "Title and description are required." },
        { status: 400 }
      );
    }

    const updated = await ServiceDetail.findOneAndUpdate(
      { serviceId: id },
      {
        $set: {
          title,
          description,
          coverImage: coverImage || null,
          updatedAt: new Date(),
        },
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
        message: "Service detail updated successfully.",
        data: updated,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating service detail:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
