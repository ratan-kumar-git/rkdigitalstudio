import { requireAdmin } from "@/lib/apiAuth";
import dbConnect from "@/lib/dbConnect";
import ServiceDetail from "@/models/ServiceDetail";
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

// POST "/api/service-details/[id]/package" - add package
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
    const { name, price, features, highlight } = await req.json();

    if (!id || !Types.ObjectId.isValid(id))
      return NextResponse.json(
        { success: false, message: "Invalid ID" },
        { status: 400 }
      );

    if (!name || !price || !Array.isArray(features))
      return NextResponse.json(
        { success: false, message: "Invalid package data" },
        { status: 400 }
      );

    const updated = await ServiceDetail.findOneAndUpdate(
      { serviceId: id },
      {
        $push: { packages: { name, price, features, highlight: !!highlight } },
        $set: { updatedAt: new Date() },
      },
      { new: true }
    );

    if (!updated)
      return NextResponse.json(
        { success: false, message: "Service not found" },
        { status: 404 }
      );

    return NextResponse.json(
      { success: true, data: updated.packages },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding package:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST "/api/service-details/[id]/package" - update package
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
    const { index, name, price, features, highlight } = await req.json();

    if (!id || !Types.ObjectId.isValid(id))
      return NextResponse.json(
        { success: false, message: "Invalid ID" },
        { status: 400 }
      );

    const serviceDetail = await ServiceDetail.findOne({ serviceId: id });
    if (!serviceDetail)
      return NextResponse.json(
        { success: false, message: "Service not found" },
        { status: 404 }
      );

    if (index < 0 || index >= serviceDetail.packages.length)
      return NextResponse.json(
        { success: false, message: "Invalid package index" },
        { status: 400 }
      );

    serviceDetail.packages[index] = { name, price, features, highlight };
    serviceDetail.updatedAt = new Date();
    await serviceDetail.save();

    return NextResponse.json(
      { success: true, data: serviceDetail.packages },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating package:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Delete "/api/service-details/[id]/package" - delete package
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
    const { index } = await req.json();

    if (!id || !Types.ObjectId.isValid(id))
      return NextResponse.json(
        { success: false, message: "Invalid ID" },
        { status: 400 }
      );

    const serviceDetail = await ServiceDetail.findOne({ serviceId: id });
    if (!serviceDetail)
      return NextResponse.json(
        { success: false, message: "Service not found" },
        { status: 404 }
      );

    if (index < 0 || index >= serviceDetail.packages.length)
      return NextResponse.json(
        { success: false, message: "Invalid index" },
        { status: 400 }
      );

    serviceDetail.packages.splice(index, 1);
    serviceDetail.updatedAt = new Date();
    await serviceDetail.save();

    return NextResponse.json(
      { success: true, data: serviceDetail.packages },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting package:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
