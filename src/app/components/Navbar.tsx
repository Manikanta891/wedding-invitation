"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { themes, useTheme } from "./ThemeProvider";
import { backgrounds, useBackground } from "./BackgroundProvider";

const navLinks = [
  { label: "Home", href: "#hero" },
  { label: "Our Story", href: "#story" },
  { label: "Events", href: "#events" },
  { label: "Gallery", href: "#gallery" },
  { label: "Wishes", href: "#wishes" },
];

export default function Navbar() {
  const { currentTheme, setTheme } = useTheme();
  const { currentBg, setBackground } = useBackground();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showColors, setShowColors] = useState(false);
  const [showBgs, setShowBgs] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "glass shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-center gap-6 md:gap-10">
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium tracking-wide transition-colors duration-300 hover:opacity-70"
              style={{ color: "var(--text)" }}
            >
              {link.label}
            </a>
          ))}
        </div>

        <a href="#hero" className="font-script text-2xl font-semibold absolute left-4 md:static" style={{ color: "var(--primary-dark)" }}>
          H & I
        </a>

        <div className="hidden md:flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => { setShowColors(!showColors); setShowBgs(false); }}
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 hover:scale-110"
              style={{
                background: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`,
                color: "white",
              }}
              title="Color Themes"
            >
              C
            </button>
            <AnimatePresence>
              {showColors && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full right-0 mt-2 glass rounded-2xl p-3 shadow-xl flex gap-1.5"
                >
                  {themes.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => { setTheme(theme); setShowColors(false); }}
                      className={`theme-btn ${currentTheme.id === theme.id ? "active" : ""}`}
                      style={{
                        background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
                      }}
                      title={theme.name}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative">
            <button
              onClick={() => { setShowBgs(!showBgs); setShowColors(false); }}
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 hover:scale-110"
              style={{
                background: `linear-gradient(135deg, ${currentBg.colors.bg}, ${currentBg.colors.accent})`,
                color: currentBg.id === "dark-elegance" || currentBg.id === "starry" ? "white" : "var(--text)",
                border: "1px solid var(--glass-border)",
              }}
              title="Background Themes"
            >
              B
            </button>
            <AnimatePresence>
              {showBgs && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full right-0 mt-2 glass rounded-2xl p-3 shadow-xl flex gap-1.5"
                >
                  {backgrounds.map((bg) => (
                    <button
                      key={bg.id}
                      onClick={() => { setBackground(bg); setShowBgs(false); }}
                      className={`theme-btn ${currentBg.id === bg.id ? "active" : ""}`}
                      style={{
                        background: `linear-gradient(135deg, ${bg.colors.bg}, ${bg.colors.accent})`,
                        border: currentBg.id === bg.id ? "2px solid var(--text)" : "2px solid transparent",
                      }}
                      title={bg.name}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <button
          className="md:hidden p-2 absolute right-4"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{ color: "var(--text)" }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="glass md:hidden overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-medium py-1"
                  style={{ color: "var(--text)" }}
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-2 border-t space-y-2" style={{ borderColor: "var(--glass-border)" }}>
                <p className="text-[10px] uppercase tracking-widest font-medium" style={{ color: "var(--text-light)" }}>Colors</p>
                <div className="flex gap-2">
                  {themes.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => { setTheme(theme); setMobileOpen(false); }}
                      className={`theme-btn ${currentTheme.id === theme.id ? "active" : ""}`}
                      style={{ background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})` }}
                      title={theme.name}
                    />
                  ))}
                </div>
                <p className="text-[10px] uppercase tracking-widest font-medium pt-1" style={{ color: "var(--text-light)" }}>Backgrounds</p>
                <div className="flex gap-2">
                  {backgrounds.map((bg) => (
                    <button
                      key={bg.id}
                      onClick={() => { setBackground(bg); setMobileOpen(false); }}
                      className={`theme-btn ${currentBg.id === bg.id ? "active" : ""}`}
                      style={{ background: `linear-gradient(135deg, ${bg.colors.bg}, ${bg.colors.accent})` }}
                      title={bg.name}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
