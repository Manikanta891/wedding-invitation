import mongoose, { Schema, Document } from "mongoose";

export interface IStatusHistory {
  status: string;
  timestamp: Date;
  note?: string;
  updatedBy?: string;
}

export interface IReferenceFile {
  name: string;
  url: string;
  fileId?: string;
  size?: number;
}

export interface IOrder extends Document {
  orderRef: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  occasion: string;
  templateId: string;
  templateName: string;
  price: number; // Informational reference
  eventDetails: {
    eventDate: string;
    eventTime: string;
    venueName: string;
    venueAddress: string;
    additionalNotes?: string;
  };
  referenceFiles: IReferenceFile[];
  status:
    | "NEW"
    | "CONTACTED"
    | "DETAILS_RECEIVED"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "CANCELLED";
  statusHistory: IStatusHistory[];
  internalNotes?: string;
  invitationUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    orderRef: { type: String, required: true, unique: true, index: true },
    customer: {
      name: { type: String, required: true, trim: true },
      email: { type: String, required: true, trim: true, lowercase: true, index: true },
      phone: { type: String, required: true, trim: true, index: true },
    },
    occasion: { type: String, required: true, default: "Wedding" },
    templateId: { type: String, required: true },
    templateName: { type: String, required: true },
    price: { type: Number, default: 0 },
    eventDetails: {
      eventDate: { type: String, required: true },
      eventTime: { type: String, required: true },
      venueName: { type: String, required: true },
      venueAddress: { type: String, required: true },
      additionalNotes: { type: String, default: "" },
    },
    referenceFiles: [
      {
        name: { type: String },
        url: { type: String },
        fileId: { type: String },
        size: { type: Number },
      },
    ],
    status: {
      type: String,
      enum: [
        "NEW",
        "CONTACTED",
        "DETAILS_RECEIVED",
        "IN_PROGRESS",
        "COMPLETED",
        "CANCELLED",
      ],
      default: "NEW",
      index: true,
    },
    statusHistory: [
      {
        status: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        note: { type: String },
        updatedBy: { type: String, default: "System" },
      },
    ],
    internalNotes: { type: String, default: "" },
    invitationUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Order =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
