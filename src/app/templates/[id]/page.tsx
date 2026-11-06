"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { defaultTemplates } from "@/lib/defaultTemplates";
import { TemplateData } from "@/app/components/TemplateCard";

export default function TemplateDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const templateId = resolvedParams.id;

  const [template, setTemplate] = useState<TemplateData | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/templates/${templateId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) {
          setTemplate(data);
          setSelectedImage(data.thumbnail || (data.previewImages && data.previewImages[0]) || "/photos/L-1.jpeg");
        } else {
          const fallback = defaultTemplates.find((t) => t.slug === templateId);
          if (fallback) {
            setTemplate(fallback);
            setSelectedImage(fallback.thumbnail);
          }
        }
      })
      .catch(() => {
        const fallback = defaultTemplates.find((t) => t.slug === templateId);
        if (fallback) {
          setTemplate(fallback);
          setSelectedImage(fallback.thumbnail);
        }
      })
      .finally(() => setLoading(false));
  }, [templateId]);

  if (loading) {
    return (
      <div className="min-h-screen pt-36 text-center">
        <div className="inline-block w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs text-neutral-500 uppercase tracking-widest">
          Loading template details...
        </p>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="min-h-screen pt-36 pb-20 text-center max-w-lg mx-auto px-4">
        <span className="text-4xl mb-4 block">🔍</span>
        <h2 className="font-display text-2xl font-bold text-neutral-900 mb-2">
          Template Not Found
        </h2>
        <p className="text-xs text-neutral-500 mb-6">
          The requested template could not be found or has been updated.
        </p>
        <Link
          href="/templates"
          className="inline-block px-6 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-amber-500 text-white"
        >
          Return to Gallery
        </Link>
      </div>
    );
  }

  const previewImages =
    template.previewImages && template.previewImages.length > 0
      ? template.previewImages
      : [template.thumbnail];

  return (
    <div className="min-h-screen pt-28 pb-24 text-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-neutral-500 mb-8">
          <Link href="/" className="hover:text-amber-800">Home</Link>
          <span>/</span>
          <Link href="/templates" className="hover:text-amber-800">Templates</Link>
          <span>/</span>
          <span className="text-neutral-900 font-semibold">{template.title}</span>
        </nav>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Left: Gallery Showcase */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden glass-card border border-white/70 shadow-xl bg-neutral-100">
              <Image
                src={selectedImage || template.thumbnail}
                alt={template.title}
                fill
                priority
                className="object-cover"
              />
            </div>

            {/* Thumbnails row */}
            {previewImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {previewImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      selectedImage === img
                        ? "border-amber-600 scale-105 shadow-sm"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image src={img} alt="Thumbnail preview" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Details & Order CTA */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="glass-card rounded-3xl p-8 bg-white/80 border border-neutral-200/80 shadow-lg">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-amber-100 text-amber-900">
                  {template.category}
                </span>
                {template.isFeatured && (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-amber-500 text-white">
                    ⭐ Featured
                  </span>
                )}
              </div>

              <h1 className="font-display text-3xl sm:text-4xl font-bold text-neutral-900 mb-2">
                {template.title}
              </h1>

              {template.tagline && (
                <p className="text-sm font-medium text-amber-800 mb-4 tracking-wide">
                  {template.tagline}
                </p>
              )}

              {/* Informational Price Reference */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/60 mb-6 flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-neutral-500 block">Package Price (Includes Customization)</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="font-display text-2xl sm:text-3xl font-bold text-amber-900">
                      {template.currency || "₹"}{template.price.toLocaleString()}
                    </span>
                    <span className="text-xs text-neutral-500 font-light">one-time investment</span>
                  </div>
                </div>
                <span className="text-xs text-neutral-500">No recurring fees</span>
              </div>

              <p className="text-sm text-neutral-600 leading-relaxed font-light mb-6">
                {template.description}
              </p>

              {/* Included Features List */}
              <div className="mb-8">
                <h3 className="font-display text-xs uppercase tracking-widest font-bold text-neutral-900 mb-3">
                  Included Features in this Template
                </h3>
                <ul className="space-y-2.5">
                  {template.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2.5 text-xs text-neutral-700">
                      <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px]">
                        ✓
                      </span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3">
                <Link
                  href={`/order?template=${template.slug}`}
                  className="w-full py-4 rounded-full text-center text-xs font-semibold tracking-wider uppercase text-white shadow-md hover:shadow-lg transition-all"
                  style={{
                    background: "linear-gradient(135deg, #D4AF37, #B8860B)",
                  }}
                >
                  Order This Design →
                </Link>

                <Link
                  href={`/preview/${template.slug}`}
                  className="w-full py-3.5 rounded-full text-center text-xs font-semibold tracking-wider uppercase border border-neutral-300 text-neutral-800 hover:bg-neutral-100 transition-colors flex items-center justify-center gap-2"
                >
                  <span>👁️</span> Open Interactive 3D Preview
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
