"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Theme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
  };
}

export const themes: Theme[] = [
  { id: "baby-pink", name: "Baby Pink", colors: { primary: "#F5B7C5", secondary: "#D4AF37" } },
  { id: "rose-gold", name: "Rose Gold", colors: { primary: "#E8A0BF", secondary: "#C9A96E" } },
  { id: "lavender", name: "Lavender", colors: { primary: "#C9B8E8", secondary: "#C0C0C0" } },
  { id: "royal-blue", name: "Royal Blue", colors: { primary: "#4A7BB5", secondary: "#D4AF37" } },
  { id: "emerald", name: "Emerald", colors: { primary: "#7BB58A", secondary: "#D4AF37" } },
  { id: "peach", name: "Peach", colors: { primary: "#FFC8A2", secondary: "#FF6B6B" } },
];

interface ThemeContextType {
  currentTheme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes[0]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("wedding-theme");
    if (saved) {
      const found = themes.find((t) => t.id === saved);
      if (found) setCurrentTheme(found);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.setAttribute("data-theme", currentTheme.id);
      localStorage.setItem("wedding-theme", currentTheme.id);
    }
  }, [currentTheme, mounted]);

  const setTheme = (theme: Theme) => setCurrentTheme(theme);

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
