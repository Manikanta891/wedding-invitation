import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";

export async function GET() {
  let dbStatus = "disconnected";
  try {
    await connectDB();
    if (mongoose.connection.readyState === 1) {
      dbStatus = "connected";
    }
  } catch {
    dbStatus = "unavailable";
  }

  return NextResponse.json(
    {
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: "0.1.0",
      deployment: {
        architecture: "single-instance-node",
        readyForLoadBalancing: true,
      },
      services: {
        database: dbStatus,
        storage: process.env.GOOGLE_DRIVE_CLIENT_EMAIL ? "google-drive-configured" : "storage-abstraction-ready",
      },
    },
    { status: 200 }
  );
}
