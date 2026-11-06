"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export interface TemplateData {
  _id?: string;
  slug: string;
  title: string;
  tagline?: string;
  description: string;
  category: string;
  price: number;
  currency?: string;
  thumbnail: string;
  previewImages?: string[];
  features: string[];
  demoSlug?: string;
  isFeatured?: boolean;
}

interface TemplateCardProps {
  template: TemplateData;
  priority?: boolean;
}

export default function TemplateCard({ template, priority = false }: TemplateCardProps) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = ((y - centerY) / centerY) * -7;
    const rotY = ((x - centerX) / centerX) * 7;

    setRotateX(rotX);
    setRotateY(rotY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  const categoryLabels: Record<string, string> = {
    wedding: "Wedding Invitation",
    anniversary: "Anniversary Celebration",
    birthday: "Birthday Gala",
    wishes: "Wishes & Keepsake",
    "save-the-date": "Save the Date",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      style={{ perspective: 1000 }}
      className="group relative"
    >
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transformStyle: "preserve-3d",
          transition: "transform 0.15s ease-out",
        }}
        className="glass-card rounded-3xl overflow-hidden flex flex-col h-full border border-white/60 bg-white/75 shadow-lg group-hover:shadow-2xl transition-shadow duration-300"
      >
        {/* Thumbnail Visual Container with 3D depth */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100">
          <Image
            src={template.thumbnail}
            alt={template.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={priority}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 opacity-70 group-hover:opacity-60 transition-opacity" />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex gap-2 items-center">
            <span className="px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-white/90 text-neutral-800 backdrop-blur-md shadow-sm">
              {categoryLabels[template.category] || template.category}
            </span>
            {template.isFeatured && (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-amber-500 text-white shadow-sm flex items-center gap-1">
                ⭐ Featured
              </span>
            )}
          </div>

          {/* Informational Price Pill */}
          <div className="absolute bottom-4 right-4 px-3.5 py-1.5 rounded-full bg-white/95 text-neutral-900 font-bold text-sm shadow-md backdrop-blur-md flex items-baseline gap-1">
            <span className="text-xs text-neutral-500 font-normal">from</span>
            <span className="text-amber-700 font-display">
              {template.currency || "₹"}{template.price.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Details & Copy */}
        <div className="p-6 flex flex-col flex-1 justify-between">
          <div>
            <h3 className="font-display text-xl font-bold text-neutral-900 mb-1 group-hover:text-amber-700 transition-colors">
              {template.title}
            </h3>
            {template.tagline && (
              <p className="text-xs font-medium text-amber-800/80 mb-2.5 tracking-wide">
                {template.tagline}
              </p>
            )}
            <p className="text-sm text-neutral-600 line-clamp-2 leading-relaxed mb-4">
              {template.description}
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-1.5 mb-6">
              {template.features.slice(0, 3).map((feat) => (
                <span
                  key={feat}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-neutral-100 text-neutral-700 border border-neutral-200/60"
                >
                  ✓ {feat}
                </span>
              ))}
              {template.features.length > 3 && (
                <span className="px-2 py-1 rounded-lg text-[11px] text-neutral-500 bg-neutral-50">
                  +{template.features.length - 3} more
                </span>
              )}
            </div>
          </div>

          {/* Action Row */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-neutral-100">
            <Link
              href={`/preview/${template.slug}`}
              className="py-2.5 px-3 rounded-xl text-center text-xs font-semibold tracking-wider uppercase border border-neutral-300 text-neutral-800 hover:bg-neutral-100 transition-colors flex items-center justify-center gap-1.5"
            >
              <span>👁️</span> Live Preview
            </Link>
            <Link
              href={`/order?template=${template.slug}`}
              className="py-2.5 px-3 rounded-xl text-center text-xs font-semibold tracking-wider uppercase text-white shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-1"
              style={{
                background: "linear-gradient(135deg, #D4AF37, #B8860B)",
              }}
            >
              <span>✨</span> Order Design
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
