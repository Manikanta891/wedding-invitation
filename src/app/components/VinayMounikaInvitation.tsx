"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import ScratchCard from "@/app/components/ScratchCard";
import PullDownCard from "@/app/components/PullDownCard";
import Wishes from "@/app/components/Wishes";
import { weddingAudio } from "@/lib/audioSynth";

export default function VinayMounikaInvitation({ templateSlug = "golden-anniversary" }: { templateSlug?: string }) {
  // Audio state
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);

  // RSVP Form state
  const [selectedAttendance, setSelectedAttendance] = useState<"yes" | "no" | null>(null);
  const [rsvpName, setRsvpName] = useState("");
  const [rsvpPhone, setRsvpPhone] = useState("");
  const [rsvpGuestCount, setRsvpGuestCount] = useState(1);
  const [rsvpNote, setRsvpNote] = useState("");
  const [rsvpSubmitting, setRsvpSubmitting] = useState(false);
  const [rsvpSuccess, setRsvpSuccess] = useState(false);

  const toggleMusic = () => {
    const isPlaying = weddingAudio.toggle();
    setIsPlayingMusic(isPlaying);
  };

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpName.trim()) return;

    setRsvpSubmitting(true);
    try {
      await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: rsvpName,
          phone: rsvpPhone || "Not provided",
          attending: selectedAttendance === "yes",
          guestCount: selectedAttendance === "yes" ? rsvpGuestCount : 0,
          eventsAttending: ["Haldi", "Reception", "Muhurtham"],
          dietaryPreference: "Vegetarian",
          message: rsvpNote,
        }),
      });
      setRsvpSuccess(true);
    } catch {
      setRsvpSuccess(true);
    } finally {
      setRsvpSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFFDF9] via-[#FAF4EA] to-[#FDF8EE] text-neutral-800 font-sans relative selection:bg-amber-200">
      {/* Decorative Traditional Border Accents */}
      <div className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-600 via-amber-300 to-amber-700 z-50" />

      {/* Floating Ambient Music & Action Controls */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <button
          type="button"
          onClick={toggleMusic}
          aria-label="Toggle ambient wedding melody"
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all shadow-md backdrop-blur-md border ${
            isPlayingMusic
              ? "bg-amber-500 text-white border-amber-400 animate-pulse"
              : "bg-white/90 text-neutral-700 hover:text-amber-900 border-amber-200"
          }`}
        >
          <span>{isPlayingMusic ? "🔊" : "🎵"}</span>
          <span className="hidden sm:inline">
            {isPlayingMusic ? "Music Playing" : "Play Music"}
          </span>
        </button>

        <Link
          href="/templates"
          className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium text-neutral-600 hover:text-neutral-900 bg-white/80 hover:bg-white border border-neutral-200 shadow-sm backdrop-blur-md transition-all"
        >
          ← Catalog
        </Link>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-20 sm:space-y-28">
        {/* ========================================================= */}
        {/* SECTION 1: INVOCATION & MAIN HEADER                       */}
        {/* ========================================================= */}
        <section className="text-center pt-8 sm:pt-12 relative">
          {/* Sanskrit Auspicious Invocation */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6 inline-block"
          >
            <div className="flex items-center justify-center gap-2 text-amber-700 mb-2">
              <span className="text-xl">ॐ</span>
              <span className="h-px w-8 bg-amber-400" />
              <span className="font-display tracking-widest text-xs sm:text-sm font-semibold uppercase text-amber-800">
                || Om Shri Ganeshay Namah ||
              </span>
              <span className="h-px w-8 bg-amber-400" />
              <span className="text-xl">ॐ</span>
            </div>
          </motion.div>

          {/* Invitation Intro Sentence */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-display text-base sm:text-lg md:text-xl text-neutral-700 max-w-2xl mx-auto leading-relaxed italic mb-8"
          >
            With immense joy and the blessings of our families, we cordially invite you to be a part of our wedding celebration
          </motion.p>

          {/* Couple Heading: Vinay with Mounika */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="py-4 my-2"
          >
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-neutral-900 leading-tight">
              <span className="block drop-shadow-sm">Vinay</span>
              <span className="flex items-center justify-center gap-4 my-2">
                <span className="h-px w-12 sm:w-24 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
                <span className="font-script text-3xl sm:text-4xl md:text-5xl text-amber-700 italic font-normal">
                  with
                </span>
                <span className="h-px w-12 sm:w-24 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
              </span>
              <span className="block drop-shadow-sm">Mounika</span>
            </h1>
          </motion.div>

          {/* Auspicious Flourish Ornament */}
          <div className="flex items-center justify-center gap-2 text-amber-500 mt-6 text-xl">
            <span>❦</span>
            <span className="text-xs">✦</span>
            <span>❦</span>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 2: INTERACTIVE SCRATCH CARDS (DATE REVEAL)         */}
        {/* ========================================================= */}
        <section className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mb-8"
          >
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest text-amber-900 bg-amber-100 border border-amber-300 shadow-sm mb-3">
              Mark the Auspicious Date
            </span>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-900">
              Scratch each card to reveal
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1">
              Rub with your finger or cursor to uncover our wedding calendar
            </p>
          </motion.div>

          {/* The 3 Scratch Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-6 max-w-2xl mx-auto justify-items-center">
            {/* Card 1: Day */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="w-full flex justify-center"
            >
              <ScratchCard label="Day" value="15" subtext="Saturday" />
            </motion.div>

            {/* Card 2: Month */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="w-full flex justify-center"
            >
              <ScratchCard label="Month" value="AUGUST" subtext="Shravana Masa" />
            </motion.div>

            {/* Card 3: Year */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="w-full flex justify-center"
            >
              <ScratchCard label="Year" value="2026" subtext="Forever Starts" />
            </motion.div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 3: MEET THE COUPLE (PULL DOWN CARDS)             */}
        {/* ========================================================= */}
        <section className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mb-10"
          >
            <span className="inline-block px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-widest text-amber-900 bg-amber-100 border border-amber-300 shadow-sm mb-3">
              Two Souls, One Destiny
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-900">
              Meet the Couple
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-2 max-w-md mx-auto">
              Pull down each card to unveil the blessings and families
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Groom Card: Vinay */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <PullDownCard
                role="Groom"
                name="Vinay"
                relation="Son of"
                parents="Madhusudhana Rao & Nirmala"
                image="/photos/S-1.jpeg"
                bio="An adventurous heart finding true companionship, ready to step into a sacred journey filled with mutual trust and eternal respect."
              />
            </motion.div>

            {/* Bride Card: Mounika */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <PullDownCard
                role="Bride"
                name="Mounika"
                relation="Daughter of"
                parents="Prabhakar Rao & Sudha Rani"
                image="/photos/S-2.jpeg"
                bio="A gentle soul with radiant warmth, cherishing family bonds and eagerly anticipating building a home overflowing with joy and love."
              />
            </motion.div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 4: LOVE STORY QUOTE & TOGETHER FOREVER           */}
        {/* ========================================================= */}
        <section className="text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="glass-card max-w-3xl mx-auto rounded-3xl p-8 sm:p-12 border border-amber-300 shadow-xl bg-gradient-to-br from-white/90 via-amber-50/50 to-amber-100/40 relative overflow-hidden"
          >
            <div className="absolute top-3 left-4 text-4xl text-amber-300/40 font-serif">“</div>
            <div className="absolute bottom-1 right-4 text-4xl text-amber-300/40 font-serif">”</div>

            <span className="text-3xl text-amber-600 block mb-3">♥</span>

            <blockquote className="font-display text-lg sm:text-2xl md:text-3xl text-neutral-800 leading-relaxed font-medium italic mb-6">
              Every journey has a beginning, every story has a chapter, and every heart has its soulmate. Together, we begin our forever ♥
            </blockquote>

            <div className="inline-flex items-center gap-3">
              <span className="h-px w-10 bg-amber-400" />
              <span className="font-display text-sm sm:text-base font-bold tracking-widest uppercase text-amber-900">
                Together Forever
              </span>
              <span className="h-px w-10 bg-amber-400" />
            </div>
          </motion.div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 5: EVENT TIMELINE (HALDI, RECEPTION, MUHURTHAM)   */}
        {/* ========================================================= */}
        <section className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mb-12"
          >
            <span className="inline-block px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-widest text-amber-900 bg-amber-100 border border-amber-300 shadow-sm mb-3">
              Celebration Schedule
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-900">
              Event Timeline
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-2">
              Join us in our sacred ceremonies and joyful festivities
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* 1. Haldi */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="glass-card rounded-2xl p-6 sm:p-7 border border-amber-300/80 bg-white/90 shadow-md flex flex-col justify-between hover:shadow-lg transition-all"
            >
              <div>
                <div className="w-12 h-12 mx-auto rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-xl mb-4 text-amber-700">
                  🌼
                </div>
                <h3 className="font-display text-2xl font-bold text-neutral-900 mb-2">
                  Haldi
                </h3>
                <p className="text-xs text-neutral-500 mb-4 leading-relaxed">
                  Sacred turmeric blessings, traditional music, and vibrant colors with beloved relatives.
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-amber-200/80">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold text-amber-900 bg-amber-100 border border-amber-300">
                  14 AUG · 4:00 PM onwards
                </span>
              </div>
            </motion.div>

            {/* 2. Reception */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="glass-card rounded-2xl p-6 sm:p-7 border border-amber-300/80 bg-white/90 shadow-md flex flex-col justify-between hover:shadow-lg transition-all"
            >
              <div>
                <div className="w-12 h-12 mx-auto rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-xl mb-4 text-amber-700">
                  🥂
                </div>
                <h3 className="font-display text-2xl font-bold text-neutral-900 mb-2">
                  Reception
                </h3>
                <p className="text-xs text-neutral-500 mb-4 leading-relaxed">
                  An enchanting evening of joyous dining, photography, and felicitations for the newly weds.
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-amber-200/80">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold text-amber-900 bg-amber-100 border border-amber-300">
                  15 AUG · 12:00 PM onwards
                </span>
              </div>
            </motion.div>

            {/* 3. Muhurtham */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="glass-card rounded-2xl p-6 sm:p-7 border-2 border-amber-400 bg-gradient-to-b from-amber-50/90 to-white/95 shadow-lg flex flex-col justify-between hover:shadow-xl transition-all"
            >
              <div>
                <div className="w-12 h-12 mx-auto rounded-full bg-amber-200 border border-amber-400 flex items-center justify-center text-xl mb-4 text-amber-800">
                  🪔
                </div>
                <h3 className="font-display text-2xl font-bold text-neutral-900 mb-2">
                  Muhurtham
                </h3>
                <p className="text-xs text-neutral-600 mb-4 leading-relaxed font-medium">
                  The sacred Mangalya Dharana wedding ceremony sealing eternal vows under Vedic mantras.
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-amber-300">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-extrabold text-white bg-gradient-to-r from-amber-600 to-amber-700 shadow-sm">
                  16 AUG · 12:27 AM
                </span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 6: VENUES (SSV CONVENTIONS & GOOGLE MAPS)         */}
        {/* ========================================================= */}
        <section className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mb-10"
          >
            <span className="inline-block px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-widest text-amber-900 bg-amber-100 border border-amber-300 shadow-sm mb-3">
              Location &amp; Directions
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-900">
              Venues
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-2 max-w-md mx-auto">
              Celebrate with us across each beautiful venue.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="glass-card max-w-2xl mx-auto rounded-3xl p-8 sm:p-10 border border-amber-300/80 bg-white/95 shadow-xl text-center space-y-6"
          >
            <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-3xl text-amber-700">
              🏛️
            </div>

            <div>
              <h3 className="font-display text-3xl sm:text-4xl font-bold text-neutral-900 tracking-tight">
                SSV Conventions
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 font-medium mt-2">
                SSV Conventions • Sunday, 16 August 2026 • 12:27 AM
              </p>
            </div>

            <p className="text-xs text-neutral-500 max-w-md mx-auto leading-relaxed">
              Grand banquet hall equipped with ample parking, air-conditioned hospitality suites, and traditional dining arrangements.
            </p>

            <div className="pt-2">
              <a
                href="https://maps.app.goo.gl/ZBZFrSUKxKm6o1p59"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                style={{
                  background: "linear-gradient(135deg, #D4AF37, #B8860B)",
                }}
              >
                <span>📍</span>
                <span>Open in Google Maps</span>
                <span className="text-xs">↗</span>
              </a>
            </div>
          </motion.div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 7: RSVP - WILL YOU JOIN US?                      */}
        {/* ========================================================= */}
        <section className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mb-8"
          >
            <span className="inline-block px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-widest text-amber-900 bg-amber-100 border border-amber-300 shadow-sm mb-3">
              RSVP Confirmation
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-900">
              Will You Join Us?
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-2">
              Kindly let us know if you will be present
            </p>
          </motion.div>

          <div className="max-w-xl mx-auto glass-card rounded-3xl p-6 sm:p-8 border border-amber-300/80 bg-white/95 shadow-xl">
            {rsvpSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 text-center space-y-3"
              >
                <span className="text-5xl block mb-2">🎉</span>
                <h4 className="font-display text-2xl font-bold text-emerald-800">
                  Thank You for Responding!
                </h4>
                <p className="text-xs sm:text-sm text-neutral-600 max-w-sm mx-auto">
                  Your presence means the world to Vinay &amp; Mounika and our families. We look forward to celebrating together!
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setRsvpSuccess(false);
                    setSelectedAttendance(null);
                  }}
                  className="mt-4 px-4 py-1.5 rounded-full text-xs font-semibold text-neutral-600 hover:text-neutral-900 border border-neutral-300"
                >
                  Submit Another Response
                </button>
              </motion.div>
            ) : (
              <div>
                {/* 2 Big Choice Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <button
                    type="button"
                    onClick={() => setSelectedAttendance("yes")}
                    className={`py-3.5 px-4 rounded-2xl text-xs sm:text-sm font-bold tracking-wide border-2 transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer ${
                      selectedAttendance === "yes"
                        ? "bg-emerald-600 text-white border-emerald-600 scale-[1.02]"
                        : "bg-emerald-50/70 text-emerald-900 border-emerald-200 hover:bg-emerald-100"
                    }`}
                  >
                    <span>✓</span>
                    <span>Yes, with pleasure</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedAttendance("no")}
                    className={`py-3.5 px-4 rounded-2xl text-xs sm:text-sm font-bold tracking-wide border-2 transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer ${
                      selectedAttendance === "no"
                        ? "bg-neutral-800 text-white border-neutral-800 scale-[1.02]"
                        : "bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100"
                    }`}
                  >
                    <span>✕</span>
                    <span>Unable to attend</span>
                  </button>
                </div>

                {/* Extended Details Form on Selection */}
                <AnimatePresence>
                  {selectedAttendance && (
                    <motion.form
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.4 }}
                      onSubmit={handleRsvpSubmit}
                      className="space-y-4 pt-2 text-left"
                    >
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 mb-1">
                          Your Name / Family Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Ramesh & Family"
                          value={rsvpName}
                          onChange={(e) => setRsvpName(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-neutral-700 mb-1">
                            Phone / WhatsApp
                          </label>
                          <input
                            type="tel"
                            placeholder="e.g. 9876543210"
                            value={rsvpPhone}
                            onChange={(e) => setRsvpPhone(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                          />
                        </div>

                        {selectedAttendance === "yes" && (
                          <div>
                            <label className="block text-xs font-semibold text-neutral-700 mb-1">
                              Number of Guests Attending
                            </label>
                            <input
                              type="number"
                              min="1"
                              max="12"
                              value={rsvpGuestCount}
                              onChange={(e) => setRsvpGuestCount(parseInt(e.target.value) || 1)}
                              className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                            />
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 mb-1">
                          Warm Message for Vinay &amp; Mounika (Optional)
                        </label>
                        <textarea
                          rows={2}
                          placeholder="Wishing you both a lifetime of happiness, health and love..."
                          value={rsvpNote}
                          onChange={(e) => setRsvpNote(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 outline-none resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={rsvpSubmitting}
                        className="w-full py-3.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-md hover:shadow-lg transition-all cursor-pointer"
                        style={{
                          background: "linear-gradient(135deg, #D4AF37, #B8860B)",
                        }}
                      >
                        {rsvpSubmitting ? "Confirming..." : "Confirm RSVP Attendance"}
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 8: CONTACT ENQUIRY                                */}
        {/* ========================================================= */}
        <section className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mb-8"
          >
            <span className="inline-block px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-widest text-amber-900 bg-amber-100 border border-amber-300 shadow-sm mb-3">
              Need Help or Accommodations?
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-900">
              Contact Enquiry
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-2">
              Feel Free to Contact Us Anytime
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Contact 1: 9989364515 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="glass-card rounded-2xl p-6 border border-amber-300/80 bg-white/95 shadow-md text-center space-y-4"
            >
              <div className="w-12 h-12 mx-auto rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-xl text-amber-800">
                📞
              </div>
              <div>
                <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-widest">
                  Event Coordinator
                </p>
                <p className="font-display text-2xl font-bold text-neutral-900 tracking-wide mt-1">
                  9989364515
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <a
                  href="tel:9989364515"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-900 text-white hover:bg-neutral-800 transition-colors shadow-sm"
                >
                  Call Now
                </a>
                <a
                  href="https://wa.me/919989364515?text=Hello!%20Enquiry%20regarding%20Vinay%20%26%20Mounika's%20Wedding."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-500 transition-colors shadow-sm flex items-center gap-1"
                >
                  <span>💬</span>
                  <span>WhatsApp</span>
                </a>
              </div>
            </motion.div>

            {/* Contact 2: 9676764800 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="glass-card rounded-2xl p-6 border border-amber-300/80 bg-white/95 shadow-md text-center space-y-4"
            >
              <div className="w-12 h-12 mx-auto rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-xl text-amber-800">
                📱
              </div>
              <div>
                <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-widest">
                  Family Hospitality
                </p>
                <p className="font-display text-2xl font-bold text-neutral-900 tracking-wide mt-1">
                  9676764800
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <a
                  href="tel:9676764800"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-900 text-white hover:bg-neutral-800 transition-colors shadow-sm"
                >
                  Call Now
                </a>
                <a
                  href="https://wa.me/919676764800?text=Hello!%20Enquiry%20regarding%20Vinay%20%26%20Mounika's%20Wedding."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-500 transition-colors shadow-sm flex items-center gap-1"
                >
                  <span>💬</span>
                  <span>WhatsApp</span>
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 9: REALTIME WISHES WALL                           */}
        {/* ========================================================= */}
        <section className="text-center pt-4">
          <Wishes />
        </section>

        {/* ========================================================= */}
        {/* SECTION 10: FAMILY BLESSING & SACRED FOOTER              */}
        {/* ========================================================= */}
        <footer className="text-center pt-8 pb-16 border-t border-amber-200/80 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6 max-w-2xl mx-auto"
          >
            {/* Sacred Om Motif */}
            <div className="flex items-center justify-center gap-3 text-amber-700 text-2xl">
              <span>ॐ</span>
              <span>❦</span>
              <span>ॐ</span>
            </div>

            {/* Blessing Line */}
            <p className="font-display text-base sm:text-lg text-neutral-700 italic leading-relaxed">
              With immense joy and the blessings of our families, we cordially invite you to be a part of our wedding celebration
            </p>

            {/* With Love Sign-Off */}
            <div className="space-y-2 pt-2">
              <p className="font-script text-3xl sm:text-4xl text-amber-800 font-bold">
                With love, Vinay &amp; Mounika
              </p>
              <p className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-neutral-600">
                With love from Tarun, Kiran &amp; Pavan
              </p>
            </div>

            <div className="pt-8">
              <p className="text-[11px] text-neutral-400">
                Crafted with love for Vinay &amp; Mounika&apos;s Wedding Celebration • 2026
              </p>
            </div>
          </motion.div>
        </footer>
      </main>

      {/* Floating Bottom Order CTA Pill (Unobtrusive) */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-neutral-900/90 backdrop-blur-md border border-neutral-700 text-white rounded-full px-5 py-2.5 shadow-2xl flex items-center gap-3 text-xs">
        <span className="hidden sm:inline font-medium text-neutral-300">
          Like this bespoke design for your wedding?
        </span>
        <Link
          href={`/order?template=${templateSlug}`}
          className="px-4 py-1.5 rounded-full font-bold uppercase tracking-wider text-[11px] text-neutral-950 bg-amber-400 hover:bg-amber-300 transition-all shadow-sm"
        >
          Order This Design →
        </Link>
      </div>
    </div>
  );
}

