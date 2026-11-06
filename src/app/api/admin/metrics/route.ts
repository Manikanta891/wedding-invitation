import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/app/models/Order";
import { Template } from "@/app/models/Template";
import { Invitation } from "@/app/models/Invitation";
import { Wish } from "@/app/models/Wish";
import { RSVP } from "@/app/models/RSVP";
import { Enquiry } from "@/app/models/Enquiry";
import { getStorageMetrics } from "@/lib/storage";
import { getAuthUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const user = getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();

    const [
      orders,
      templatesCount,
      publishedTemplatesCount,
      invitationsCount,
      wishesCount,
      rsvps,
      enquiriesCount,
      storageStats,
    ] = await Promise.all([
      Order.find().sort({ createdAt: -1 }).lean(),
      Template.countDocuments(),
      Template.countDocuments({ isPublished: true }),
      Invitation.countDocuments({ status: "published" }),
      Wish.countDocuments(),
      RSVP.find().lean(),
      Enquiry.countDocuments({ status: "new" }),
      getStorageMetrics(),
    ]);

    const totalOrders = orders.length;
    const newOrders = orders.filter((o) => o.status === "NEW").length;
    const inProgressOrders = orders.filter((o) =>
      ["CONTACTED", "DETAILS_RECEIVED", "IN_PROGRESS"].includes(o.status)
    ).length;
    const completedOrders = orders.filter((o) => o.status === "COMPLETED").length;
    const cancelledOrders = orders.filter((o) => o.status === "CANCELLED").length;

    // Unique customers derived from orders
    const uniqueEmails = new Set(orders.map((o) => o.customer?.email?.toLowerCase())).size;

    const totalAttendingGuests = rsvps
      .filter((r) => r.attending === "yes")
      .reduce((sum, r) => sum + (r.guestCount || 1), 0);

    return NextResponse.json({
      orders: {
        total: totalOrders,
        new: newOrders,
        inProgress: inProgressOrders,
        completed: completedOrders,
        cancelled: cancelledOrders,
        recent: orders.slice(0, 6),
      },
      customers: {
        total: uniqueEmails,
      },
      templates: {
        total: templatesCount,
        published: publishedTemplatesCount,
      },
      invitations: {
        active: invitationsCount,
      },
      wishes: {
        total: wishesCount,
      },
      rsvps: {
        totalResponses: rsvps.length,
        attendingGuests: totalAttendingGuests,
      },
      enquiries: {
        pending: enquiriesCount,
      },
      storage: storageStats,
    });
  } catch (error) {
    console.error("Failed to generate admin metrics:", error);
    return NextResponse.json({ error: "Failed to generate metrics" }, { status: 500 });
  }
}
