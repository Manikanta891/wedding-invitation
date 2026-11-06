"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import TemplateCard, { TemplateData } from "../components/TemplateCard";
import { defaultTemplates } from "@/lib/defaultTemplates";

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<TemplateData[]>(defaultTemplates);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");

  useEffect(() => {
    fetch("/api/templates")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setTemplates(data);
        }
      })
      .catch((err) => console.warn("Failed to fetch templates:", err))
      .finally(() => setLoading(false));
  }, []);

  const categories = [
    { id: "all", label: "All Occasions" },
    { id: "wedding", label: "Weddings" },
    { id: "wishes", label: "Wishes & Keepsakes" },
    { id: "birthday", label: "Birthdays" },
    { id: "anniversary", label: "Anniversaries" },
  ];

  const filteredAndSortedTemplates = useMemo(() => {
    let result = templates.filter((item) => {
      const matchesCategory = category === "all" || item.category === category;
      const matchesSearch =
        search.trim() === "" ||
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase()) ||
        (item.tagline && item.tagline.toLowerCase().includes(search.toLowerCase()));

      return matchesCategory && matchesSearch;
    });

    if (sortBy === "price-asc") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortBy === "newest") {
      result = [...result].reverse();
    }

    return result;
  }, [templates, category, search, sortBy]);

  return (
    <div className="min-h-screen pt-28 pb-24 text-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs uppercase font-bold tracking-widest text-amber-700">
            Design Catalog
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-neutral-900 mt-2 mb-4">
            Curated Digital Invitation Templates
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 font-light">
            Every template is fully customizable with your photos, love story, background music,
            Google Maps venue location, and interactive guest RSVP.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="glass-card rounded-3xl p-5 mb-12 border border-neutral-200/80 bg-white/80 shadow-md">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
                🔍
              </span>
              <input
                type="text"
                placeholder="Search templates by style, theme..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-full text-xs bg-neutral-50 border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-700"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCategory(c.id)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider transition-all ${
                    category === c.id
                      ? "bg-neutral-900 text-white shadow-sm"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200/80"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <span className="text-xs text-neutral-500 font-medium">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 rounded-full text-xs font-medium bg-neutral-50 border border-neutral-200 text-neutral-700 focus:outline-none"
              >
                <option value="featured">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest Additions</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count & Current Filter */}
        <div className="flex items-center justify-between text-xs text-neutral-500 mb-6 px-1">
          <span>
            Showing <strong>{filteredAndSortedTemplates.length}</strong> of {templates.length} designs
          </span>
          {category !== "all" && (
            <button
              onClick={() => {
                setCategory("all");
                setSearch("");
              }}
              className="text-amber-700 hover:underline"
            >
              Reset filters
            </button>
          )}
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="py-24 text-center">
            <div className="inline-block w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-xs text-neutral-500 uppercase tracking-widest">
              Loading design collection...
            </p>
          </div>
        ) : filteredAndSortedTemplates.length === 0 ? (
          <div className="py-24 text-center glass-card rounded-3xl p-12 bg-white/60">
            <span className="text-4xl mb-4 block">🎨</span>
            <h3 className="font-display text-xl font-bold text-neutral-900 mb-2">
              No templates found matching your filter
            </h3>
            <p className="text-xs text-neutral-500 max-w-md mx-auto mb-6">
              Try adjusting your search terms or view all templates. We can also custom-craft any design for your occasion!
            </p>
            <button
              onClick={() => {
                setCategory("all");
                setSearch("");
              }}
              className="px-6 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-amber-500 text-white shadow-sm"
            >
              Show All Templates
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAndSortedTemplates.map((template) => (
              <TemplateCard key={template.slug} template={template} />
            ))}
          </div>
        )}

        {/* Custom Order Box */}
        <div className="mt-20 glass-card rounded-3xl p-8 sm:p-12 text-center bg-gradient-to-r from-amber-50 via-white to-amber-50 border border-amber-200/80 shadow-md">
          <h3 className="font-display text-2xl sm:text-3xl font-bold text-neutral-900 mb-2">
            Looking for a completely bespoke custom theme?
          </h3>
          <p className="text-sm text-neutral-600 max-w-xl mx-auto mb-6 font-light">
            Have a unique theme, royal monogram, caricature, or custom animated storyboard in mind?
            Our artisans can craft an exclusive digital invitation tailored exclusively to you.
          </p>
          <Link
            href="/order?custom=true"
            className="inline-block px-8 py-3.5 rounded-full text-xs font-semibold tracking-wider uppercase text-white shadow-md hover:shadow-lg transition-all"
            style={{
              background: "linear-gradient(135deg, #D4AF37, #B8860B)",
            }}
          >
            Request Custom Design →
          </Link>
        </div>
      </div>
    </div>
  );
}
