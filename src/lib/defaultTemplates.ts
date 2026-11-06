export interface DefaultTemplate {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  category: "wedding" | "wishes" | "birthday" | "anniversary" | "save-the-date";
  price: number;
  currency: string;
  thumbnail: string;
  previewImages: string[];
  features: string[];
  demoSlug: string;
  isPublished: boolean;
  isFeatured: boolean;
  sortOrder: number;
}

export const defaultTemplates: DefaultTemplate[] = [
  {
    slug: "royal-palace",
    title: "The Royal Palace Affair",
    tagline: "Majestic Gold Foil & Rose Gold Luxury",
    description:
      "A grand royal palace aesthetic with ornate flourishes, warm gold accents, and a rich romantic ambiance crafted for traditional and destination weddings.",
    category: "wedding",
    price: 1999,
    currency: "₹",
    thumbnail: "/photos/L-1.jpeg",
    previewImages: ["/photos/L-1.jpeg", "/photos/L-2.jpeg", "/photos/L-3.jpeg"],
    features: [
      "Wax-Seal 3D Animated Envelope",
      "Couple Love Story Timeline",
      "Multi-Day Event Schedule",
      "Interactive RSVP & Blessing Board",
      "Google Maps Venue Directions",
      "Background Romance Audio",
    ],
    demoSlug: "harsha-indu",
    isPublished: true,
    isFeatured: true,
    sortOrder: 1,
  },
  {
    slug: "botanical-whispers",
    title: "Botanical Garden Romance",
    tagline: "Earthy Sage Green & Floral Petal Cascades",
    description:
      "Delicate nature-inspired aesthetics with gentle floating floral petals, clean typography, and a modern open-air celebration vibe.",
    category: "wedding",
    price: 1799,
    currency: "₹",
    thumbnail: "/photos/L-2.jpeg",
    previewImages: ["/photos/L-2.jpeg", "/photos/S-1.jpeg", "/photos/S-2.jpeg"],
    features: [
      "Floating Blossom Animations",
      "Curated Memory Photo Gallery",
      "Live Precision Countdown",
      "Wedding Program Timeline",
      "Direct WhatsApp RSVP Integration",
      "Venue Maps & Accommodations",
    ],
    demoSlug: "harsha-indu",
    isPublished: true,
    isFeatured: true,
    sortOrder: 2,
  },
  {
    slug: "celestial-starlight",
    title: "Celestial Starlight Elegance",
    tagline: "Midnight Navy, Golden Sparkle & Constellations",
    description:
      "A dramatic and luxurious evening theme featuring dark mode sophistication, subtle constellation glows, and shimmering typography.",
    category: "wedding",
    price: 2499,
    currency: "₹",
    thumbnail: "/photos/L-3.jpeg",
    previewImages: ["/photos/L-3.jpeg", "/photos/S-3.jpeg", "/photos/S-4.jpeg"],
    features: [
      "Dark Elegance Ambient Shimmer",
      "3D Interactive Card Perspective",
      "Audio Ambient Player",
      "Realtime Guest Wishes Wall",
      "Dress Code & Venue Details",
      "One-Touch Calendar Event Add",
    ],
    demoSlug: "harsha-indu",
    isPublished: true,
    isFeatured: true,
    sortOrder: 3,
  },
  {
    slug: "golden-anniversary",
    title: "Golden Jubilee Milestone",
    tagline: "Timeless Gold & Ivory Reminiscence",
    description:
      "Celebrate decades of unconditional love and togetherness with a classic golden anniversary digital invitation and legacy photo vault.",
    category: "anniversary",
    price: 1499,
    currency: "₹",
    thumbnail: "/photos/S-1.jpeg",
    previewImages: ["/photos/S-1.jpeg", "/photos/S-2.jpeg"],
    features: [
      "Decade Milestones Timeline",
      "Memory Vault Photo Wall",
      "Tribute Blessing Notes",
      "Event Venue Details & Map",
      "Family RSVP Attendance",
    ],
    demoSlug: "harsha-indu",
    isPublished: true,
    isFeatured: false,
    sortOrder: 4,
  },
  {
    slug: "birthday-gala-fiesta",
    title: "Birthday Gala & Confetti Fiesta",
    tagline: "Vibrant Champagne & Pastel Joy",
    description:
      "An energetic, stylish digital invitation built for milestone birthdays, sweet sixteens, and fabulous surprise celebrations.",
    category: "birthday",
    price: 1299,
    currency: "₹",
    thumbnail: "/photos/S-2.jpeg",
    previewImages: ["/photos/S-2.jpeg", "/photos/S-3.jpeg"],
    features: [
      "Interactive Confetti Burst",
      "Headcount RSVP with Dietary Notes",
      "Party Itinerary & DJ Playlist",
      "Google Maps Live Location",
      "Digital Surprise Notes",
    ],
    demoSlug: "harsha-indu",
    isPublished: true,
    isFeatured: false,
    sortOrder: 5,
  },
  {
    slug: "wishes-and-surprises",
    title: "Heartfelt Wishes & Surprises",
    tagline: "Interactive Virtual Guestbook & Tribute Wall",
    description:
      "A dedicated interactive keepsake platform where friends, family, and loved ones can write blessings, upload moments, and celebrate milestones.",
    category: "wishes",
    price: 999,
    currency: "₹",
    thumbnail: "/photos/S-3.jpeg",
    previewImages: ["/photos/S-3.jpeg", "/photos/S-4.jpeg"],
    features: [
      "Interactive Digital Guestbook",
      "Moderated Blessing Feed",
      "Celebration Photo Collage",
      "Live Event Countdown",
      "Audio Background Tribute",
    ],
    demoSlug: "harsha-indu",
    isPublished: true,
    isFeatured: true,
    sortOrder: 6,
  },
];

