"use client";

import { useState } from "react";
import Link from "next/link";
import { getGeneralContactWhatsAppUrl } from "@/lib/notifications/whatsapp";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [occasion, setOccasion] = useState("Wedding");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, occasion, message }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to submit enquiry.");
        return;
      }

      setSuccess(true);
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const whatsappUrl = getGeneralContactWhatsAppUrl();

  return (
    <div className="min-h-screen pt-28 pb-24 text-neutral-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase font-bold tracking-widest text-amber-700">
            Get in Touch
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-neutral-900 mt-2 mb-3">
            Contact Our Design Studio
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 font-light">
            Have questions about our templates, custom themes, or need immediate assistance? We are here to bring your vision to life.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Left: Contact Info & WhatsApp */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-card rounded-3xl p-8 bg-white/80 border border-neutral-200/80 shadow-md">
              <h3 className="font-display text-xl font-bold text-neutral-900 mb-4">
                Instant WhatsApp Concierge
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed font-light mb-6">
                For rapid design consultations, photo reviews, or urgent wedding date inquiries, message our team directly on WhatsApp.
              </p>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 px-6 rounded-full text-xs font-semibold uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <span>💬</span> Open WhatsApp Chat
              </a>
            </div>

            <div className="glass-card rounded-3xl p-8 bg-white/80 border border-neutral-200/80 shadow-md space-y-4 text-xs">
              <div>
                <span className="font-bold text-neutral-900 block mb-0.5">Email Support</span>
                <span className="text-neutral-600">hello@mybelovedinvitations.com</span>
              </div>
              <div>
                <span className="font-bold text-neutral-900 block mb-0.5">Studio Hours</span>
                <span className="text-neutral-600">Monday – Sunday: 9:00 AM – 9:00 PM IST</span>
              </div>
              <div>
                <span className="font-bold text-neutral-900 block mb-0.5">Turnaround Time</span>
                <span className="text-neutral-600">Standard templates: 24-48 hours. Custom bespoke themes: 3-5 days.</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-amber-50/80 border border-amber-200/60 text-xs">
              <span className="font-bold text-amber-900 block mb-1">Need Design Customization?</span>
              <p className="text-neutral-600 mb-3 font-light">
                Our concierge team is available to customize color palettes, background scores, and family timelines.
              </p>
              <Link href="/templates" className="font-semibold text-amber-800 hover:underline">
                Explore Template Designs →
              </Link>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-7">
            <div className="glass-card rounded-3xl p-8 sm:p-10 bg-white/90 border border-neutral-200/80 shadow-lg">
              <h2 className="font-display text-2xl font-bold text-neutral-900 mb-2">
                Send Us a Message
              </h2>
              <p className="text-xs text-neutral-500 mb-6 font-light">
                Fill in the details below and our design artisans will respond within 4 business hours.
              </p>

              {success ? (
                <div className="p-8 text-center text-emerald-800 bg-emerald-50 rounded-2xl border border-emerald-200">
                  <span className="text-4xl block mb-2">💌</span>
                  <h3 className="font-display font-bold text-lg">Thank You!</h3>
                  <p className="text-xs mt-1 text-emerald-700">
                    Your message has been received. Our team will contact you shortly.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="mt-6 px-6 py-2 rounded-full text-xs font-semibold bg-emerald-700 text-white"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                      {error}
                    </div>
                  )}

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Radhika Sharma"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="radhika@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                        Phone / WhatsApp
                      </label>
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                        Occasion
                      </label>
                      <select
                        value={occasion}
                        onChange={(e) => setOccasion(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-amber-500 outline-none bg-white"
                      >
                        <option value="Wedding">Wedding Celebration</option>
                        <option value="Anniversary">Anniversary</option>
                        <option value="Birthday">Birthday</option>
                        <option value="Wishes">Wishes & Keepsake</option>
                        <option value="Custom Bespoke">Bespoke Enterprise / Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                      Your Message or Inquiry *
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Tell us about your event dates, preferred design theme, or any custom requirements..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-amber-500 outline-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-white shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                    style={{
                      background: "linear-gradient(135deg, #D4AF37, #B8860B)",
                    }}
                  >
                    {loading ? "Sending Message..." : "Send Message"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
