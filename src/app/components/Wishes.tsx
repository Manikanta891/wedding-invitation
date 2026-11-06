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
    const timer = setTimeout(() => {
      try {
        setFormatted(new Date(date).toLocaleDateString());
      } catch {
        setFormatted("");
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [date]);

  return (
    <span className="text-[10px] uppercase tracking-wider" style={{ color: "var(--text-light)" }}>
      {formatted || "---"}
    </span>
  );
}

const defaultDemonstrationWishes: Wish[] = [
  {
    _id: "demo-wish-1",
    name: "Aunt Sunita & Uncle Rajesh",
    message:
      "Wishing you both a lifetime of love, joy, and laughter as you embark on this beautiful adventure together!",
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    _id: "demo-wish-2",
    name: "Vikram & Neha",
    message:
      "Heartiest congratulations! Can't wait to dance at the celebrations and rejoice with both families!",
    timestamp: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    _id: "demo-wish-3",
    name: "Dr. K. Srinivas Rao",
    message:
      "May your journey together be blessed with abundant happiness, good health, and prosperous memories.",
    timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
];

export default function Wishes() {
  const [wishes, setWishes] = useState<Wish[]>(defaultDemonstrationWishes);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/wishes")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setWishes(data);
        } else {
          setWishes(defaultDemonstrationWishes);
        }
      })
      .catch(() => {
        setWishes(defaultDemonstrationWishes);
      })
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

      if (!res.ok) {
        // Fallback for demonstration when offline
        const localWish: Wish = {
          _id: `local-${Date.now()}`,
          name: name.trim(),
          message: message.trim(),
          timestamp: new Date().toISOString(),
        };
        setWishes((prev) => [localWish, ...(Array.isArray(prev) ? prev : [])]);
        setName("");
        setMessage("");
        return;
      }

      const newWish = await res.json();
      if (newWish && newWish._id) {
        setWishes((prev) => [newWish, ...(Array.isArray(prev) ? prev : [])]);
        setName("");
        setMessage("");
      }
    } catch {
      // Offline fallback
      const localWish: Wish = {
        _id: `local-${Date.now()}`,
        name: name.trim(),
        message: message.trim(),
        timestamp: new Date().toISOString(),
      };
      setWishes((prev) => [localWish, ...(Array.isArray(prev) ? prev : [])]);
      setName("");
      setMessage("");
    }
  };

  const wishList = Array.isArray(wishes) ? wishes : defaultDemonstrationWishes;

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
                  Send Wish
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
            ) : wishList.length === 0 ? (
              <p className="text-sm" style={{ color: "var(--text-light)" }}>No wishes yet. Be the first!</p>
            ) : (
              wishList.map((wish, i) => (
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
