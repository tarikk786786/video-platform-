export interface UploadOptions {
  contentType: string;
  filename?: string;
  isPublic?: boolean;
  metadata?: Record<string, any>;
}

export interface StorageUploadResult {
  key: string;
  storageProvider: 'telegram' | 'seaweedfs' | 's3' | 'r2' | 'local' | 'backblaze' | 'minio';
  url: string;
  sizeBytes: number;
  mimeType: string;
  telegramFileId?: string;
  telegramMessageId?: number;
  telegramChatId?: string;
  rawMetadata?: Record<string, any>;
}

export interface StorageMetadata {
  key: string;
  sizeBytes: number;
  mimeType?: string;
  lastModified?: Date;
  storageProvider: string;
  telegramFileId?: string;
}

export interface GetUrlOptions {
  expiresInSeconds?: number;
  download?: boolean;
}

export interface StorageProvider {
  readonly name: string;
  upload(data: Buffer | Uint8Array, key: string, options: UploadOptions): Promise<StorageUploadResult>;
  download(key: string): Promise<Buffer>;
  delete(key: string): Promise<boolean>;
  getUrl(key: string, options?: GetUrlOptions): Promise<string>;
  getMetadata(key: string): Promise<StorageMetadata | null>;
  exists(key: string): Promise<boolean>;
}
