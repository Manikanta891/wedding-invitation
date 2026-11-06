"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import TemplateCard, { TemplateData } from "./components/TemplateCard";
import { defaultTemplates } from "@/lib/defaultTemplates";

export default function HomePage() {
  const [templates, setTemplates] = useState<TemplateData[]>(defaultTemplates);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    fetch("/api/templates")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setTemplates(data);
        }
      })
      .catch((err) => console.warn("Using offline templates:", err));
  }, []);

  const categories = [
    { id: "all", label: "All Collections" },
    { id: "wedding", label: "Wedding Invitations" },
    { id: "wishes", label: "Wishes & Keepsakes" },
    { id: "birthday", label: "Birthday Galas" },
    { id: "anniversary", label: "Anniversaries" },
  ];

  const filteredTemplates =
    selectedCategory === "all"
      ? templates
      : templates.filter((t) => t.category === selectedCategory);

  const featuredTemplates = templates.filter((t) => t.isFeatured).slice(0, 3);

  const faqs = [
    {
      q: "How do guests open and experience the digital invitation?",
      a: "Guests receive a private, unique URL via WhatsApp, SMS, or email. When they tap the link on any smartphone, tablet, or desktop, an elegant 3D wax-seal envelope opens automatically to reveal your personalized invitation, soundtrack, love story, schedule, venue maps, and RSVP form.",
    },
    {
      q: "Can we include our own background music and photos?",
      a: "Yes! Every template supports custom background instrumental or romantic audio, high-resolution photo galleries, engagement portraits, and custom love story milestones.",
    },
    {
      q: "How does RSVP and guest tracking work?",
      a: "Guests confirm their attendance directly on the invitation page in one click. As the host, you can track live headcounts, dietary requirements, and guest messages from the platform.",
    },
    {
      q: "How does the ordering and customization process work?",
      a: "Simply browse our gallery, select your preferred template, and submit your event details through our online order form. Our design team will contact you, collect your photos and music preferences, prepare your custom invitation, and deliver your live link.",
    },
    {
      q: "Can we update event timings or venue details after sharing?",
      a: "Absolutely! Unlike traditional paper invitations where typos or venue changes require expensive reprints, your digital invitation updates immediately in real-time.",
    },
  ];

  return (
    <main className="min-h-screen text-neutral-800 pt-20">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-24 md:pt-20 md:pb-36">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Copy */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="lg:col-span-7 text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase bg-amber-100/80 border border-amber-300/60 text-amber-900 mb-6 backdrop-blur-sm">
                <span>✨</span> The Modern Standard For Celebrations
              </div>

              <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-neutral-900 leading-[1.15] mb-6">
                Bespoke Digital Invitations for{" "}
                <span className="glossy-text italic font-serif">Timeless</span> Moments.
              </h1>

              <p className="text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed mb-8 font-light">
                Elevate your wedding and milestone celebrations with immersive 3D animated
                envelopes, background music, live guest RSVPs, interactive venue maps, and
                cinematic photo galleries — delivered instantly via WhatsApp.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  href="/templates"
                  className="w-full sm:w-auto px-8 py-4 rounded-full text-sm font-semibold tracking-wider uppercase text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-center"
                  style={{
                    background: "linear-gradient(135deg, #D4AF37, #B8860B)",
                  }}
                >
                  Explore All Templates →
                </Link>

                <Link
                  href="/preview/royal-palace"
                  className="w-full sm:w-auto px-8 py-4 rounded-full text-sm font-semibold tracking-wider uppercase glass-card border border-neutral-300 text-neutral-800 hover:bg-neutral-100/80 transition-all text-center flex items-center justify-center gap-2"
                >
                  <span>💌</span> Experience Live Preview
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="mt-12 pt-8 border-t border-neutral-200/60 grid grid-cols-3 gap-4 text-center lg:text-left">
                <div>
                  <div className="font-display text-2xl sm:text-3xl font-bold text-neutral-900">
                    100%
                  </div>
                  <div className="text-xs text-neutral-500 uppercase tracking-wider font-medium">
                    Eco-Friendly
                  </div>
                </div>
                <div>
                  <div className="font-display text-2xl sm:text-3xl font-bold text-amber-700">
                    Instant
                  </div>
                  <div className="text-xs text-neutral-500 uppercase tracking-wider font-medium">
                    WhatsApp Sharing
                  </div>
                </div>
                <div>
                  <div className="font-display text-2xl sm:text-3xl font-bold text-neutral-900">
                    Live
                  </div>
                  <div className="text-xs text-neutral-500 uppercase tracking-wider font-medium">
                    RSVP & Headcounts
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right 3D Visual Mockup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative mx-auto max-w-sm sm:max-w-md">
                {/* Glowing Aura */}
                <div className="absolute -inset-4 bg-gradient-to-r from-amber-200 to-rose-200 rounded-3xl blur-2xl opacity-50" />

                {/* Main Floating Card */}
                <div className="relative glass-card rounded-3xl p-6 sm:p-8 border border-white/80 shadow-2xl bg-white/80">
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-6 shadow-md">
                    <Image
                      src="/photos/L-1.jpeg"
                      alt="Featured Wedding Invitation"
                      fill
                      priority
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-amber-500/90 text-white backdrop-blur-md shadow-sm">
                        Live Preview Mode
                      </span>
                    </div>

                    <div className="absolute bottom-6 left-6 right-6 text-white text-center">
                      <span className="text-xs uppercase tracking-widest font-medium text-amber-200">
                        Wedding Celebration
                      </span>
                      <h3 className="font-display text-2xl sm:text-3xl font-bold my-1">
                        Harshavardhan & Indumathi
                      </h3>
                      <p className="text-xs text-neutral-200 font-light">
                        21st June, 2026 • Narsipatnam
                      </p>
                    </div>
                  </div>

                  {/* Envelope Seal Teaser Action */}
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-50/70 border border-amber-200/60">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-white text-lg shadow-sm">
                        ✉️
                      </div>
                      <div>
                        <div className="text-xs font-bold text-neutral-900">
                          Animated Envelope Included
                        </div>
                        <div className="text-[11px] text-neutral-500">
                          Tap to open & experience audio
                        </div>
                      </div>
                    </div>

                    <Link
                      href="/preview/royal-palace"
                      className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-amber-800 bg-amber-100 hover:bg-amber-200 transition-colors"
                    >
                      Open →
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED DESIGNS */}
      <section className="py-20 bg-white/40 border-y border-neutral-200/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-amber-700">
                Curated Luxury
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-neutral-900 mt-2">
                Featured Invitation Designs
              </h2>
            </div>
            <Link
              href="/templates"
              className="mt-4 md:mt-0 text-sm font-semibold text-amber-800 hover:text-amber-950 flex items-center gap-1.5 transition-colors"
            >
              View Full Gallery ({templates.length} Designs) →
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredTemplates.map((template, idx) => (
              <TemplateCard key={template.slug} template={template} priority={idx === 0} />
            ))}
          </div>
        </div>
      </section>

      {/* 3. COLLECTIONS BROWSER */}
      <section id="collections" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs uppercase font-bold tracking-widest text-amber-700">
              Versatile Celebrations
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-bold text-neutral-900 mt-2 mb-4">
              Explore By Occasion
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 font-light">
              Each invitation template is completely bespoke, featuring customizable color palettes,
              typography, photo vaults, and event timelines.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mb-14">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 ${
                  selectedCategory === cat.id
                    ? "bg-neutral-900 text-white shadow-md scale-105"
                    : "bg-white/80 text-neutral-600 hover:bg-neutral-100 border border-neutral-200/80"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Filtered Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTemplates.map((template) => (
              <TemplateCard key={template.slug} template={template} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. PAPER VS DIGITAL COMPARISON */}
      <section className="py-24 bg-gradient-to-b from-amber-50/40 via-white to-amber-50/40 border-y border-neutral-200/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase font-bold tracking-widest text-amber-700">
              The Smarter Choice
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-neutral-900 mt-2 mb-4">
              Paper Invitations vs. My Beloved Digital
            </h2>
            <p className="text-sm text-neutral-600">
              See why modern couples and event planners are transitioning entirely to interactive digital experiences.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Paper Card */}
            <div className="glass-card rounded-3xl p-8 border border-neutral-200/80 bg-white/60">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">✉️</span>
                <div>
                  <h3 className="font-display text-xl font-bold text-neutral-700">
                    Traditional Paper Invitations
                  </h3>
                  <span className="text-xs text-neutral-500">Outdated, static, and costly</span>
                </div>
              </div>

              <ul className="space-y-4 text-sm text-neutral-600">
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-bold">✕</span>
                  <span>Heavy carbon footprint & 100% paper waste thrown away after the event.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-bold">✕</span>
                  <span>Weeks of printing delays, courier loss, and incorrect postage addresses.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-bold">✕</span>
                  <span>Manual guest headcount tracking requiring dozens of uncomfortable follow-up calls.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-bold">✕</span>
                  <span>Typo or date/venue changes require expensive total reprints.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-bold">✕</span>
                  <span>No music, no photo gallery, no Google Maps venue directions.</span>
                </li>
              </ul>
            </div>

            {/* Digital Card */}
            <div className="glass-card rounded-3xl p-8 border-2 border-amber-400 bg-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] uppercase font-bold tracking-widest px-4 py-1 rounded-bl-xl">
                Recommended
              </div>

              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">✨</span>
                <div>
                  <h3 className="font-display text-xl font-bold text-neutral-900">
                    My Beloved Digital Platform
                  </h3>
                  <span className="text-xs text-amber-700 font-medium">
                    Modern, immersive & effortless
                  </span>
                </div>
              </div>

              <ul className="space-y-4 text-sm text-neutral-700">
                <li className="flex items-start gap-3">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span><strong>Zero waste & eco-friendly</strong>: 100% digital and sustainable.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span><strong>Instant 1-Click WhatsApp delivery</strong> to hundreds of guests globally.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span><strong>Live RSVP & Headcount dashboard</strong> with instant guest confirmations.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span><strong>Real-time updates</strong>: Edit timings or venue anytime without re-printing.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span><strong>Interactive features</strong>: Background music, Google Maps directions, love story & photo wall.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FEATURES OVERVIEW */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase font-bold tracking-widest text-amber-700">
              Interactive Capabilities
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-bold text-neutral-900 mt-2 mb-4">
              Everything Your Celebration Needs
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 font-light">
              Designed from the ground up to captivate your guests and simplify event coordination.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: "💌",
                title: "3D Animated Envelope",
                desc: "Realistic wax-seal opening animation that surprises and delights guests the moment they tap your link.",
              },
              {
                icon: "🎵",
                title: "Romantic Background Audio",
                desc: "Add your couple's favorite song or acoustic instrumental that plays gently during viewing.",
              },
              {
                icon: "⏳",
                title: "Live Precision Countdown",
                desc: "Real-time days, hours, and minutes ticking down to the exact moment of your celebration.",
              },
              {
                icon: "📍",
                title: "Google Maps Navigation",
                desc: "Integrated one-tap GPS navigation directs guests effortlessly to your wedding and reception halls.",
              },
              {
                icon: "📸",
                title: "Photo & Video Gallery",
                desc: "Showcase pre-wedding shoots, proposal moments, and family portraits in an elegant responsive lightbox.",
              },
              {
                icon: "📝",
                title: "One-Click Guest RSVP",
                desc: "Guests confirm attendance, headcounts, and dietary needs in seconds — viewable in your dashboard.",
              },
              {
                icon: "💫",
                title: "Interactive Love Story",
                desc: "A beautifully animated timeline narrating how you met, your proposal, and your journey to the altar.",
              },
              {
                icon: "💖",
                title: "Guest Wishes Wall",
                desc: "Family and friends leave heartfelt blessings and warm wishes that remain forever preserved.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="glass-card rounded-2xl p-6 bg-white/70 border border-neutral-200/60 hover:shadow-lg transition-all"
              >
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-display text-lg font-bold text-neutral-900 mb-2">
                  {f.title}
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed font-light">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. HOW IT WORKS */}
      <section id="how-it-works" className="py-24 bg-white/50 border-y border-neutral-200/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase font-bold tracking-widest text-amber-700">
              Simple 4-Step Process
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-neutral-900 mt-2 mb-4">
              How It Works
            </h2>
            <p className="text-sm text-neutral-600">
              From design selection to your guests&apos; hands in just a few seamless steps.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {[
              {
                step: "01",
                title: "Select a Design",
                desc: "Browse our curated collection of luxury wedding, anniversary, and party templates and test live previews.",
              },
              {
                step: "02",
                title: "Share Event Details",
                desc: "Fill out the simple order form with your dates, venue, love story milestones, and optional photos.",
              },
              {
                step: "03",
                title: "Dedicated Customization",
                desc: "Our team formats your invitation, adds your custom soundtrack, and configures RSVP and maps.",
              },
              {
                step: "04",
                title: "Share via WhatsApp",
                desc: "Receive your bespoke invitation link with rich preview cards ready to send to friends and family worldwide.",
              },
            ].map((st) => (
              <div key={st.step} className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full glass-card border-2 border-amber-400 flex items-center justify-center font-display text-xl font-bold text-amber-800 mb-5 shadow-sm">
                  {st.step}
                </div>
                <h3 className="font-display text-lg font-bold text-neutral-900 mb-2">
                  {st.title}
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed font-light">
                  {st.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-14">
            <Link
              href="/order"
              className="inline-block px-8 py-3.5 rounded-full text-xs font-semibold tracking-wider uppercase text-white shadow-md hover:shadow-lg transition-all"
              style={{
                background: "linear-gradient(135deg, #D4AF37, #B8860B)",
              }}
            >
              Start Your Invitation Order →
            </Link>
          </div>
        </div>
      </section>

      {/* 7. TESTIMONIALS */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase font-bold tracking-widest text-amber-700">
              Celebration Stories
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-neutral-900 mt-2 mb-4">
              Loved by Happy Couples
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "Our guests were completely blown away by the 3D envelope and background music! Getting RSVPs on WhatsApp was 100x easier than paper cards.",
                author: "Ananya & Rohit",
                location: "Destination Wedding, Udaipur",
                stars: "★★★★★",
              },
              {
                quote:
                  "The interactive Google Maps and schedule timeline saved our guests so much confusion. Everyone arrived on time and loved the love story section!",
                author: "Pooja & Siddharth",
                location: "Grand Celebration, Hyderabad",
                stars: "★★★★★",
              },
              {
                quote:
                  "We decided to go paperless for our golden anniversary and this platform exceeded all expectations. The guest wishes wall made my parents cry tears of joy.",
                author: "Rohan & Family",
                location: "Anniversary Gala, Bengaluru",
                stars: "★★★★★",
              },
            ].map((t) => (
              <div
                key={t.author}
                className="glass-card rounded-3xl p-8 bg-white/70 border border-neutral-200/60 flex flex-col justify-between"
              >
                <div>
                  <div className="text-amber-500 text-sm tracking-widest mb-3">
                    {t.stars}
                  </div>
                  <p className="text-sm text-neutral-700 italic leading-relaxed mb-6 font-light">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>
                <div>
                  <div className="font-display font-bold text-neutral-900">
                    {t.author}
                  </div>
                  <div className="text-xs text-neutral-500 font-medium">
                    {t.location}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FAQ ACCORDION */}
      <section id="faq" className="py-20 bg-white/40 border-t border-neutral-200/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-xs uppercase font-bold tracking-widest text-amber-700">
              Got Questions?
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-neutral-900 mt-2">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={faq.q}
                  className="glass-card rounded-2xl overflow-hidden border border-neutral-200/70 bg-white/80"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4"
                  >
                    <span className="font-display font-semibold text-base sm:text-lg text-neutral-900">
                      {faq.q}
                    </span>
                    <span className="text-amber-700 font-bold text-xl">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="px-5 pb-5 text-sm text-neutral-600 leading-relaxed font-light border-t border-neutral-100 pt-3"
                      >
                        {faq.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 9. CTA BANNER */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="rounded-3xl p-10 sm:p-14 text-center text-white relative overflow-hidden shadow-2xl"
            style={{
              background: "linear-gradient(135deg, #4A2C3A, #2A1A22)",
            }}
          >
            <div className="relative z-10 max-w-2xl mx-auto">
              <span className="text-xs uppercase font-bold tracking-widest text-amber-300">
                Ready to celebrate?
              </span>
              <h2 className="font-display text-3xl sm:text-5xl font-bold mt-2 mb-6">
                Create Your Dream Digital Invitation Today.
              </h2>
              <p className="text-neutral-300 text-sm sm:text-base mb-8 font-light">
                Delight your guests with a bespoke invitation tailored exclusively to your love story.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/templates"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-amber-400 text-neutral-950 hover:bg-amber-300 transition-colors"
                >
                  Browse Designs
                </Link>
                <Link
                  href="/contact"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full text-xs font-semibold tracking-wider uppercase border border-white/30 text-white hover:bg-white/10 transition-colors"
                >
                  Contact Our Studio
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. PLATFORM FOOTER */}
      <footer className="bg-neutral-900 text-neutral-300 pt-16 pb-12 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-12 border-b border-neutral-800">
            <div className="col-span-2 md:col-span-1">
              <span className="font-display text-2xl font-bold text-white tracking-wide">
                My Beloved
              </span>
              <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                Bespoke digital invitations, interactive envelopes, and guest management for weddings and timeless celebrations.
              </p>
            </div>

            <div>
              <h4 className="font-display font-semibold text-sm text-white mb-3">
                Collections
              </h4>
              <ul className="space-y-2 text-xs text-neutral-400">
                <li><Link href="/templates?category=wedding" className="hover:text-amber-400">Wedding Invitations</Link></li>
                <li><Link href="/templates?category=wishes" className="hover:text-amber-400">Wishes & Keepsakes</Link></li>
                <li><Link href="/templates?category=anniversary" className="hover:text-amber-400">Anniversary Milestones</Link></li>
                <li><Link href="/templates?category=birthday" className="hover:text-amber-400">Birthday Galas</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-display font-semibold text-sm text-white mb-3">
                Customer Service
              </h4>
              <ul className="space-y-2 text-xs text-neutral-400">
                <li><Link href="/contact" className="hover:text-amber-400">Contact & Support</Link></li>
                <li><Link href="/admin" className="hover:text-amber-400">Admin Portal</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-display font-semibold text-sm text-white mb-3">
                WhatsApp Support
              </h4>
              <p className="text-xs text-neutral-400 mb-3">
                Have questions or need custom design assistance?
              </p>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-500 transition-colors"
              >
                <span>💬</span> Chat on WhatsApp
              </a>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
            <div>
              &copy; {new Date().getFullYear()} My Beloved Digital Invitations. All rights reserved.
            </div>
            <div className="flex gap-6">
              <Link href="/contact" className="hover:text-neutral-400">Privacy Policy</Link>
              <Link href="/contact" className="hover:text-neutral-400">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
