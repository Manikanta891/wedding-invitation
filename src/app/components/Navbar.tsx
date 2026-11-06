"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const platformLinks = [
  { label: "Home", href: "/" },
  { label: "Templates", href: "/templates" },
  { label: "Features", href: "/#features" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "FAQ", href: "/#faq" },
  { label: "Contact", href: "/contact" },
];

const inviteLinks = [
  { label: "Home", href: "#hero" },
  { label: "Our Story", href: "#story" },
  { label: "Events", href: "#events" },
  { label: "Gallery", href: "#gallery" },
  { label: "Wishes", href: "#wishes" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isPreviewPage = pathname.startsWith("/preview");
  const isAdminPage = pathname.startsWith("/admin");
  const isInvitePage = pathname.startsWith("/invite");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Remove navbar in preview page and admin page
  if (isAdminPage || isPreviewPage) {
    return null;
  }

  const currentLinks = isInvitePage ? inviteLinks : platformLinks;

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass shadow-md py-2.5 backdrop-blur-md bg-white/70"
          : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href={isInvitePage ? "#hero" : "/"}
          className="flex items-center gap-2.5 group"
        >
          <div className="w-9 h-9 rounded-full glass-card flex items-center justify-center border border-amber-300/40 text-amber-700 shadow-sm transition-transform group-hover:scale-105 font-display text-sm font-bold tracking-tight">
            MB
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-lg tracking-wide text-neutral-800">
              {isInvitePage ? "H & I Wedding" : "My Beloved"}
            </span>
            {!isInvitePage && (
              <span className="text-[10px] uppercase tracking-widest text-neutral-500 -mt-1 font-medium">
                Digital Invitations
              </span>
            )}
          </div>
        </Link>

        {/* Desktop Links (Clean navigation without order or wishes buttons) */}
        <div className="hidden lg:flex items-center gap-8">
          {currentLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-xs uppercase tracking-widest font-medium text-neutral-700 hover:text-amber-700 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          className="lg:hidden p-2 rounded-lg text-neutral-700 hover:bg-neutral-100"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation menu"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            {mobileOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden glass border-t border-neutral-200/50 bg-white/95 px-6 py-5 overflow-hidden"
          >
            <div className="flex flex-col gap-3.5">
              {currentLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-medium text-neutral-800 py-1.5 border-b border-neutral-100 hover:text-amber-600"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
