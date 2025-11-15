import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Booking from "@/models/Booking";
import Service from "@/models/Service";
import { Message } from "@/models/Message";
import { requireAdmin } from "@/lib/apiAuth";

// GET "/api/dashboard"
// @AdminOnly
export async function GET(req: NextRequest) {
  try {
    const { authorized, response } = await requireAdmin(req);
    if (!authorized) return response;

    await dbConnect();

    const [services, bookings, messages] = await Promise.all([
      Service.find(),
      Booking.find(),
      Message.find(),
    ]);

    // Totals
    const totalServices = services.length;
    const totalBookings = bookings.length;

    const pending = bookings.filter((b) => b.status === "pending").length;
    const confirmed = bookings.filter((b) => b.status === "confirmed").length;
    const completed = bookings.filter((b) => b.status === "completed").length;
    const cancelled = bookings.filter((b) => b.status === "cancelled").length;

    // Price of only confirmed or completed bookings
    const totalPrice = bookings
      .filter((b) => b.status === "confirmed" || b.status === "completed")
      .reduce((sum, b) => sum + Number(b.packagePrice || 0), 0);

    // All payments made by users
    const amountPaid = bookings.reduce(
      (sum, b) => sum + Number(b.amountPaid || 0),
      0
    );

    // Total dues
    const dues = totalPrice - amountPaid;

    const totalMessages = messages.length;

    return NextResponse.json(
      {
        success: true,
        data: {
          totalServices,
          totalBookings,
          pending,
          confirmed,
          completed,
          cancelled,
          totalEarnings: totalPrice,
          amountPaid,
          dues,
          totalMessages,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
