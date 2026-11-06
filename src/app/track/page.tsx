"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { getShareInvitationWhatsAppUrl } from "@/lib/notifications/whatsapp";

interface OrderStatusView {
  orderRef: string;
  occasion: string;
  templateName: string;
  status: "NEW" | "CONTACTED" | "DETAILS_RECEIVED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  customerName: string;
  eventDetails: {
    eventDate: string;
    eventTime: string;
    venueName: string;
    venueAddress: string;
  };
  invitationUrl?: string;
  createdAt: string;
  statusHistory: Array<{
    status: string;
    timestamp: string;
    note?: string;
  }>;
}

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialRef = searchParams.get("ref") || "";

  const [orderRef, setOrderRef] = useState(initialRef);
  const [verify, setVerify] = useState("");
  const [order, setOrder] = useState<OrderStatusView | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderRef.trim() || !verify.trim()) {
      setError("Please provide both your Order Reference and Email/Phone number.");
      return;
    }

    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const res = await fetch(
        `/api/orders/${encodeURIComponent(orderRef.trim())}?verify=${encodeURIComponent(
          verify.trim()
        )}`
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Order not found or verification failed.");
        return;
      }

      setOrder(data);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { key: "NEW", label: "Order Submitted", desc: "Order registered in our system" },
    { key: "CONTACTED", label: "Contacted", desc: "Design concierge assigned" },
    { key: "DETAILS_RECEIVED", label: "Details Received", desc: "Photos & audio gathered" },
    { key: "IN_PROGRESS", label: "In Production", desc: "Crafting 3D animations & layouts" },
    { key: "COMPLETED", label: "Live & Published", desc: "Invitation link ready to share" },
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case "NEW": return 0;
      case "CONTACTED": return 1;
      case "DETAILS_RECEIVED": return 2;
      case "IN_PROGRESS": return 3;
      case "COMPLETED": return 4;
      default: return 0;
    }
  };

  const currentStepIdx = order ? getStepIndex(order.status) : 0;

  return (
    <div className="min-h-screen pt-28 pb-24 text-neutral-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase font-bold tracking-widest text-amber-700">
            Realtime Tracking
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-neutral-900 mt-2 mb-3">
            Track Your Invitation Order
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 font-light">
            Enter your order reference number and verified email or phone to view live progress, updates, and your published invitation link.
          </p>
        </div>

        {/* Lookup Box */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 bg-white/80 border border-neutral-200/80 shadow-md mb-10">
          <form onSubmit={handleLookup} className="grid sm:grid-cols-12 gap-4 items-end">
            <div className="sm:col-span-5">
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Order Reference *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. INV-2026-X9K2"
                value={orderRef}
                onChange={(e) => setOrderRef(e.target.value.toUpperCase())}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs font-mono uppercase focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            <div className="sm:col-span-5">
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Email or WhatsApp Number *
              </label>
              <input
                type="text"
                required
                placeholder="The contact used when ordering"
                value={verify}
                onChange={(e) => setVerify(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-white shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                style={{
                  background: "linear-gradient(135deg, #D4AF37, #B8860B)",
                }}
              >
                {loading ? "Searching..." : "Track"}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Order Result Display */}
        {order && (
          <div className="space-y-8 animate-fadeIn">
            {/* Header Status Card */}
            <div className="glass-card rounded-3xl p-6 sm:p-8 bg-white/90 border border-neutral-200 shadow-lg">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-neutral-100 gap-4">
                <div>
                  <span className="text-xs uppercase font-bold text-neutral-400">Order Reference</span>
                  <div className="font-mono text-2xl font-bold text-amber-900">{order.orderRef}</div>
                  <div className="text-xs text-neutral-500 mt-0.5">
                    For <strong>{order.customerName}</strong> • {order.templateName}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-500">Current Status:</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      order.status === "COMPLETED"
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                        : order.status === "CANCELLED"
                        ? "bg-rose-100 text-rose-800 border border-rose-300"
                        : "bg-amber-100 text-amber-900 border border-amber-300"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Progress Stepper */}
              {order.status !== "CANCELLED" ? (
                <div className="py-8">
                  <div className="grid grid-cols-5 gap-2 relative">
                    {steps.map((st, i) => {
                      const isComplete = i <= currentStepIdx;
                      const isCurrent = i === currentStepIdx;

                      return (
                        <div key={st.key} className="flex flex-col items-center text-center">
                          <div
                            className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm mb-2 transition-all ${
                              isComplete
                                ? "bg-amber-500 text-white shadow-md ring-4 ring-amber-100"
                                : "bg-neutral-100 text-neutral-400 border border-neutral-200"
                            }`}
                          >
                            {isComplete ? "✓" : i + 1}
                          </div>
                          <span
                            className={`text-[11px] sm:text-xs font-semibold leading-tight ${
                              isCurrent ? "text-amber-900 font-bold" : "text-neutral-600"
                            }`}
                          >
                            {st.label}
                          </span>
                          <span className="hidden sm:block text-[10px] text-neutral-400 mt-0.5 leading-snug">
                            {st.desc}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="py-6 text-center text-rose-700 bg-rose-50 rounded-2xl my-4 text-xs">
                  This order was cancelled. Please contact support if you believe this is in error.
                </div>
              )}

              {/* Live Invitation Link Box */}
              {order.invitationUrl && (
                <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-50 via-rose-50 to-amber-50 border-2 border-amber-300 text-center sm:text-left sm:flex sm:items-center sm:justify-between gap-4 mt-6">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full inline-block mb-1">
                      🎉 Live Invitation Ready
                    </span>
                    <h3 className="font-display font-bold text-lg text-neutral-900">
                      Your invitation is officially published!
                    </h3>
                    <p className="text-xs text-neutral-600 font-light mt-0.5">
                      Share this private link with your family and guests via WhatsApp:
                    </p>
                    <code className="text-xs text-amber-950 font-mono mt-1 block select-all">
                      {order.invitationUrl}
                    </code>
                  </div>

                  <div className="flex flex-col gap-2 shrink-0 mt-4 sm:mt-0">
                    <a
                      href={order.invitationUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider text-white shadow-sm hover:shadow-md text-center"
                      style={{
                        background: "linear-gradient(135deg, #D4AF37, #B8860B)",
                      }}
                    >
                      Open Invitation ↗
                    </a>
                    <a
                      href={getShareInvitationWhatsAppUrl(
                        `${order.customerName}'s Celebration`,
                        order.invitationUrl
                      )}
                      target="_blank"
                      rel="noreferrer"
                      className="px-5 py-2 rounded-full text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white text-center transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>💬</span> Share on WhatsApp
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Event Summary & Activity History */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Event Info */}
              <div className="glass-card rounded-2xl p-6 bg-white/80 border border-neutral-200">
                <h4 className="font-display font-bold text-sm text-neutral-900 mb-4 pb-2 border-b border-neutral-100">
                  Event Details on File
                </h4>
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Occasion:</span>
                    <span className="font-medium text-neutral-900">{order.occasion}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Date:</span>
                    <span className="font-medium text-neutral-900">{order.eventDetails.eventDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Time:</span>
                    <span className="font-medium text-neutral-900">{order.eventDetails.eventTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Venue:</span>
                    <span className="font-medium text-neutral-900 text-right">{order.eventDetails.venueName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Address:</span>
                    <span className="font-medium text-neutral-900 text-right max-w-[200px]">{order.eventDetails.venueAddress}</span>
                  </div>
                </div>
              </div>

              {/* Status History */}
              <div className="glass-card rounded-2xl p-6 bg-white/80 border border-neutral-200">
                <h4 className="font-display font-bold text-sm text-neutral-900 mb-4 pb-2 border-b border-neutral-100">
                  Progress Updates
                </h4>
                <div className="space-y-3">
                  {order.statusHistory.map((h, i) => (
                    <div key={i} className="text-xs border-l-2 border-amber-400 pl-3 py-0.5">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-neutral-800">{h.status}</span>
                        <span className="text-[10px] text-neutral-400">
                          {new Date(h.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      {h.note && <p className="text-[11px] text-neutral-500 mt-0.5">{h.note}</p>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-32 text-center text-xs">Loading tracker...</div>}>
      <TrackOrderContent />
    </Suspense>
  );
}
