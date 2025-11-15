import { NextRequest, NextResponse } from "next/server";

import Service from "@/models/Service";
import dbConnect from "@/lib/dbConnect";
import { requireAdmin } from "@/lib/apiAuth";

// POST /api/service → Save new service
// @adminOnly
export async function POST(req: NextRequest) {
  try {
    const { authorized, response } = await requireAdmin(req);
    if (!authorized) return response;
    await dbConnect();
    const body = await req.json();
    const { slug, title, description, imageUrl, imageFileId } = body;

    // Validate required fields
    if (!slug || !title || !description || !imageUrl || !imageFileId) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const exists = await Service.findOne({ slug });
    if (exists) {
      return NextResponse.json(
        { success: false, message: "Service with this slug already exists" },
        { status: 409 }
      );
    }

    const newService = await Service.create({
      slug,
      title,
      description,
      imageUrl,
      imageFileId,
    });

    return NextResponse.json(
      { success: true, data: newService },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error saving service:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

// GET /api/service → Fetch all services
// @public
export async function GET() {
  try {
    await dbConnect();
    const services = await Service.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: services });
  } catch (err) {
    console.error("Error fetching services:", err);
    return NextResponse.json(
      { success: false, message: "Failed to fetch services" },
      { status: 500 }
    );
  }
}
