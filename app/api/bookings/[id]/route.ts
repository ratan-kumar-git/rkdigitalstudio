import { requireAdmin, requireUser } from "@/lib/apiAuth";
import dbConnect from "@/lib/dbConnect";
import Booking from "@/models/Booking";
import { NextRequest, NextResponse } from "next/server";

// GET -> /api/bookings/[id -> userId]/route.ts
// user -> get booking by id
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { authorized, response } = await requireUser(req);
    if (!authorized) return response;

    const { id } = await context.params;
    await dbConnect();

    if (!id) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const bookings = await Booking.find({ userId: id }).sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        count: bookings.length,
        data: bookings,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching bookings by userId:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}


// PUT -> /api/bookings/[id]/route.ts
// Admin -> update status of booking by booking._id
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { authorized, response } = await requireAdmin(req);
    if (!authorized) return response;

    await dbConnect();
    const { id } = await context.params;

    const { status }: { status: string } = await req.json();

    const allowed = ["pending", "confirmed", "completed", "cancelled"];
    if (!allowed.includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid status" },
        { status: 400 }
      );
    }

    const updateFields =
      status === "pending" || status === "cancelled"
        ? { status, amountPaid: 0, paymentStatus: "pending" }
        : { status };

    const updated = await Booking.findByIdAndUpdate(id, updateFields, {
      new: true,
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Booking not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    console.error("Error in booking", err)
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}


