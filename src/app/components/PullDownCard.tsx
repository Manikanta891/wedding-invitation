"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface PullDownCardProps {
  role: "Groom" | "Bride";
  name: string;
  relation: "Son of" | "Daughter of";
  parents: string;
  image: string;
  bio?: string;
}

export default function PullDownCard({
  role,
  name,
  relation,
  parents,
  image,
  bio,
}: PullDownCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      layout
      transition={{ layout: { duration: 0.5, type: "spring", stiffness: 120, damping: 18 } }}
      className="w-full max-w-sm mx-auto glass-card rounded-3xl overflow-hidden border border-amber-300/60 shadow-xl bg-white/80 backdrop-blur-md relative"
    >
      {/* Top Banner & Header */}
      <div className="p-6 sm:p-7 text-center relative z-10">
        {/* Role Badge */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-widest text-amber-900 bg-amber-100/90 border border-amber-300 shadow-sm mb-4">
          <span>{role === "Groom" ? "👑" : "✨"}</span>
          <span>{role}</span>
        </div>

        {/* Name */}
        <h3 className="font-display text-3xl sm:text-4xl font-bold text-neutral-900 tracking-tight mb-2">
          {name}
        </h3>

        {/* Parentage info */}
        <div className="space-y-1 mb-5">
          <p className="text-xs font-medium text-amber-700/80 uppercase tracking-wider">
            {relation}
          </p>
          <p className="font-display text-base sm:text-lg font-semibold text-neutral-800">
            {parents}
          </p>
        </div>

        {/* Pull Down Trigger Bar */}
        <motion.button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold uppercase tracking-widest text-amber-950 bg-gradient-to-r from-amber-200 via-amber-300 to-amber-200 border border-amber-400/60 shadow-sm hover:shadow flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <span>{isOpen ? "Pull Up" : "Pull Down"}</span>
          <motion.span
            animate={{ y: isOpen ? [0, -3, 0] : [0, 3, 0], rotate: isOpen ? 180 : 0 }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="text-sm font-bold"
          >
            ↓
          </motion.span>
        </motion.button>
      </div>

      {/* Pull Down Sliding Drawer Section */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
            className="overflow-hidden border-t border-amber-200/80 bg-gradient-to-b from-amber-50/60 to-white/90"
          >
            <div className="p-6 pt-5 text-center flex flex-col items-center">
              {/* Photo */}
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-amber-300 shadow-md mb-4">
                <Image
                  src={image}
                  alt={`${role} ${name}`}
                  fill
                  className="object-cover"
                  sizes="128px"
                />
              </div>

              {/* Bio / Affectionate quote */}
              <p className="text-xs sm:text-sm text-neutral-600 italic leading-relaxed max-w-xs mb-4">
                &ldquo;{bio || `Ready to embark on this beautiful sacred journey of a lifetime with immense love and family blessings.`}&rdquo;
              </p>

              <div className="flex items-center gap-2 text-[11px] text-amber-800 font-medium bg-amber-100/60 px-3 py-1 rounded-full border border-amber-200">
                <span>❦</span>
                <span>Blessings from family &amp; friends</span>
                <span>❦</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

