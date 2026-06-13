"use client";

import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="relative py-16 overflow-hidden">
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="glass-card rounded-3xl p-8 md:p-12 mb-8">
            <span className="font-script text-3xl md:text-4xl" style={{ color: "var(--primary-dark)" }}>
              Thank You
            </span>
            <h3 className="font-display text-2xl md:text-3xl font-bold mt-3 mb-4">
              We Can&apos;t Wait to Celebrate With You
            </h3>
            <p className="max-w-md mx-auto leading-relaxed" style={{ color: "var(--text-light)" }}>
              Your presence is the greatest gift of all. We look forward to sharing this special day with our loved ones.
            </p>

            <div className="flex items-center justify-center gap-2 mt-8">
              <span className="text-sm font-medium tracking-wider" style={{ color: "var(--text-light)" }}>
                Made with
              </span>
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="inline-block"
              >
                ❤️
              </motion.span>
              <span className="text-sm font-medium tracking-wider" style={{ color: "var(--text-light)" }}>
                by Harsha &amp; Indu
              </span>
            </div>
          </div>

          <p className="text-xs tracking-widest uppercase" style={{ color: "var(--text-light)" }}>
            &copy; {new Date().getFullYear()} Harshavardhan &amp; Indumathi. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
