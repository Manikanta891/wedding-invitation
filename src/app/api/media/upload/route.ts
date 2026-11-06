import { NextRequest, NextResponse } from "next/server";
import { uploadMedia } from "@/lib/storage";

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/quicktime",
  "audio/mpeg",
  "audio/mp3",
];

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const orderRef = (formData.get("orderRef") as string) || undefined;
    const category = (formData.get("category") as "Originals" | "Optimized" | "Videos" | "Templates") || "Originals";

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Unsupported file format: ${file.type}. Please upload JPG, PNG, WebP, MP4, or MP3.` },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File exceeds maximum size limit of 25MB" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const mediaRecord = await uploadMedia({
      buffer,
      filename: file.name,
      mimeType: file.type,
      orderRef,
      folderCategory: category,
    });

    return NextResponse.json(
      {
        success: true,
        file: mediaRecord,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Media upload failed:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
