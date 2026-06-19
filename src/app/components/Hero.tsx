"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const petalSizes = [1.2, 1.8, 2.1, 1.5, 2.4, 1.0];

function Countdown({ targetDate }: { targetDate: Date }) {
  const [time, setTime] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    const calc = () => {
      const diff = targetDate.getTime() - Date.now();
      if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      };
    };
    setTime(calc());
    const interval = setInterval(() => {
      setTime(calc());
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (!time) return null;

  const items = [
    { label: "Days", value: time.days },
    { label: "Hours", value: time.hours },
    { label: "Minutes", value: time.minutes },
    { label: "Seconds", value: time.seconds },
  ];

  return (
    <div className="flex gap-3 sm:gap-4 justify-center">
      {items.map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 + i * 0.15, duration: 0.5 }}
          className="countdown-item"
        >
          <div className="number">{String(item.value).padStart(2, "0")}</div>
          <div className="label">{item.label}</div>
        </motion.div>
      ))}
    </div>
  );
}

export default function Hero() {
  const weddingDate = new Date("2026-06-21T19:00:00");

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 md:pt-28">
      <div className="absolute inset-0 bg-pattern" />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="floating-petal"
            style={{
              left: `${10 + i * 18}%`,
              top: `${20 + (i % 3) * 30}%`,
              animationDelay: `${i * 1.2}s`,
              animationDuration: `${4 + i * 0.8}s`,
              fontSize: `${1.5 + petalSizes[i]}rem`,
            }}
          >
            ✿
          </div>
        ))}
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-6"
        >
          <span className="inline-block px-6 py-2 rounded-full text-sm font-medium tracking-widest uppercase glass animate-borderGlow">
            We&apos;re Getting Married
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-tight mb-4"
        >
          <span className="block">Harshavardhan</span>
          <span className="flex items-center justify-center gap-4 my-2">
            <span className="h-px w-12 sm:w-20" style={{ background: "var(--secondary)" }} />
            <span className="font-script text-3xl sm:text-4xl md:text-5xl" style={{ color: "var(--secondary)" }}>
              &amp;
            </span>
            <span className="h-px w-12 sm:w-20" style={{ background: "var(--secondary)" }} />
          </span>
          <span className="block">Indumathi</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-lg sm:text-xl mb-10 font-light tracking-wide"
          style={{ color: "var(--text-light)" }}
        >
          Together with their families, they invite you to celebrate their wedding
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mb-10"
        >
          <div className="glass-card inline-flex items-center gap-3 px-6 py-3 rounded-full mb-8">
            <span className="text-lg">📅</span>
            <span className="font-display text-lg">21<sup>st</sup> June, 2026 | 7:00 PM</span>
          </div>
        </motion.div>

        <Countdown targetDate={weddingDate} />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 0.8 }}
          className="mt-12"
        >
          <motion.a
            href="#events"
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="inline-flex flex-col items-center gap-1 text-sm tracking-widest uppercase font-medium"
            style={{ color: "var(--text-light)" }}
          >
            Scroll Down
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
            </svg>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
