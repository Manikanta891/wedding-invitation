import mongoose, { Schema, Document } from "mongoose";

export interface IWish extends Document {
  name: string;
  message: string;
  invitationSlug?: string;
  isApproved: boolean;
  timestamp: Date;
}

const WishSchema = new Schema<IWish>({
  name: { type: String, required: true },
  message: { type: String, required: true },
  invitationSlug: { type: String, default: "harsha-indu", index: true },
  isApproved: { type: Boolean, default: true, index: true },
  timestamp: { type: Date, default: Date.now, index: true },
});

export const Wish = mongoose.models.Wish || mongoose.model<IWish>("Wish", WishSchema);
