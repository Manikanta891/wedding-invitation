import mongoose, { Schema, Document } from "mongoose";

export interface IRSVP extends Document {
  invitationSlug: string;
  name: string;
  email?: string;
  phone?: string;
  attending: "yes" | "no";
  guestCount: number;
  message?: string;
  timestamp: Date;
}

const RSVPSchema = new Schema<IRSVP>({
  invitationSlug: { type: String, required: true, index: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, trim: true, lowercase: true },
  phone: { type: String, trim: true },
  attending: { type: String, enum: ["yes", "no"], required: true },
  guestCount: { type: Number, default: 1 },
  message: { type: String, default: "" },
  timestamp: { type: Date, default: Date.now, index: true },
});

export const RSVP =
  mongoose.models.RSVP || mongoose.model<IRSVP>("RSVP", RSVPSchema);
