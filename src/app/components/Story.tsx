"use client";

import { motion } from "framer-motion";

const storyEvents = [
  {
    year: "2017",
    title: "First Meeting",
    description: "Two souls, one unexpected moment. What started as a simple hello became the beginning of a beautiful journey together.",
    icon: "💌",
  },
  {
    year: "2018",
    title: "The Proposal",
    description: "Under the starlit sky, with a heart full of love and a knee on the ground, a question was asked that changed everything.",
    icon: "💍",
  },
  {
    year: "2021",
    title: "Family Blessings",
    description: "With the love and support of both families, our bond grew stronger, paving the way for a lifetime of togetherness.",
    icon: "🙏",
  },
  {
    year: "2026",
    title: "The Big Day",
    description: "After years of love, laughter, and countless memories, we finally tie the knot. And we want you to be a part of it!",
    icon: "🎊",
  },
];

export default function Story() {
  return (
    <section id="story" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="relative z-10 max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="font-script text-xl" style={{ color: "var(--secondary)" }}>Our Journey</span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold mt-2 mb-4">Love Story</h2>
          <div className="section-divider" />
          <p className="mt-4 max-w-lg mx-auto" style={{ color: "var(--text-light)" }}>
            Every great love story starts with a simple moment. Here&apos;s a glimpse into ours.
          </p>
        </motion.div>

        <div className="relative">
          <div
            className="absolute left-1/2 -translate-x-px top-0 bottom-0 w-0.5 hidden md:block"
            style={{ background: `linear-gradient(to bottom, var(--primary), var(--secondary), var(--primary))` }}
          />

          <div className="space-y-12 md:space-y-16">
            {storyEvents.map((event, index) => (
              <motion.div
                key={event.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className={`relative flex flex-col md:flex-row items-center gap-6 ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                <div className={`flex-1 ${index % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                  <div className={`glass-card rounded-2xl p-6 ${index % 2 === 0 ? "md:mr-8" : "md:ml-8"}`}>
                    <span
                      className="text-xs font-bold tracking-widest uppercase"
                      style={{ color: "var(--secondary)" }}
                    >
                      {event.year}
                    </span>
                    <h3 className="font-display text-xl font-semibold mt-1 mb-2">{event.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--text-light)" }}>
                      {event.description}
                    </p>
                  </div>
                </div>

                <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-full glass-card z-10 shrink-0 text-xl">
                  {event.icon}
                </div>

                <div className="flex-1 hidden md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
