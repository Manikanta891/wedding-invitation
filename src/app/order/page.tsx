"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { defaultTemplates } from "@/lib/defaultTemplates";
import { TemplateData } from "@/app/components/TemplateCard";

function OrderFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedTemplate = searchParams.get("template") || "";
  const isCustom = searchParams.get("custom") === "true";

  const [templates, setTemplates] = useState<TemplateData[]>(defaultTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState(preselectedTemplate || "royal-palace");

  // Form Fields
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [occasion, setOccasion] = useState(isCustom ? "Custom Bespoke" : "Wedding");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("7:00 PM onwards");
  const [venueName, setVenueName] = useState("");
  const [venueAddress, setVenueAddress] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");

  // File Upload State
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<
    Array<{ name: string; url: string; fileId?: string; size?: number }>
  >([]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/templates")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setTemplates(data);
          if (preselectedTemplate) {
            const found = data.find((t) => t.slug === preselectedTemplate);
            if (found) setSelectedTemplate(found.slug);
          }
        }
      })
      .catch(() => {});
  }, [preselectedTemplate]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 25 * 1024 * 1024) {
      alert("File exceeds maximum allowed size of 25MB");
      return;
    }

    setUploadingFile(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", "Originals");

    try {
      const res = await fetch("/api/media/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.file) {
        setUploadedFiles([
          ...uploadedFiles,
          {
            name: file.name,
            url: data.file.url,
            fileId: data.file.fileId,
            size: file.size,
          },
        ]);
      } else {
        alert(data.error || "File upload failed");
      }
    } catch {
      alert("Network error during file upload");
    } finally {
      setUploadingFile(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!customerName.trim() || !customerEmail.trim() || !customerPhone.trim()) {
      setError("Please fill in your name, email, and phone number.");
      return;
    }

    if (!eventDate || !venueName.trim() || !venueAddress.trim()) {
      setError("Please provide the event date, venue name, and address.");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        customer: {
          name: customerName.trim(),
          email: customerEmail.trim().toLowerCase(),
          phone: customerPhone.trim(),
        },
        occasion,
        templateId: selectedTemplate,
        eventDetails: {
          eventDate,
          eventTime,
          venueName: venueName.trim(),
          venueAddress: venueAddress.trim(),
          additionalNotes: additionalNotes.trim(),
        },
        referenceFiles: uploadedFiles,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to place order. Please check inputs.");
        return;
      }

      router.push(`/order/confirmation/${data.orderRef}`);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const selectedTemplateObj = templates.find((t) => t.slug === selectedTemplate);

  return (
    <div className="min-h-screen pt-28 pb-24 text-neutral-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase font-bold tracking-widest text-amber-700">
            Assisted Ordering
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-neutral-900 mt-2 mb-3">
            Digital Invitation Order Form
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 font-light">
            Tell us about your celebration. Once submitted, our concierge team will contact you to collect photos and tailor your personalized invitation.
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center gap-3">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Step 1: Template Selection */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 bg-white/80 border border-neutral-200/80 shadow-md">
            <h2 className="font-display text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs flex items-center justify-center font-bold">1</span>
              Selected Design & Occasion
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Choose Template
                </label>
                <select
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-amber-500 outline-none bg-white"
                >
                  {templates.map((t) => (
                    <option key={t.slug} value={t.slug}>
                      {t.title} ({t.currency || "₹"}{t.price})
                    </option>
                  ))}
                  <option value="custom-design">Custom Bespoke Theme (Craft from Scratch)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Occasion Type
                </label>
                <select
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-amber-500 outline-none bg-white"
                >
                  <option value="Wedding">Wedding Celebration</option>
                  <option value="Reception">Reception Gala</option>
                  <option value="Engagement">Engagement / Roka</option>
                  <option value="Anniversary">Wedding Anniversary</option>
                  <option value="Birthday">Birthday Celebration</option>
                  <option value="Wishes">Wishes & Keepsake Wall</option>
                  <option value="Other">Other Special Milestone</option>
                </select>
              </div>
            </div>

            {selectedTemplateObj && (
              <div className="mt-4 p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/60 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-amber-950">{selectedTemplateObj.title}</span>
                  <span className="text-neutral-500 block text-[11px] mt-0.5">
                    Includes animated envelope, music, RSVP & venue map
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-display font-bold text-base text-amber-900">
                    {selectedTemplateObj.currency || "₹"}{selectedTemplateObj.price}
                  </span>
                  <span className="text-[10px] text-neutral-500 block">informational price</span>
                </div>
              </div>
            )}
          </div>

          {/* Step 2: Customer Contact Details */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 bg-white/80 border border-neutral-200/80 shadow-md">
            <h2 className="font-display text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs flex items-center justify-center font-bold">2</span>
              Your Contact Information
            </h2>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Madugula Harshavardhan"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
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
                  placeholder="name@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  WhatsApp / Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Step 3: Event Information */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 bg-white/80 border border-neutral-200/80 shadow-md">
            <h2 className="font-display text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs flex items-center justify-center font-bold">3</span>
              Event Dates & Location
            </h2>

            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Event Date *
                </label>
                <input
                  type="date"
                  required
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Event Time / Muhurtham
                </label>
                <input
                  type="text"
                  placeholder="e.g. 7:00 PM onwards / 9:07 PM Sumuhurtham"
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Venue Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. JVR Conventions / Grand Palace"
                  value={venueName}
                  onChange={(e) => setVenueName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Venue Address & City *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Main Road, Ponduru, Andhra Pradesh"
                  value={venueAddress}
                  onChange={(e) => setVenueAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Special Requests or Custom Details
              </label>
              <textarea
                rows={3}
                placeholder="Mention couple names, parents' names, preferred background music, or custom colors..."
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-amber-500 outline-none resize-none"
              />
            </div>
          </div>

          {/* Step 4: Optional Reference Media */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 bg-white/80 border border-neutral-200/80 shadow-md">
            <h2 className="font-display text-lg font-bold text-neutral-900 mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs flex items-center justify-center font-bold">4</span>
              Reference Photos & Inspiration (Optional)
            </h2>
            <p className="text-xs text-neutral-500 mb-4 font-light">
              You can attach sample photos now, or share your high-res photos via WhatsApp after placing the order.
            </p>

            <div className="flex items-center gap-4">
              <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border border-neutral-300 transition-colors">
                <span>📁</span>
                <span>{uploadingFile ? "Uploading to Storage..." : "Attach Photo / Document"}</span>
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileUpload}
                  disabled={uploadingFile}
                  className="hidden"
                />
              </label>

              {uploadingFile && (
                <div className="w-5 h-5 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
              )}
            </div>

            {uploadedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                {uploadedFiles.map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-xs px-3.5 py-2 rounded-xl bg-neutral-50 border border-neutral-200"
                  >
                    <span className="truncate max-w-xs">{f.name}</span>
                    <span className="text-emerald-600 font-semibold text-[11px]">✓ Uploaded</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Action */}
          <div className="pt-4 text-center">
            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto px-12 py-4 rounded-full text-xs font-semibold tracking-wider uppercase text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 disabled:opacity-50"
              style={{
                background: "linear-gradient(135deg, #D4AF37, #B8860B)",
              }}
            >
              {submitting ? "Placing Your Order..." : "Confirm & Place Invitation Order ✨"}
            </button>
            <p className="text-[11px] text-neutral-500 mt-3 font-light">
              No online payment required now. Our team coordinates details directly with you.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function OrderPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-32 text-center text-xs">Loading form...</div>}>
      <OrderFormContent />
    </Suspense>
  );
}
