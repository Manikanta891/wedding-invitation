import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Enquiry } from "@/app/models/Enquiry";
import { getAuthUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, occasion, message } = body;

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    await connectDB();
    const enquiry = await Enquiry.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || "",
      occasion: occasion || "General Inquiry",
      message: message.trim(),
      status: "new",
    });

    return NextResponse.json(
      { success: true, message: "Thank you! Your enquiry has been received.", enquiry },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to submit enquiry:", error);
    return NextResponse.json({ error: "Failed to submit enquiry" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const user = getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const enquiries = await Enquiry.find().sort({ timestamp: -1 }).lean();
    return NextResponse.json(enquiries);
  } catch (error) {
    console.error("Failed to retrieve enquiries:", error);
    return NextResponse.json({ error: "Failed to retrieve enquiries" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const user = getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, status, internalNotes } = await request.json();
    await connectDB();

    const updated = await Enquiry.findByIdAndUpdate(
      id,
      { $set: { status, internalNotes } },
      { new: true }
    );

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update enquiry:", error);
    return NextResponse.json({ error: "Failed to update enquiry" }, { status: 500 });
  }
}
