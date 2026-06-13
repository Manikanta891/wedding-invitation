"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const images = [
  { id: 1, src: "/api/placeholder/600/800", alt: "Pre-wedding shoot", label: "Together" },
  { id: 2, src: "/api/placeholder/800/600", alt: "Engagement", label: "Engagement" },
  { id: 3, src: "/api/placeholder/600/600", alt: "Couple portrait", label: "Love" },
  { id: 4, src: "/api/placeholder/800/800", alt: "Family photo", label: "Family" },
  { id: 5, src: "/api/placeholder/600/800", alt: "Bride portrait", label: "Elegance" },
  { id: 6, src: "/api/placeholder/800/600", alt: "Groom portrait", label: "Grace" },
  { id: 7, src: "/api/placeholder/600/600", alt: "Mehendi", label: "Celebration" },
  { id: 8, src: "/api/placeholder/800/800", alt: "Sangeet", label: "Joy" },
];

export default function Gallery() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <section id="gallery" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="font-script text-xl" style={{ color: "var(--secondary)" }}>Moments</span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold mt-2 mb-4">Gallery</h2>
          <div className="section-divider" />
          <p className="mt-4 max-w-lg mx-auto" style={{ color: "var(--text-light)" }}>
            A collection of our favorite memories together
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {images.map((image, i) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className={`relative group cursor-pointer rounded-2xl overflow-hidden ${
                i === 0 ? "col-span-2 row-span-2" : ""
              } ${i === 1 ? "col-span-2" : ""}
              ${i === 6 ? "col-span-2" : ""}`}
              onClick={() => setSelected(image.id)}
            >
              <div className="glossy-overlay">
                <div
                  className="w-full h-full min-h-[200px] md:min-h-[250px] flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, var(--accent), var(--primary))`,
                  }}
                >
                  <span className="text-4xl md:text-5xl opacity-50">📸</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <span className="font-script text-lg text-white">{image.label}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-8 text-sm"
          style={{ color: "var(--text-light)" }}
        >
          More photos coming soon...
        </motion.p>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-2xl w-full aspect-[4/3] rounded-2xl overflow-hidden glass-card"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full h-full flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, var(--accent), var(--primary))`,
                }}
              >
                <span className="text-8xl opacity-30">📸</span>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full glass flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
