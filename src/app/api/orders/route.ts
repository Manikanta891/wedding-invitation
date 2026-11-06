import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/app/models/Order";
import { Template } from "@/app/models/Template";
import { notifyOrderCreated } from "@/lib/notifications/email";
import { getAuthUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customer, occasion, templateId, eventDetails, referenceFiles } = body;

    if (!customer?.name?.trim() || !customer?.email?.trim() || !customer?.phone?.trim()) {
      return NextResponse.json(
        { error: "Customer name, email, and phone number are required" },
        { status: 400 }
      );
    }

    if (!eventDetails?.eventDate || !eventDetails?.venueName || !eventDetails?.venueAddress) {
      return NextResponse.json(
        { error: "Event date, venue name, and address are required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Verify template and retrieve secure pricing from DB (never trust frontend price)
    let templateName = "Custom Celebration";
    let officialPrice = 1499;

    if (templateId) {
      const template = await Template.findOne({
        $or: [{ slug: templateId }, { _id: templateId }],
      }).lean();

      if (template) {
        templateName = template.title;
        officialPrice = template.price;
      }
    }

    // Generate unique, unpredictable order reference (e.g. INV-2026-X9K2)
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const orderRef = `INV-2026-${randomSuffix}`;

    const newOrder = await Order.create({
      orderRef,
      customer: {
        name: customer.name.trim(),
        email: customer.email.trim().toLowerCase(),
        phone: customer.phone.trim(),
      },
      occasion: occasion || "Wedding",
      templateId: templateId || "royal-palace",
      templateName,
      price: officialPrice,
      eventDetails: {
        eventDate: eventDetails.eventDate,
        eventTime: eventDetails.eventTime || "7:00 PM",
        venueName: eventDetails.venueName.trim(),
        venueAddress: eventDetails.venueAddress.trim(),
        additionalNotes: eventDetails.additionalNotes || "",
      },
      referenceFiles: referenceFiles || [],
      status: "NEW",
      statusHistory: [
        {
          status: "NEW",
          timestamp: new Date(),
          note: "Order submitted by customer.",
          updatedBy: "Customer Web Order",
        },
      ],
      internalNotes: "",
      invitationUrl: "",
    });

    // Asynchronously notify customer
    notifyOrderCreated(newOrder).catch((err) =>
      console.warn("Could not dispatch confirmation email:", err)
    );

    return NextResponse.json(
      {
        success: true,
        orderRef: newOrder.orderRef,
        message: "Order placed successfully",
        order: newOrder,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Order submission error:", error);
    return NextResponse.json({ error: "Failed to submit order" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const user = getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    await connectDB();

    const query: Record<string, unknown> = {};
    if (status && status !== "ALL") {
      query.status = status;
    }
    if (search) {
      query.$or = [
        { orderRef: { $regex: search, $options: "i" } },
        { "customer.name": { $regex: search, $options: "i" } },
        { "customer.email": { $regex: search, $options: "i" } },
        { "customer.phone": { $regex: search, $options: "i" } },
      ];
    }

    const orders = await Order.find(query).sort({ createdAt: -1 }).lean();
    return NextResponse.json(orders);
  } catch (error) {
    console.error("Failed to retrieve orders:", error);
    return NextResponse.json({ error: "Failed to retrieve orders" }, { status: 500 });
  }
}
