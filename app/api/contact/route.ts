import dbConnect from "@/lib/dbConnect";
import { Message } from "@/models/Message";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        await dbConnect()
        const { name, email, message } = await request.json();

        const newMessage = await Message.create({ name, email, message });
        return NextResponse.json({ success: true, data: newMessage }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { success: false, message: "Error in constct route"},
            { status: 500 }
        );
    }
}