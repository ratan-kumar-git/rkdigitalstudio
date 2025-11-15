import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Service from "@/models/Service";
import { requireAdmin } from "@/lib/apiAuth";

// GET /api/service/:id
// @adminonly
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { authorized, response } = await requireAdmin(req);
    if (!authorized) return response;

    const { id } = await context.params;
    await dbConnect();
    const service = await Service.findById(id);
    if (!service) {
      return NextResponse.json(
        { success: false, message: "Service not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, service });
  } catch (error) {
    console.error("Get service error:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching service" },
      { status: 500 }
    );
  }
}

// PUT /api/service/:id
// @adminonly
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { authorized, response } = await requireAdmin(req);
    if (!authorized) return response;

    const { id } = await context.params;
    const body = await req.json();
    await dbConnect();
    const updated = await Service.findByIdAndUpdate(id, body, { new: true });
    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Service not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      message: "Service updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Update service error:", error);
    return NextResponse.json(
      { success: false, message: "Error updating service" },
      { status: 500 }
    );
  }
}

// DELETE /api/service/:id
// @AdminOnly
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { authorized, response } = await requireAdmin(req);
    if (!authorized) return response;

    const { id } = await context.params;
    await dbConnect();

    const deleted = await Service.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Service not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { success: false, message: "Error deleting service" },
      { status: 500 }
    );
  }
}
