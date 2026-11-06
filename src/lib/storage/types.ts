export interface StorageUploadOptions {
  buffer: Buffer;
  filename: string;
  mimeType: string;
  orderRef?: string;
  invitationSlug?: string;
  folderCategory?: "Originals" | "Optimized" | "Videos" | "Templates";
}

export interface StorageUploadResult {
  fileId: string;
  url: string;
  size: number;
  mimeType: string;
  provider: "google-drive" | "local";
  driveFileId?: string;
  hash: string;
}

export interface IStorageService {
  uploadFile(options: StorageUploadOptions): Promise<StorageUploadResult>;
  deleteFile(fileId: string): Promise<boolean>;
  getFileMetadata(fileId: string): Promise<{ size: number; mimeType: string; name: string } | null>;
}
