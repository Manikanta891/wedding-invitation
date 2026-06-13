"use client";

import { motion } from "framer-motion";

const events = [
  {
    title: "Wedding Ceremony",
    date: "21st June 2026",
    time: "10:00 AM onwards",
    venue: "Sri Venkateswara Kalyana Mandapam",
    address: "Main Road, Guntur, Andhra Pradesh",
    description: "Join us as we exchange our vows and begin our journey together. Traditional wedding ceremonies followed by lunch.",
    icon: "💒",
    color: "var(--primary)",
  },
  {
    title: "Reception",
    date: "21st June 2026",
    time: "7:00 PM onwards",
    venue: "Grand Convention Hall",
    address: "Hotel Bliss, Guntur, Andhra Pradesh",
    description: "An evening of celebration, dinner, and dancing as we rejoice with our friends and family.",
    icon: "🎉",
    color: "var(--secondary)",
  },
];

export default function Events() {
  return (
    <section id="events" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="relative z-10 max-w-5xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="font-script text-xl" style={{ color: "var(--secondary)" }}>Save the Date</span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold mt-2 mb-4">Events</h2>
          <div className="section-divider" />
          <p className="mt-4 max-w-lg mx-auto" style={{ color: "var(--text-light)" }}>
            We would be honored to have you join us on our special day
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {events.map((event, i) => (
            <motion.div
              key={event.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              className="glossy-overlay"
            >
              <div className="glass-card rounded-3xl p-8 h-full flex flex-col relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <span className="text-4xl">{event.icon}</span>
                  <span
                    className="text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full glass"
                    style={{ color: "var(--secondary)" }}
                  >
                    Event {i + 1}
                  </span>
                </div>

                <h3 className="font-display text-2xl font-semibold mb-4">{event.title}</h3>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--primary-dark)", flexShrink: 0 }}>
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <span className="text-sm font-medium">{event.date} | {event.time}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--primary-dark)", flexShrink: 0 }}>
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span className="text-sm">{event.venue}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--primary-dark)", flexShrink: 0 }}>
                      <path d="M12 22s-8-4.5-8-11.8A8 8 0 0112 2a8 8 0 018 8.2c0 7.3-8 11.8-8 11.8z" />
                    </svg>
                    <span className="text-sm" style={{ color: "var(--text-light)" }}>{event.address}</span>
                  </div>
                </div>

                <p className="text-sm leading-relaxed mb-6 flex-1" style={{ color: "var(--text-light)" }}>
                  {event.description}
                </p>

                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(event.venue + ", " + event.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-full transition-all duration-300 hover:opacity-80 self-start"
                  style={{
                    background: `linear-gradient(135deg, var(--primary), var(--primary-dark))`,
                    color: "white",
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  Get Directions
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
