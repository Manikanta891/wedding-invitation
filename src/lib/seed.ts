import { connectDB } from "./mongodb";
import { Template } from "@/app/models/Template";
import { Invitation } from "@/app/models/Invitation";
import { defaultTemplates } from "./defaultTemplates";

export { defaultTemplates };

export async function ensureSeedData() {
  try {
    await connectDB();
    const count = await Template.countDocuments();
    if (count === 0) {
      await Template.insertMany(defaultTemplates);
    }

    const invitationCount = await Invitation.countDocuments({ slug: "harsha-indu" });
    if (invitationCount === 0) {
      await Invitation.create({
        slug: "harsha-indu",
        templateSlug: "royal-palace",
        title: "Harshavardhan & Indumathi Wedding Celebration",
        coupleNames: {
          person1: "Harshavardhan",
          person2: "Indumathi",
        },
        headline: "We're Getting Married",
        eventDate: "2026-06-21T21:07:00",
        eventTime: "9:07 PM",
        events: [
          {
            title: "Wedding Ceremony",
            date: "21st June 2026",
            time: "7:00 PM onwards",
            venue: "Narsipatnam",
            address: "Narsipatnam, Andhra Pradesh",
            description:
              "Join us as we exchange our vows and begin our journey together. Traditional wedding ceremonies followed by dinner.",
            icon: "💒",
          },
          {
            title: "Reception",
            date: "25th June 2026",
            time: "12:00 PM onwards",
            venue: "JVR CONVENTIONS",
            address: "Ponduru, Andhra Pradesh",
            description:
              "Join us for a celebratory lunch as we rejoice with our friends and family.",
            icon: "🎉",
          },
        ],
        story: [
          {
            year: "2017",
            title: "First Meeting",
            description:
              "Two souls, one unexpected moment. What started as a simple hello became the beginning of a beautiful journey together.",
            icon: "💫",
          },
          {
            year: "2018",
            title: "The Proposal",
            description:
              "Under the starlit sky, with a heart full of love and a knee on the ground, a question was asked that changed everything.",
            icon: "💍",
          },
          {
            year: "2021",
            title: "Family Blessings",
            description:
              "With the love and support of both families, our bond grew stronger, paving the way for a lifetime of togetherness.",
            icon: "🙏",
          },
          {
            year: "2026",
            title: "The Big Day",
            description:
              "After years of love, laughter, and countless memories, we finally tie the knot. And we want you to be a part of it!",
            icon: "🎊",
          },
        ],
        gallery: [
          { src: "/photos/L-1.jpeg", alt: "Harsha & Indu", label: "Together" },
          { src: "/photos/L-2.jpeg", alt: "Harsha & Indu", label: "Forever" },
          { src: "/photos/S-1.jpeg", alt: "Harsha & Indu", label: "Love" },
          { src: "/photos/S-2.jpeg", alt: "Harsha & Indu", label: "Bliss" },
          { src: "/photos/S-3.jpeg", alt: "Harsha & Indu", label: "Us" },
          { src: "/photos/S-4.jpeg", alt: "Harsha & Indu", label: "Cherish" },
          { src: "/photos/L-3.jpeg", alt: "Harsha & Indu", label: "Always" },
          { src: "/photos/S-5.jpeg", alt: "Harsha & Indu", label: "Ours" },
        ],
        themeId: "baby-pink",
        bgId: "soft-glow",
        status: "published",
        viewsCount: 142,
      });
    }
  } catch (error) {
    console.warn("Could not seed data (MongoDB might not be running locally yet):", error);
  }
}
