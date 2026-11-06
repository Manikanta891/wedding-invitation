import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Template } from "@/app/models/Template";
import { defaultTemplates, ensureSeedData } from "@/lib/seed";
import { getAuthUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const sort = searchParams.get("sort") || "featured";
  const all = searchParams.get("all") === "true";

  try {
    await connectDB();
    await ensureSeedData();

    const query: Record<string, unknown> = {};
    if (!all) {
      query.isPublished = true;
    }
    if (category && category !== "all") {
      query.category = category;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tagline: { $regex: search, $options: "i" } },
      ];
    }

    let sortOption: Record<string, 1 | -1> = { sortOrder: 1, createdAt: -1 };
    if (sort === "price-asc") sortOption = { price: 1 };
    if (sort === "price-desc") sortOption = { price: -1 };
    if (sort === "newest") sortOption = { createdAt: -1 };

    const templates = await Template.find(query).sort(sortOption).lean();

    if (templates.length === 0 && (!category || category === "all") && !search) {
      return NextResponse.json(defaultTemplates);
    }

    return NextResponse.json(templates);
  } catch (error) {
    console.error("Error fetching templates, using memory fallback:", error);
    let filtered = [...defaultTemplates];
    if (category && category !== "all") {
      filtered = filtered.filter((t) => t.category === category);
    }
    if (search) {
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(search.toLowerCase()) ||
          t.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    return NextResponse.json(filtered);
  }
}

export async function POST(request: NextRequest) {
  const user = getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, slug, description, category, price, thumbnail, features } = body;

    if (!title || !slug || !description || !category) {
      return NextResponse.json(
        { error: "Title, slug, description and category are required" },
        { status: 400 }
      );
    }

    await connectDB();
    const existing = await Template.findOne({ slug });
    if (existing) {
      return NextResponse.json(
        { error: "A template with this slug already exists" },
        { status: 409 }
      );
    }

    const newTemplate = await Template.create({
      title,
      slug,
      description,
      tagline: body.tagline || "",
      category,
      price: typeof price === "number" ? price : 1499,
      currency: "₹",
      thumbnail: thumbnail || "/photos/L-1.jpeg",
      previewImages: body.previewImages || [thumbnail || "/photos/L-1.jpeg"],
      features: features || [],
      demoSlug: body.demoSlug || "harsha-indu",
      isPublished: body.isPublished !== undefined ? body.isPublished : true,
      isFeatured: body.isFeatured || false,
      sortOrder: body.sortOrder || 10,
    });

    return NextResponse.json(newTemplate, { status: 201 });
  } catch (error) {
    console.error("Failed to create template:", error);
    return NextResponse.json({ error: "Failed to create template" }, { status: 500 });
  }
}
