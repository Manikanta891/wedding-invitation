import mongoose, { Schema, Document } from "mongoose";

export interface IWish extends Document {
  name: string;
  message: string;
  timestamp: Date;
}

const WishSchema = new Schema<IWish>({
  name: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export const Wish = mongoose.models.Wish || mongoose.model<IWish>("Wish", WishSchema);
