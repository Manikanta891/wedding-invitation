import mongoose, { Schema, Document } from "mongoose";

export interface IInvitationEvent {
  title: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  description: string;
  icon: string;
  mapUrl?: string;
}

export interface IInvitationStory {
  year: string;
  title: string;
  description: string;
  icon: string;
}

export interface IInvitationImage {
  src: string;
  alt: string;
  label: string;
}

export interface IInvitation extends Document {
  slug: string;
  orderRef?: string;
  templateSlug: string;
  title: string;
  coupleNames: {
    person1: string;
    person2?: string;
  };
  headline: string;
  eventDate: string;
  eventTime: string;
  events: IInvitationEvent[];
  story: IInvitationStory[];
  gallery: IInvitationImage[];
  musicUrl?: string;
  themeId: string;
  bgId: string;
  status: "published" | "draft" | "expired";
  expiresAt?: Date;
  viewsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const InvitationSchema = new Schema<IInvitation>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    orderRef: { type: String, index: true },
    templateSlug: { type: String, default: "royal-palace" },
    title: { type: String, required: true },
    coupleNames: {
      person1: { type: String, required: true },
      person2: { type: String },
    },
    headline: { type: String, default: "We're Getting Married" },
    eventDate: { type: String, required: true },
    eventTime: { type: String, default: "7:00 PM" },
    events: [
      {
        title: { type: String, required: true },
        date: { type: String, required: true },
        time: { type: String, required: true },
        venue: { type: String, required: true },
        address: { type: String, required: true },
        description: { type: String },
        icon: { type: String, default: "💒" },
        mapUrl: { type: String },
      },
    ],
    story: [
      {
        year: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        icon: { type: String, default: "💫" },
      },
    ],
    gallery: [
      {
        src: { type: String, required: true },
        alt: { type: String, default: "Photo" },
        label: { type: String, default: "Memory" },
      },
    ],
    musicUrl: { type: String },
    themeId: { type: String, default: "baby-pink" },
    bgId: { type: String, default: "soft-glow" },
    status: {
      type: String,
      enum: ["published", "draft", "expired"],
      default: "published",
      index: true,
    },
    expiresAt: { type: Date },
    viewsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Invitation =
  mongoose.models.Invitation ||
  mongoose.model<IInvitation>("Invitation", InvitationSchema);
