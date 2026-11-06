"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface BackgroundTheme {
  id: string;
  name: string;
  colors: {
    bg: string;
    accent: string;
  };
}

export const backgrounds: BackgroundTheme[] = [
  { id: "soft-glow", name: "Soft Glow", colors: { bg: "#FFF5F7", accent: "#FFE4EC" } },
  { id: "dark-elegance", name: "Dark Elegance", colors: { bg: "#1a1020", accent: "#2a1a30" } },
  { id: "floral", name: "Floral", colors: { bg: "#FFF8F0", accent: "#F5E6D3" } },
  { id: "sunset", name: "Sunset", colors: { bg: "#FFF0E8", accent: "#FFD4C4" } },
  { id: "starry", name: "Starry Night", colors: { bg: "#0D0D1A", accent: "#1A1A3A" } },
  { id: "nature", name: "Nature", colors: { bg: "#F0FFF0", accent: "#D4EDDA" } },
];

interface BackgroundContextType {
  currentBg: BackgroundTheme;
  setBackground: (bg: BackgroundTheme) => void;
}

const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined);

export function BackgroundProvider({ children }: { children: ReactNode }) {
  const [currentBg, setCurrentBg] = useState<BackgroundTheme>(backgrounds[0]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      const saved = localStorage.getItem("wedding-bg");
      if (saved) {
        const found = backgrounds.find((b) => b.id === saved);
        if (found) setCurrentBg(found);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.setAttribute("data-bg", currentBg.id);
      localStorage.setItem("wedding-bg", currentBg.id);
    }
  }, [currentBg, mounted]);

  const setBackground = (bg: BackgroundTheme) => setCurrentBg(bg);

  return (
    <BackgroundContext.Provider value={{ currentBg, setBackground }}>
      {children}
    </BackgroundContext.Provider>
  );
}

export function useBackground() {
  const ctx = useContext(BackgroundContext);
  if (!ctx) throw new Error("useBackground must be used within BackgroundProvider");
  return ctx;
}
