import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Invitation } from "@/app/models/Invitation";
import { getAuthUser } from "@/lib/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    await connectDB();

    const invitation = await Invitation.findOne({ slug });

    if (!invitation) {
      return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
    }

    // Check expiry
    if (invitation.expiresAt && new Date() > new Date(invitation.expiresAt)) {
      return NextResponse.json(
        {
          error: "This invitation has expired.",
          status: "expired",
          title: invitation.title,
        },
        { status: 410 }
      );
    }

    // Increment view count asynchronously
    Invitation.updateOne({ _id: invitation._id }, { $inc: { viewsCount: 1 } }).exec();

    return NextResponse.json(invitation);
  } catch (error) {
    console.error("Failed to load invitation:", error);
    return NextResponse.json({ error: "Failed to load invitation" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const user = getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { slug } = await params;
    const body = await request.json();
    await connectDB();

    const updated = await Invitation.findOneAndUpdate(
      { slug },
      { $set: body },
      { new: true, upsert: true }
    );

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update invitation:", error);
    return NextResponse.json({ error: "Failed to update invitation" }, { status: 500 });
  }
}
