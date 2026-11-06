import mongoose, { Schema, Document } from "mongoose";

export interface IMedia extends Document {
  fileId: string;
  originalName: string;
  mimeType: string;
  size: number;
  hash?: string;
  storageProvider: "google-drive" | "local";
  orderRef?: string;
  invitationSlug?: string;
  driveFileId?: string;
  driveFolderId?: string;
  url: string;
  isOptimized: boolean;
  createdAt: Date;
}

const MediaSchema = new Schema<IMedia>({
  fileId: { type: String, required: true, unique: true, index: true },
  originalName: { type: String, required: true },
  mimeType: { type: String, required: true },
  size: { type: Number, required: true },
  hash: { type: String, index: true },
  storageProvider: { type: String, enum: ["google-drive", "local"], default: "google-drive" },
  orderRef: { type: String, index: true },
  invitationSlug: { type: String, index: true },
  driveFileId: { type: String },
  driveFolderId: { type: String },
  url: { type: String, required: true },
  isOptimized: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export const Media =
  mongoose.models.Media || mongoose.model<IMedia>("Media", MediaSchema);
