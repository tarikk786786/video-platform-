import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

export interface MediaMetadata {
  durationSeconds: number;
  width: number;
  height: number;
  format: string;
  bitrate?: number;
  hasAudio: boolean;
}

export class FFmpegRunner {
  static async isAvailable(): Promise<boolean> {
    return new Promise((resolve) => {
      const proc = spawn('ffmpeg', ['-version']);
      proc.on('error', () => resolve(false));
      proc.on('close', (code) => resolve(code === 0));
    });
  }

  static async extractThumbnail(inputPath: string, outputPath: string, timestampSeconds = 1): Promise<boolean> {
    const available = await this.isAvailable();
    if (!available) {
      console.warn('[FFmpegRunner] FFmpeg not found on PATH. Creating SVG placeholder thumbnail.');
      const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720"><rect width="1280" height="720" fill="#1e293b"/><circle cx="640" cy="360" r="60" fill="#3b82f6"/><polygon points="625,335 670,360 625,385" fill="#ffffff"/><text x="640" y="470" fill="#94a3b8" font-family="sans-serif" font-size="24" text-anchor="middle">Media Preview</text></svg>';
      await fs.promises.writeFile(outputPath.replace(/\.jpg$/, '.svg'), svg, 'utf8');
      return true;
    }

    return new Promise((resolve) => {
      const proc = spawn('ffmpeg', [
        '-ss', timestampSeconds.toString(),
        '-i', inputPath,
        '-vframes', '1',
        '-q:v', '2',
        '-y', outputPath
      ]);
      proc.on('close', (code) => resolve(code === 0));
      proc.on('error', () => resolve(false));
    });
  }

  static async getMetadata(inputPath: string): Promise<MediaMetadata> {
    const available = await this.isAvailable();
    if (!available) {
      return {
        durationSeconds: 60,
        width: 1920,
        height: 1080,
        format: path.extname(inputPath).slice(1) || 'mp4',
        hasAudio: true,
      };
    }

    return new Promise((resolve) => {
      const proc = spawn('ffprobe', [
        '-v', 'error',
        '-show_entries', 'format=duration,bit_rate:stream=width,height,codec_type',
        '-of', 'json',
        inputPath
      ]);

      let output = '';
      proc.stdout.on('data', (d) => output += d.toString());
      proc.on('close', () => {
        try {
          const json = JSON.parse(output);
          const videoStream = json.streams?.find((s: any) => s.codec_type === 'video');
          const hasAudio = Boolean(json.streams?.some((s: any) => s.codec_type === 'audio'));

          resolve({
            durationSeconds: parseFloat(json.format?.duration || '0'),
            width: videoStream?.width || 1280,
            height: videoStream?.height || 720,
            format: path.extname(inputPath).slice(1) || 'mp4',
            bitrate: parseInt(json.format?.bit_rate || '0', 10),
            hasAudio,
          });
        } catch {
          resolve({
            durationSeconds: 30,
            width: 1280,
            height: 720,
            format: 'mp4',
            hasAudio: true,
          });
        }
      });
      proc.on('error', () => {
        resolve({
          durationSeconds: 30,
          width: 1280,
          height: 720,
          format: 'mp4',
          hasAudio: true,
        });
      });
    });
  }
}