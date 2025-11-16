import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Booking from "@/models/Booking";
import { requireAdmin } from "@/lib/apiAuth";

// PUT -> /api/bookings/[id]/payment
// Admin -> update amoutpaid of booking by booking._id
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { authorized, response } = await requireAdmin(req);
    if (!authorized) return response;

    await dbConnect();

    const { id } = await context.params;
    const { amountPaid } = await req.json();

    if (!amountPaid || Number(amountPaid) <= 0) {
      return NextResponse.json(
        { message: "Invalid payment amount" },
        { status: 400 }
      );
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return NextResponse.json(
        { message: "Booking not found" },
        { status: 404 }
      );
    }

    if (booking.status === "pending" || booking.status === "cancelled") {
      return NextResponse.json(
        {
          message:
            "Payment cannot be added because the booking is pending or cancelled.",
        },
        { status: 400 }
      );
    }

    // Convert values
    const totalPrice = Number(booking.packagePrice);
    const oldPaid = Number(booking.amountPaid);
    const newPaid = oldPaid + Number(amountPaid);

    if (newPaid > totalPrice) {
      return NextResponse.json(
        {
          message: `Overpayment not allowed. Total price is ₹${totalPrice}, already paid ₹${oldPaid}.`,
        },
        { status: 400 }
      );
    }

    // Determine paymentStatus
    let paymentStatus: typeof booking.paymentStatus = "pending";

    if (newPaid === 0) {
      paymentStatus = "pending";
    } else if (newPaid > 0 && newPaid < totalPrice) {
      paymentStatus = "partial";
    } else if (newPaid === totalPrice) {
      paymentStatus = "paid";
    }

    // Update booking
    booking.amountPaid = newPaid;
    booking.paymentStatus = paymentStatus;

    await booking.save();

    return NextResponse.json(
      {
        success: true,
        message: "Payment updated successfully",
        data: booking,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Payment API error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server error",
      },
      { status: 500 }
    );
  }
}
