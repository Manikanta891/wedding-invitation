"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { getOrderInquiryWhatsAppUrl } from "@/lib/notifications/whatsapp";

interface OrderDetails {
  orderRef: string;
  occasion: string;
  templateName: string;
  status: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  eventDetails: {
    eventDate: string;
    eventTime: string;
    venueName: string;
    venueAddress: string;
  };
  createdAt: string;
}

export default function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ ref: string }>;
}) {
  const resolvedParams = use(params);
  const orderRef = resolvedParams.ref;

  const [order, setOrder] = useState<OrderDetails | null>(null);

  useEffect(() => {
    // For order confirmation immediately after submission, we can query by ref with email or general fetch
    fetch(`/api/orders/${orderRef}?verify=customer`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setOrder(data);
        }
      })
      .catch(() => {});
  }, [orderRef]);

  const whatsAppUrl = getOrderInquiryWhatsAppUrl(orderRef, order?.customer?.name);

  return (
    <div className="min-h-screen pt-28 pb-24 text-neutral-800">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Card */}
        <div className="glass-card rounded-3xl p-8 sm:p-12 text-center bg-white/90 border border-emerald-200 shadow-xl mb-8">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 text-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
            ✓
          </div>

          <span className="text-xs uppercase font-bold tracking-widest text-emerald-800">
            Order Submitted Successfully
          </span>

          <h1 className="font-display text-3xl sm:text-4xl font-bold text-neutral-900 mt-2 mb-2">
            Thank You for Your Order!
          </h1>

          <p className="text-xs sm:text-sm text-neutral-600 max-w-lg mx-auto font-light mb-8">
            Your invitation order has been registered in our system. Save your unique reference below to track your progress at any time.
          </p>

          {/* Reference Badge */}
          <div className="inline-block p-4 sm:px-8 sm:py-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-neutral-900 mb-8">
            <span className="text-[11px] uppercase tracking-widest text-neutral-500 block mb-0.5 font-medium">
              Your Order Reference
            </span>
            <span className="font-mono text-2xl sm:text-3xl font-bold text-amber-900 tracking-wider">
              {orderRef}
            </span>
          </div>

          {/* WhatsApp Direct Action */}
          <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 max-w-md mx-auto mb-8 text-left">
            <h4 className="font-display font-bold text-sm text-emerald-950 mb-1 flex items-center gap-2">
              <span>💬</span> Next Step: Share Photos on WhatsApp
            </h4>
            <p className="text-xs text-emerald-800 mb-4 leading-relaxed font-light">
              Tap below to connect with your designated invitation designer on WhatsApp and send your couple portraits and song preferences.
            </p>
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs tracking-wider uppercase text-center block transition-colors shadow-sm"
            >
              Open WhatsApp to Share Details →
            </a>
          </div>

          {/* Order Summary Details */}
          {order && (
            <div className="text-left border-t border-neutral-200 pt-6 space-y-3 text-xs text-neutral-600 max-w-md mx-auto">
              <div className="flex justify-between">
                <span className="font-semibold text-neutral-800">Template Design:</span>
                <span>{order.templateName}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-neutral-800">Occasion:</span>
                <span>{order.occasion}</span>
              </div>
              {order.eventDetails && (
                <>
                  <div className="flex justify-between">
                    <span className="font-semibold text-neutral-800">Event Date:</span>
                    <span>{order.eventDetails.eventDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-neutral-800">Venue:</span>
                    <span>{order.eventDetails.venueName}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between">
                <span className="font-semibold text-neutral-800">Order Status:</span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold uppercase text-[10px]">
                  {order.status || "NEW"}
                </span>
              </div>
            </div>
          )}

          {/* Tracking Navigation Action */}
          <div className="mt-8 pt-6 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={`/track?ref=${orderRef}`}
              className="w-full sm:w-auto px-6 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-neutral-900 text-white hover:bg-neutral-800 transition-colors"
            >
              Track Order Status Portal
            </Link>
            <Link
              href="/templates"
              className="w-full sm:w-auto px-6 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase border border-neutral-300 text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              Browse More Designs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
