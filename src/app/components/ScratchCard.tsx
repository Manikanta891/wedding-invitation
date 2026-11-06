"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ScratchCardProps {
  label: string;
  value: string;
  subtext?: string;
  onRevealed?: () => void;
}

export default function ScratchCard({
  label,
  value,
  subtext,
  onRevealed,
}: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isScratching, setIsScratching] = useState(false);
  const [scratchPercent, setScratchPercent] = useState(0);

  // Initialize Canvas
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Luxury gold foil gradient
    const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    gradient.addColorStop(0, "#C59B27");
    gradient.addColorStop(0.25, "#F7E07F");
    gradient.addColorStop(0.5, "#D4AF37");
    gradient.addColorStop(0.75, "#B38728");
    gradient.addColorStop(1, "#F3E08B");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Subtle metallic glitter specs
    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    for (let i = 0; i < 40; i++) {
      const x = Math.random() * rect.width;
      const y = Math.random() * rect.height;
      const r = Math.random() * 2 + 1;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Border pattern
    ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
    ctx.lineWidth = 2;
    ctx.strokeRect(6, 6, rect.width - 12, rect.height - 12);

    // Text on canvas: "Scratch Here"
    ctx.fillStyle = "#5A3805";
    ctx.font = "bold 12px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("✦ SCRATCH HERE ✦", rect.width / 2, rect.height / 2 - 8);

    ctx.fillStyle = "#7A4F0B";
    ctx.font = "10px sans-serif";
    ctx.fillText("Rub or Tap to reveal", rect.width / 2, rect.height / 2 + 12);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      initCanvas();
    }, 50);

    const handleResize = () => {
      if (!isRevealed) initCanvas();
    };

    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, [initCanvas, isRevealed]);

  // Scratch action
  const scratch = (clientX: number, clientY: number) => {
    if (isRevealed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const x = (clientX - rect.left) * dpr;
    const y = (clientY - rect.top) * dpr;

    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x / dpr, y / dpr, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Calculate scratched percentage roughly
    checkProgress();
  };

  const checkProgress = () => {
    if (isRevealed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const w = Math.floor(rect.width * dpr);
    const h = Math.floor(rect.height * dpr);

    // Sample pixels
    try {
      const imgData = ctx.getImageData(0, 0, w, h);
      const data = imgData.data;
      let clearPixels = 0;
      const step = 24; // sampling step
      let totalSampled = 0;

      for (let i = 3; i < data.length; i += 4 * step) {
        totalSampled++;
        if (data[i] === 0) {
          clearPixels++;
        }
      }

      const percent = Math.round((clearPixels / totalSampled) * 100);
      setScratchPercent(percent);

      if (percent >= 38) {
        handleReveal();
      }
    } catch {
      // Fallback
    }
  };

  const handleReveal = () => {
    setIsRevealed(true);
    if (onRevealed) onRevealed();
  };

  // Mouse handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsScratching(true);
    scratch(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isScratching) return;
    scratch(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    setIsScratching(false);
  };

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1) {
      setIsScratching(true);
      scratch(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isScratching || e.touches.length !== 1) return;
    scratch(e.touches[0].clientX, e.touches[0].clientY);
  };

  const handleTouchEnd = () => {
    setIsScratching(false);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[180px] sm:max-w-[210px] aspect-[4/5] rounded-2xl overflow-hidden shadow-lg border border-amber-300/40 bg-gradient-to-b from-amber-50/90 to-amber-100/70 p-1 flex flex-col justify-between group transition-all duration-300 hover:shadow-amber-200/50"
    >
      {/* Underlying Content (Revealed Date Element) */}
      <div className="w-full h-full rounded-xl bg-white/90 p-4 flex flex-col items-center justify-between text-center select-none border border-amber-200/60 shadow-inner">
        <span className="text-[11px] sm:text-xs font-semibold tracking-widest uppercase text-amber-800/80">
          {label}
        </span>

        <motion.div
          animate={isRevealed ? { scale: [0.9, 1.12, 1], rotate: [0, -2, 2, 0] } : {}}
          transition={{ duration: 0.6 }}
          className="my-auto py-2"
        >
          <span className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-900 block bg-gradient-to-r from-amber-700 via-amber-600 to-amber-800 bg-clip-text text-transparent drop-shadow-sm">
            {value}
          </span>
          {subtext && (
            <span className="text-[10px] text-neutral-500 font-medium tracking-wider uppercase mt-1 block">
              {subtext}
            </span>
          )}
        </motion.div>

        <div className="flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
          <span>✓</span>
          <span>{isRevealed ? "Unlocked" : "Ready"}</span>
        </div>
      </div>

      {/* Canvas Scratch Foil Layer */}
      <AnimatePresence>
        {!isRevealed && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 z-20 cursor-pointer touch-none"
          >
            <canvas
              ref={canvasRef}
              className="w-full h-full rounded-2xl block"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            />

            {/* Quick Tap Reveal Button for effortless interaction */}
            <button
              type="button"
              onClick={handleReveal}
              className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] font-semibold uppercase tracking-wider text-amber-950 bg-white/80 hover:bg-white px-2.5 py-0.5 rounded-full shadow-sm backdrop-blur-sm transition-all border border-amber-300"
            >
              {scratchPercent > 5 ? `${scratchPercent}% Scratch` : "Tap Reveal"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

