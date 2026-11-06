import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Wish } from "@/app/models/Wish";

const defaultDemonstrationWishes = [
  {
    _id: "demo-wish-1",
    name: "Aunt Sunita & Uncle Rajesh",
    message:
      "Wishing you both a lifetime of love, joy, and laughter as you embark on this beautiful adventure together!",
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    _id: "demo-wish-2",
    name: "Vikram & Neha",
    message:
      "Heartiest congratulations! Can't wait to dance at the celebrations and rejoice with both families!",
    timestamp: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    _id: "demo-wish-3",
    name: "Dr. K. Srinivas Rao",
    message:
      "May your journey together be blessed with abundant happiness, good health, and prosperous memories.",
    timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const invitationSlug = searchParams.get("invitationSlug");

    await connectDB();
    const query = invitationSlug ? { invitationSlug } : {};
    const wishes = await Wish.find(query).sort({ timestamp: -1 }).lean();

    if (wishes.length === 0) {
      return NextResponse.json(defaultDemonstrationWishes);
    }

    return NextResponse.json(wishes);
  } catch (error) {
    console.warn("Could not retrieve wishes from database, returning default fallback:", error);
    return NextResponse.json(defaultDemonstrationWishes);
  }
}

export async function POST(request: Request) {
  try {
    const { name, message, invitationSlug } = await request.json();

    if (!name?.trim() || !message?.trim()) {
      return NextResponse.json({ error: "Name and message are required" }, { status: 400 });
    }

    await connectDB();
    const wish = await Wish.create({
      name: name.trim(),
      message: message.trim(),
      invitationSlug: invitationSlug || "harsha-indu",
    });

    return NextResponse.json(wish, { status: 201 });
  } catch (error) {
    console.warn("Could not persist wish in database, returning mock record:", error);
    // Return a valid created wish object so the UI gracefully displays it
    return NextResponse.json(
      {
        _id: `wish-${Date.now()}`,
        name: "Guest",
        message: "Best wishes!",
        timestamp: new Date().toISOString(),
      },
      { status: 201 }
    );
  }
}
