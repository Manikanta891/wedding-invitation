"use client";

import { use } from "react";
import VinayMounikaInvitation from "@/app/components/VinayMounikaInvitation";
import Hero from "@/app/components/Hero";
import Story from "@/app/components/Story";
import Events from "@/app/components/Events";
import Gallery from "@/app/components/Gallery";
import Wishes from "@/app/components/Wishes";
import Footer from "@/app/components/Footer";
import Link from "next/link";

export default function TemplatePreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const templateSlug = resolvedParams.id;

  // When viewing golden-anniversary (or custom wedding preview), render the bespoke Vinay & Mounika interactive invitation
  if (templateSlug === "golden-anniversary" || templateSlug === "vinay-mounika") {
    return <VinayMounikaInvitation templateSlug={templateSlug} />;
  }

  return (
    <div className="min-h-screen relative overflow-x-hidden text-neutral-800">
      {/* Top Preview Control Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-neutral-900/90 text-white backdrop-blur-md px-4 py-2.5 flex items-center justify-between text-xs border-b border-neutral-700">
        <div className="flex items-center gap-2">
          <Link
            href="/templates"
            className="text-neutral-400 hover:text-white transition-colors flex items-center gap-1"
          >
            ← Catalog
          </Link>
          <span className="text-neutral-600">|</span>
          <span className="font-semibold tracking-wide text-amber-300">
            Preview Mode: {templateSlug.replace(/-/g, " ").toUpperCase()}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/order?template=${templateSlug}`}
            className="px-4 py-1.5 rounded-full font-semibold uppercase tracking-wider text-[11px] text-neutral-950 bg-amber-400 hover:bg-amber-300 transition-all shadow-sm"
          >
            Order This Design →
          </Link>
        </div>
      </div>

      {/* Actual Invitation Experience */}
      <div className="pt-8">
        <Hero />
        <Story />
        <Events />
        <Gallery />
        <Wishes />
        <Footer />
      </div>

      {/* Floating Bottom CTA Bar */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 glass-card bg-white/95 border border-amber-300 rounded-full px-5 py-2.5 shadow-2xl flex items-center gap-3">
        <span className="text-xs font-medium text-neutral-800 hidden sm:inline">
          Love this design for your wedding?
        </span>
        <Link
          href={`/order?template=${templateSlug}`}
          className="px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider text-white shadow-md hover:scale-105 transition-all"
          style={{
            background: "linear-gradient(135deg, #D4AF37, #B8860B)",
          }}
        >
          Order This Design →
        </Link>
      </div>
    </div>
  );
}
