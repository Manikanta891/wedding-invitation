import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/app/models/Order";
import { getAuthUser } from "@/lib/auth";
import { notifyOrderStatusUpdated } from "@/lib/notifications/email";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ ref: string }> }
) {
  try {
    const { ref } = await params;
    const { searchParams } = new URL(request.url);
    const verify = searchParams.get("verify")?.trim().toLowerCase();

    await connectDB();
    const order = await Order.findOne({ orderRef: ref }).lean();

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Check if requester is Admin
    const user = getAuthUser(request);
    if (user) {
      return NextResponse.json(order);
    }

    // Customer Tracking Verification: must supply matching email or phone
    if (!verify) {
      return NextResponse.json(
        { error: "Verification required. Please provide email or mobile number." },
        { status: 401 }
      );
    }

    const matchesEmail = order.customer.email.toLowerCase() === verify;
    const matchesPhone = order.customer.phone.replace(/[^0-9]/g, "").includes(verify.replace(/[^0-9]/g, ""));

    if (!matchesEmail && !matchesPhone) {
      return NextResponse.json(
        { error: "Order reference and contact verification do not match." },
        { status: 403 }
      );
    }

    // Return safe customer view without private internal notes
    const customerSafeOrder = {
      orderRef: order.orderRef,
      occasion: order.occasion,
      templateName: order.templateName,
      status: order.status,
      customerName: order.customer.name,
      eventDetails: order.eventDetails,
      invitationUrl: order.invitationUrl,
      createdAt: order.createdAt,
      statusHistory: order.statusHistory.map((h: { status: string; timestamp: Date; note?: string }) => ({
        status: h.status,
        timestamp: h.timestamp,
        note: h.note,
      })),
    };

    return NextResponse.json(customerSafeOrder);
  } catch (error) {
    console.error("Failed to retrieve order:", error);
    return NextResponse.json({ error: "Failed to retrieve order" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ ref: string }> }
) {
  const user = getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { ref } = await params;
    const body = await request.json();
    const { status, internalNotes, invitationUrl, note } = body;

    await connectDB();
    const order = await Order.findOne({ orderRef: ref });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const previousStatus = order.status;

    if (status && status !== previousStatus) {
      const allowedStatuses = [
        "NEW",
        "CONTACTED",
        "DETAILS_RECEIVED",
        "IN_PROGRESS",
        "COMPLETED",
        "CANCELLED",
      ];

      if (!allowedStatuses.includes(status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
      }

      order.status = status;
      order.statusHistory.push({
        status,
        timestamp: new Date(),
        note: note || `Status updated from ${previousStatus} to ${status}.`,
        updatedBy: user.username,
      });

      // Dispatch customer notification
      notifyOrderStatusUpdated(
        order.customer.email,
        order.customer.name,
        order.orderRef,
        status,
        invitationUrl || order.invitationUrl
      ).catch((err) => console.warn("Failed to dispatch status email:", err));
    }

    if (internalNotes !== undefined) {
      order.internalNotes = internalNotes;
    }

    if (invitationUrl !== undefined) {
      order.invitationUrl = invitationUrl;
    }

    await order.save();

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("Failed to update order:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
