import dbConnect from "@/lib/dbConnect";
import { Message } from "@/models/Message";
import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await context.params;

    if (!id || !Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid message ID" },
        { status: 400 }
      );
    }

    const deleted = await Message.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Message not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Message deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete message error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
