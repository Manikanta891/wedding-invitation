import mongoose, { Schema, Document } from "mongoose";

export interface ITemplate extends Document {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  category: "wedding" | "wishes" | "birthday" | "anniversary" | "save-the-date";
  price: number; // Informational only
  currency: string;
  thumbnail: string;
  previewImages: string[];
  features: string[];
  demoSlug: string;
  isPublished: boolean;
  isFeatured: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const TemplateSchema = new Schema<ITemplate>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    tagline: { type: String, default: "" },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ["wedding", "wishes", "birthday", "anniversary", "save-the-date"],
      required: true,
      index: true,
    },
    price: { type: Number, required: true, default: 1499 },
    currency: { type: String, default: "₹" },
    thumbnail: { type: String, required: true },
    previewImages: [{ type: String }],
    features: [{ type: String }],
    demoSlug: { type: String, default: "harsha-indu" },
    isPublished: { type: Boolean, default: true, index: true },
    isFeatured: { type: Boolean, default: false, index: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Template =
  mongoose.models.Template || mongoose.model<ITemplate>("Template", TemplateSchema);
