import path from 'path';
import fs from 'fs';
import { ENV } from './env';

export interface FileStorageResult {
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  storageProvider: 'local' | 's3' | 'cloudinary';
  uploadedAt: Date;
}

export class StorageService {
  private static localUploadsDir = path.resolve(__dirname, '../../uploads');

  public static getUploadsDirectory(): string {
    if (!fs.existsSync(this.localUploadsDir)) {
      fs.mkdirSync(this.localUploadsDir, { recursive: true });
    }
    return this.localUploadsDir;
  }

  public static getFileUrl(filename: string): string {
    return `/uploads/${filename}`;
  }

  public static getStorageProvider(): string {
    return process.env.STORAGE_PROVIDER || 'local';
  }
}
