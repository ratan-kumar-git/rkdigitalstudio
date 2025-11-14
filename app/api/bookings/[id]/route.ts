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
    await dbConnect();
    const { id } = await context.params;
    const { status } = await req.json();

    const allowed = ["pending", "confirmed", "completed", "cancelled"];
    if (!allowed.includes(status))
      return NextResponse.json(
        { success: false, message: "Invalid status" },
        { status: 400 }
      );

    const updated = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    return NextResponse.json(
      { success: true, data: updated },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

