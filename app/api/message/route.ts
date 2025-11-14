import dbConnect from "@/lib/dbConnect";
import { Message } from "@/models/Message";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { name, email, phoneNo, message } = await request.json();

    if (!name || !email || !phoneNo || !message) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    const newMessage = await Message.create({
      name,
      email,
      phoneNo,
      message,
    });

    return NextResponse.json(
      { success: true, data: newMessage },
      { status: 201 }
    );
  } catch (error) {
    console.error("Message POST error:", error);
    return NextResponse.json(
      { success: false, message: "Server error while sending message" },
      { status: 500 }
    );
  }
}


export async function GET() {
  try {
    await dbConnect();

    const messages = await Message.find().sort({ createdAt: -1 });

    return NextResponse.json(
      { success: true, data: messages },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
