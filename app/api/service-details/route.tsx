import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import dbConnect from "@/lib/dbConnect";
import ServiceDetail from "@/models/ServiceDetail";

// POST "/api/service-details" - for defult data
export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const { serviceId } = body;

    // Validate serviceId
    if (!serviceId || !Types.ObjectId.isValid(serviceId)) {
      return NextResponse.json(
        { success: false, message: "A valid serviceId is required." },
        { status: 400 }
      );
    }

    // Check if a detail record already exists for the same service
    const existing = await ServiceDetail.findOne({ serviceId });
    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message: "Service detail already exists for this serviceId.",
        },
        { status: 400 }
      );
    }

    // Create a default ServiceDetail document
    const newServiceDetail = new ServiceDetail({
      serviceId,
      title: "Untitled Service",
      description: "No description available for this service at the moment.",
      coverImage: null,
      packages: [],
      gallery: [],
      videoSamples: [],
    });

    // Save to database
    const savedServiceDetail = await newServiceDetail.save();

    return NextResponse.json(
      {
        success: true,
        message: "Service detail created successfully with default values.",
        data: savedServiceDetail,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating service detail:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
