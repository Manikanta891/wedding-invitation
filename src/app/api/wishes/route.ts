import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Wish } from "@/app/models/Wish";

export async function GET() {
  try {
    await connectDB();
    const wishes = await Wish.find().sort({ timestamp: -1 }).lean();
    return NextResponse.json(wishes);
  } catch {
    return NextResponse.json({ error: "Failed to fetch wishes" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, message } = await request.json();

    if (!name?.trim() || !message?.trim()) {
      return NextResponse.json({ error: "Name and message are required" }, { status: 400 });
    }

    await connectDB();
    const wish = await Wish.create({ name: name.trim(), message: message.trim() });

    return NextResponse.json(wish, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create wish" }, { status: 500 });
  }
}
