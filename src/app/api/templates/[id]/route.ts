import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Template } from "@/app/models/Template";
import { defaultTemplates } from "@/lib/seed";
import { getAuthUser } from "@/lib/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();

    const template =
      (await Template.findOne({ slug: id }).lean()) ||
      (await Template.findById(id).catch(() => null));

    if (template) {
      return NextResponse.json(template);
    }

    // Fallback from default list
    const foundFallback = defaultTemplates.find((t) => t.slug === id);
    if (foundFallback) {
      return NextResponse.json(foundFallback);
    }

    return NextResponse.json({ error: "Template not found" }, { status: 404 });
  } catch (error) {
    console.error("Error retrieving template:", error);
    const { id } = await params;
    const foundFallback = defaultTemplates.find((t) => t.slug === id);
    if (foundFallback) return NextResponse.json(foundFallback);
    return NextResponse.json({ error: "Failed to retrieve template" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    await connectDB();

    const updated = await Template.findOneAndUpdate(
      { $or: [{ slug: id }, { _id: id }] },
      { $set: body },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update template:", error);
    return NextResponse.json({ error: "Failed to update template" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    await connectDB();
    const deleted = await Template.findOneAndDelete({ $or: [{ slug: id }, { _id: id }] });
    if (!deleted) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Template deleted" });
  } catch (error) {
    console.error("Failed to delete template:", error);
    return NextResponse.json({ error: "Failed to delete template" }, { status: 500 });
  }
}
