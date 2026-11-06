import mongoose, { Schema, Document } from "mongoose";

export interface IEnquiry extends Document {
  name: string;
  email: string;
  phone?: string;
  occasion: string;
  message: string;
  status: "new" | "contacted" | "resolved";
  internalNotes?: string;
  timestamp: Date;
}

const EnquirySchema = new Schema<IEnquiry>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, default: "" },
  occasion: { type: String, default: "Wedding" },
  message: { type: String, required: true },
  status: {
    type: String,
    enum: ["new", "contacted", "resolved"],
    default: "new",
    index: true,
  },
  internalNotes: { type: String, default: "" },
  timestamp: { type: Date, default: Date.now, index: true },
});

export const Enquiry =
  mongoose.models.Enquiry || mongoose.model<IEnquiry>("Enquiry", EnquirySchema);
