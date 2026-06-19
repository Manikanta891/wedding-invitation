"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Wish {
  _id: string;
  name: string;
  message: string;
  timestamp: string;
}

function FormattedDate({ date }: { date: string }) {
  const [formatted, setFormatted] = useState("");

  useEffect(() => {
    setFormatted(new Date(date).toLocaleDateString());
  }, [date]);

  if (!formatted) return <span className="text-[10px] uppercase tracking-wider" style={{ color: "var(--text-light)" }}>---</span>;

  return (
    <span className="text-[10px] uppercase tracking-wider" style={{ color: "var(--text-light)" }}>
      {formatted}
    </span>
  );
}

export default function Wishes() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/wishes")
      .then((res) => res.json())
      .then((data) => setWishes(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    try {
      const res = await fetch("/api/wishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), message: message.trim() }),
      });

      if (!res.ok) return;

      const newWish = await res.json();
      setWishes([newWish, ...wishes]);
      setName("");
      setMessage("");
    } catch {
      // silently fail
    }
  };

  return (
    <section id="wishes" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="relative z-10 max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="font-script text-xl" style={{ color: "var(--secondary)" }}>Share Your Love</span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold mt-2 mb-4">Wishes</h2>
          <div className="section-divider" />
          <p className="mt-4 max-w-lg mx-auto" style={{ color: "var(--text-light)" }}>
            Leave your blessings and wishes for the couple
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <form onSubmit={handleSubmit} className="glass-card rounded-3xl p-6 md:p-8">
              <h3 className="font-display text-xl font-semibold mb-6">Write Your Wish</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-light)" }}>
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 rounded-xl bg-white/50 border transition-all duration-300 focus:outline-none focus:ring-2 text-sm"
                    style={{
                      borderColor: "var(--glass-border)",
                      color: "var(--text)",
                      "--tw-ring-color": "var(--primary)",
                    } as React.CSSProperties}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-light)" }}>
                    Your Message
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your wishes for the couple..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-white/50 border transition-all duration-300 focus:outline-none focus:ring-2 text-sm resize-none"
                    style={{
                      borderColor: "var(--glass-border)",
                      color: "var(--text)",
                      "--tw-ring-color": "var(--primary)",
                    } as React.CSSProperties}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl text-sm font-semibold transition-all duration-300 hover:opacity-90"
                  style={{
                    background: `linear-gradient(135deg, var(--primary), var(--primary-dark))`,
                    color: "white",
                  }}
                >
                  Send Wish ✨
                </button>
              </div>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4 max-h-[500px] overflow-y-auto pr-2"
          >
            {loading ? (
              <p className="text-sm" style={{ color: "var(--text-light)" }}>Loading wishes...</p>
            ) : wishes.length === 0 ? (
              <p className="text-sm" style={{ color: "var(--text-light)" }}>No wishes yet. Be the first!</p>
            ) : (
              wishes.map((wish, i) => (
                <motion.div
                  key={wish._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="glass-card rounded-2xl p-5"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="font-semibold text-sm">{wish.name}</span>
                    <FormattedDate date={wish.timestamp} />
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-light)" }}>
                    {wish.message}
                  </p>
                </motion.div>
              ))
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
