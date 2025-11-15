import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import dbConnect from "@/lib/dbConnect";
import ServiceDetail from "@/models/ServiceDetail";

// Fetch a specific service detail by ID (GET)
// @public
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await context.params;

    if (!id || !Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid or missing service detail ID." },
        { status: 400 }
      );
    }

    const serviceDetail = await ServiceDetail.findOne({ serviceId: id });
    if (!serviceDetail) {
      return NextResponse.json(
        { success: false, message: "Service detail not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: serviceDetail },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching service detail:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
