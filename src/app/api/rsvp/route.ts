import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { RSVP } from "@/app/models/RSVP";
import { getAuthUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { invitationSlug, name, attending, guestCount, email, phone, message } = body;

    if (!name?.trim() || !attending || !invitationSlug) {
      return NextResponse.json(
        { error: "Name, attendance confirmation, and invitation reference are required" },
        { status: 400 }
      );
    }

    await connectDB();
    const rsvp = await RSVP.create({
      invitationSlug,
      name: name.trim(),
      attending: attending === "yes" ? "yes" : "no",
      guestCount: typeof guestCount === "number" ? Math.max(1, guestCount) : 1,
      email: email?.trim(),
      phone: phone?.trim(),
      message: message?.trim(),
    });

    return NextResponse.json(
      { success: true, message: "Thank you for confirming your attendance!", rsvp },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to submit RSVP:", error);
    return NextResponse.json({ error: "Failed to submit RSVP" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const user = getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const invitationSlug = searchParams.get("invitationSlug");

    await connectDB();
    const query = invitationSlug ? { invitationSlug } : {};
    const rsvps = await RSVP.find(query).sort({ timestamp: -1 }).lean();

    const attendingCount = rsvps
      .filter((r) => r.attending === "yes")
      .reduce((sum, r) => sum + (r.guestCount || 1), 0);
    const declinedCount = rsvps.filter((r) => r.attending === "no").length;

    return NextResponse.json({
      rsvps,
      metrics: {
        totalResponses: rsvps.length,
        attendingCount,
        declinedCount,
      },
    });
  } catch (error) {
    console.error("Failed to retrieve RSVPs:", error);
    return NextResponse.json({ error: "Failed to retrieve RSVPs" }, { status: 500 });
  }
}
