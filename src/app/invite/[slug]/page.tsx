"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import Hero from "@/app/components/Hero";
import Story from "@/app/components/Story";
import Events from "@/app/components/Events";
import Gallery from "@/app/components/Gallery";
import Wishes from "@/app/components/Wishes";
import Footer from "@/app/components/Footer";
import { getShareInvitationWhatsAppUrl } from "@/lib/notifications/whatsapp";

interface InvitationData {
  slug: string;
  title: string;
  coupleNames: { person1: string; person2?: string };
  headline: string;
  eventDate: string;
  status: "published" | "draft" | "expired";
  viewsCount: number;
}

export default function PublishedInvitationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [invitation, setInvitation] = useState<InvitationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isExpired, setIsExpired] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [rsvpName, setRsvpName] = useState("");
  const [attending, setAttending] = useState<"yes" | "no">("yes");
  const [guestCount, setGuestCount] = useState(1);
  const [rsvpSubmitting, setRsvpSubmitting] = useState(false);
  const [rsvpSuccess, setRsvpSuccess] = useState(false);

  useEffect(() => {
    fetch(`/api/invitations/${slug}`)
      .then(async (res) => {
        if (res.status === 410) {
          setIsExpired(true);
          setLoading(false);
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data && !data.error) {
          setInvitation(data);
        }
      })
      .catch((err) => console.warn("Failed to load invitation:", err))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpName.trim()) return;

    setRsvpSubmitting(true);
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invitationSlug: slug,
          name: rsvpName.trim(),
          attending,
          guestCount,
        }),
      });

      if (res.ok) {
        setRsvpSuccess(true);
        setTimeout(() => {
          setRsvpOpen(false);
          setRsvpSuccess(false);
        }, 2500);
      }
    } catch {
      // silently fail
    } finally {
      setRsvpSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-36 text-center text-neutral-600">
        <div className="inline-block w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs uppercase tracking-widest">Opening invitation...</p>
      </div>
    );
  }

  if (isExpired) {
    return (
      <div className="min-h-screen pt-36 pb-20 text-center max-w-lg mx-auto px-4">
        <span className="text-5xl mb-4 block">🌸</span>
        <h1 className="font-display text-3xl font-bold text-neutral-900 mb-3">
          This Celebration Has Concluded
        </h1>
        <p className="text-xs text-neutral-600 leading-relaxed font-light mb-8">
          Thank you for visiting. This digital wedding invitation is now in archive mode. We are deeply grateful to everyone who celebrated and shared their blessings with the couple.
        </p>
        <Link
          href="/"
          className="px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-amber-500 text-white"
        >
          Visit My Beloved Digital Invitations
        </Link>
      </div>
    );
  }

  const currentUrl = typeof window !== "undefined" ? window.location.href : `https://mybeloved.in/invite/${slug}`;
  const shareWhatsAppUrl = getShareInvitationWhatsAppUrl(
    invitation?.title || "our wedding celebration",
    currentUrl
  );

  return (
    <div className="min-h-screen relative overflow-x-hidden text-neutral-800">
      {/* Floating Audio & RSVP Top Bar */}
      <div className="fixed top-4 right-4 z-40 flex items-center gap-2">
        <button
          onClick={() => setIsPlayingAudio(!isPlayingAudio)}
          className={`w-10 h-10 rounded-full glass-card border border-white/70 shadow-lg flex items-center justify-center text-sm transition-transform hover:scale-105 ${
            isPlayingAudio ? "bg-amber-100 text-amber-800" : "bg-white/80 text-neutral-700"
          }`}
          title="Toggle Background Music"
        >
          {isPlayingAudio ? "🔊" : "🔇"}
        </button>

        <button
          onClick={() => setRsvpOpen(true)}
          className="px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase text-white shadow-lg transition-transform hover:scale-105"
          style={{
            background: "linear-gradient(135deg, #F5B7C5, #E8A0B5)",
          }}
        >
          RSVP Here 💌
        </button>

        <a
          href={shareWhatsAppUrl}
          target="_blank"
          rel="noreferrer"
          className="w-10 h-10 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg flex items-center justify-center text-sm transition-transform hover:scale-105"
          title="Share Invitation via WhatsApp"
        >
          💬
        </a>
      </div>

      {/* RSVP Modal */}
      {rsvpOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative border border-amber-200">
            <button
              onClick={() => setRsvpOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700 text-lg"
            >
              ✕
            </button>

            <div className="text-center mb-6">
              <span className="text-3xl mb-1 block">💒</span>
              <h3 className="font-display text-xl font-bold text-neutral-900">
                Confirm Your Attendance
              </h3>
              <p className="text-xs text-neutral-500 mt-1">
                Please let the hosts know if you will be celebrating with us!
              </p>
            </div>

            {rsvpSuccess ? (
              <div className="p-6 text-center text-emerald-800 bg-emerald-50 rounded-2xl">
                <span className="text-3xl block mb-2">🎉</span>
                <p className="font-semibold text-sm">Response Received!</p>
                <p className="text-xs mt-1">Thank you for confirming. We can&apos;t wait to see you!</p>
              </div>
            ) : (
              <form onSubmit={handleRsvpSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh & Sunita"
                    value={rsvpName}
                    onChange={(e) => setRsvpName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Attendance
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setAttending("yes")}
                      className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                        attending === "yes"
                          ? "bg-emerald-600 text-white border-emerald-600"
                          : "border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                      }`}
                    >
                      ✓ Joyfully Attending
                    </button>
                    <button
                      type="button"
                      onClick={() => setAttending("no")}
                      className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                        attending === "no"
                          ? "bg-neutral-800 text-white border-neutral-800"
                          : "border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                      }`}
                    >
                      ✕ Regretfully Declining
                    </button>
                  </div>
                </div>

                {attending === "yes" && (
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">
                      Total Attending Guests
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={guestCount}
                      onChange={(e) => setGuestCount(parseInt(e.target.value) || 1)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={rsvpSubmitting}
                  className="w-full py-3 rounded-xl text-xs font-semibold uppercase tracking-wider text-white shadow-md disabled:opacity-50"
                  style={{
                    background: "linear-gradient(135deg, #D4AF37, #B8860B)",
                  }}
                >
                  {rsvpSubmitting ? "Submitting..." : "Send RSVP Response"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Main Invitation Sections */}
      <main>
        <Hero />
        <Story />
        <Events />
        <Gallery />
        <Wishes />
        <Footer />
      </main>
    </div>
  );
}
