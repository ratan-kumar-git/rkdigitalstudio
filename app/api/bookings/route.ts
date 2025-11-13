import dbConnect from "@/lib/dbConnect";
import Booking from "@/models/Booking";
import ServiceDetail from "@/models/ServiceDetail";
import { NextResponse } from "next/server";

// POST -> /api/bookings/route.ts 
// user -> create booking
export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    console.log(body);
    
    const {
      userId,
      serviceDetailId,
      packageId,
      fullName,
      email,
      phone,
      address,
      bookingDate,
    } = body;

    // Validate service & package
    const service = await ServiceDetail.findById(serviceDetailId);
    if (!service)
      return NextResponse.json({ error: "Service not found" }, { status: 404 });

    const pkg = service.packages.id(packageId);
    if (!pkg)
      return NextResponse.json({ error: "Package not found" }, { status: 404 });

    // Create booking
    const booking = await Booking.create({
      userId,
      serviceDetailId,
      packageId,
      fullName,
      email,
      phone,
      address,
      bookingDate,
      serviceTitle: service.title,
      packageName: pkg.name,
      packagePrice: pkg.price,
      packageFeatures: pkg.features,
    });

    return NextResponse.json({
      success: true,
      message: "Booking created successfully",
      data: booking,
    });
  } catch (error) {
    console.error("Booking creation failed:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// GET -> /api/bookings/route.ts
// user -> get all booking
export async function GET() {
  try {
    await dbConnect();

    const bookings = await Booking.find({})
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      { success: true, data: bookings },
      { status: 200 }
    );
  } catch (error) {
    console.error("ADMIN BOOKINGS FETCH ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch all bookings" },
      { status: 500 }
    );
  }
}
