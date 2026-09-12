import { FFmpegRunner, MediaMetadata } from '../ffmpeg/ffmpeg-runner';
import { getStorageProvider } from '../../lib/storage';
import path from 'path';
import fs from 'fs';

export interface ProcessVideoResult {
  metadata: MediaMetadata;
  thumbnailKey?: string;
  telegramFileId?: string;
}

export class VideoProcessor {
  static async processVideo(
    tempFilePath: string,
    contentId: string
  ): Promise<ProcessVideoResult> {
    const tempDir = path.dirname(tempFilePath);
    const thumbPath = path.join(tempDir, `thumb_${contentId}.jpg`);

    const metadata = await FFmpegRunner.getMetadata(tempFilePath);
    const thumbOk = await FFmpegRunner.extractThumbnail(tempFilePath, thumbPath, Math.min(1, metadata.durationSeconds / 2));

    let thumbnailKey: string | undefined;
    if (thumbOk) {
      const storage = getStorageProvider();
      const actualThumbPath = fs.existsSync(thumbPath) ? thumbPath : thumbPath.replace(/\.jpg$/, '.svg');
      if (fs.existsSync(actualThumbPath)) {
        const thumbBuffer = await fs.promises.readFile(actualThumbPath);
        const mime = actualThumbPath.endsWith('.svg') ? 'image/svg+xml' : 'image/jpeg';
        const uploaded = await storage.upload(thumbBuffer, `thumbnails/${contentId}.jpg`, {
          contentType: mime,
          filename: `thumbnail_${contentId}.jpg`,
        });
        thumbnailKey = uploaded.key;
        await fs.promises.unlink(actualThumbPath).catch(() => {});
      }
    }

    return {
      metadata,
      thumbnailKey,
    };
  }
}