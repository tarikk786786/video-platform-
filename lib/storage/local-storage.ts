import { StorageProvider, StorageUploadResult, UploadOptions, StorageMetadata, GetUrlOptions } from './storage-provider';
import fs from 'fs';
import path from 'path';

export class LocalStorage implements StorageProvider {
  readonly name = 'local';
  private baseDir: string;

  constructor(baseDir?: string) {
    this.baseDir = baseDir || path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(this.baseDir)) {
      fs.mkdirSync(this.baseDir, { recursive: true });
    }
  }

  private getFilePath(key: string): string {
    const safeKey = key.replace(/[^a-zA-Z0-9_.-]/g, '_');
    return path.join(this.baseDir, safeKey);
  }

  async upload(data: Buffer | Uint8Array, key: string, options: UploadOptions): Promise<StorageUploadResult> {
    const targetPath = this.getFilePath(key);
    await fs.promises.writeFile(targetPath, Buffer.from(data));

    return {
      key,
      storageProvider: 'local',
      url: `/api/media/${encodeURIComponent(key)}`,
      sizeBytes: data.byteLength,
      mimeType: options.contentType,
      rawMetadata: { localPath: targetPath },
    };
  }

  async download(key: string): Promise<Buffer> {
    const targetPath = this.getFilePath(key);
    return await fs.promises.readFile(targetPath);
  }

  async delete(key: string): Promise<boolean> {
    const targetPath = this.getFilePath(key);
    if (fs.existsSync(targetPath)) {
      await fs.promises.unlink(targetPath);
      return true;
    }
    return false;
  }

  async getUrl(key: string, options?: GetUrlOptions): Promise<string> {
    return `/api/media/${encodeURIComponent(key)}`;
  }

  async getMetadata(key: string): Promise<StorageMetadata | null> {
    const targetPath = this.getFilePath(key);
    if (!fs.existsSync(targetPath)) return null;

    const stats = await fs.promises.stat(targetPath);
    return {
      key,
      sizeBytes: stats.size,
      lastModified: stats.mtime,
      storageProvider: 'local',
    };
  }

  async exists(key: string): Promise<boolean> {
    const targetPath = this.getFilePath(key);
    return fs.existsSync(targetPath);
  }
}