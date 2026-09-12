import { StorageProvider, StorageUploadResult, UploadOptions, StorageMetadata, GetUrlOptions } from './storage-provider';

export interface TelegramStorageConfig {
  botToken: string;
  storageChatId: string;
  apiBaseUrl?: string;
}

export class TelegramStorage implements StorageProvider {
  readonly name = 'telegram';
  private botToken: string;
  private storageChatId: string;
  private apiBaseUrl: string;

  constructor(config?: Partial<TelegramStorageConfig>) {
    this.botToken = config?.botToken || process.env.TELEGRAM_BOT_TOKEN || '';
    this.storageChatId = config?.storageChatId || process.env.TELEGRAM_STORAGE_CHAT_ID || '';
    this.apiBaseUrl = config?.apiBaseUrl || process.env.TELEGRAM_API_BASE_URL || 'https://api.telegram.org';

    if (!this.botToken || !this.storageChatId) {
      console.warn('[TelegramStorage] Warning: TELEGRAM_BOT_TOKEN or TELEGRAM_STORAGE_CHAT_ID missing.');
    }
  }

  private getEndpoint(method: string): string {
    return `${this.apiBaseUrl}/bot${this.botToken}/${method}`;
  }

  async upload(data: Buffer | Uint8Array, key: string, options: UploadOptions): Promise<StorageUploadResult> {
    if (!this.botToken || !this.storageChatId) {
      throw new Error('Telegram bot credentials not configured.');
    }

    const formData = new FormData();
    formData.append('chat_id', this.storageChatId);
    
    let method = 'sendDocument';
    let fileField = 'document';

    if (options.contentType.startsWith('video/')) {
      method = 'sendVideo';
      fileField = 'video';
    } else if (options.contentType.startsWith('image/')) {
      method = 'sendPhoto';
      fileField = 'photo';
    } else if (options.contentType.startsWith('audio/')) {
      method = 'sendAudio';
      fileField = 'audio';
    }

    const blob = new Blob([new Uint8Array(data)], { type: options.contentType });
    const filename = options.filename || key.split('/').pop() || 'media.bin';
    formData.append(fileField, blob, filename);
    formData.append('caption', `Storage key: ${key}`);

    const res = await fetch(this.getEndpoint(method), {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Telegram upload failed (${res.status}): ${errText}`);
    }

    const result = await res.json();
    if (!result.ok) {
      throw new Error(`Telegram API returned error: ${result.description}`);
    }

    const message = result.result;
    let fileId = '';
    let fileSize = data.byteLength;

    if (message.video) {
      fileId = message.video.file_id;
      fileSize = message.video.file_size || fileSize;
    } else if (message.photo && message.photo.length > 0) {
      const largestPhoto = message.photo[message.photo.length - 1];
      fileId = largestPhoto.file_id;
      fileSize = largestPhoto.file_size || fileSize;
    } else if (message.audio) {
      fileId = message.audio.file_id;
      fileSize = message.audio.file_size || fileSize;
    } else if (message.document) {
      fileId = message.document.file_id;
      fileSize = message.document.file_size || fileSize;
    }

    const proxyUrl = `/api/media/${encodeURIComponent(key)}`;

    return {
      key,
      storageProvider: 'telegram',
      url: proxyUrl,
      sizeBytes: fileSize,
      mimeType: options.contentType,
      telegramFileId: fileId,
      telegramMessageId: message.message_id,
      telegramChatId: this.storageChatId,
      rawMetadata: message,
    };
  }

  async getFileDirectUrl(telegramFileId: string): Promise<string> {
    const res = await fetch(this.getEndpoint('getFile'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file_id: telegramFileId }),
    });

    if (!res.ok) {
      throw new Error(`Failed to resolve Telegram file path: ${res.statusText}`);
    }

    const json = await res.json();
    if (!json.ok || !json.result.file_path) {
      throw new Error(`Telegram getFile returned error: ${json.description || 'Unknown'}`);
    }

    return `${this.apiBaseUrl}/file/bot${this.botToken}/${json.result.file_path}`;
  }

  async download(key: string, fileId?: string): Promise<Buffer> {
    if (!fileId) {
      throw new Error('TelegramStorage requires telegram_file_id to stream content directly');
    }
    const downloadUrl = await this.getFileDirectUrl(fileId);
    const res = await fetch(downloadUrl);
    if (!res.ok) {
      throw new Error(`Failed to download file from Telegram: ${res.statusText}`);
    }
    const arrayBuffer = await res.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  async delete(key: string, messageId?: number): Promise<boolean> {
    if (!messageId) return false;
    try {
      const res = await fetch(this.getEndpoint('deleteMessage'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: this.storageChatId,
          message_id: messageId,
        }),
      });
      const data = await res.json();
      return Boolean(data.ok);
    } catch {
      return false;
    }
  }

  async getUrl(key: string, options?: GetUrlOptions): Promise<string> {
    return `/api/media/${encodeURIComponent(key)}`;
  }

  async getMetadata(key: string): Promise<StorageMetadata | null> {
    return {
      key,
      sizeBytes: 0,
      storageProvider: 'telegram',
    };
  }

  async exists(key: string): Promise<boolean> {
    return true;
  }
}