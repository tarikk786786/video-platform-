import { NextRequest, NextResponse } from 'next/server';
import { getStorageProvider } from '@/lib/storage';
import path from 'path';
import fs from 'fs';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: segments } = await params;
    const mediaKey = segments.join('/');

    const safeKey = mediaKey.replace(/[^a-zA-Z0-9_.-]/g, '_');
    const localFilePath = path.join(process.cwd(), 'uploads', safeKey);

    if (fs.existsSync(localFilePath)) {
      const stat = await fs.promises.stat(localFilePath);
      const range = req.headers.get('range');
      
      const ext = path.extname(localFilePath).toLowerCase();
      let contentType = 'application/octet-stream';
      if (ext === '.mp4') contentType = 'video/mp4';
      else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
      else if (ext === '.png') contentType = 'image/png';
      else if (ext === '.svg') contentType = 'image/svg+xml';
      else if (ext === '.mp3') contentType = 'audio/mpeg';

      if (range) {
        const parts = range.replace(/bytes=/, '').split('-');
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
        const chunksize = end - start + 1;

        const stream = fs.createReadStream(localFilePath, { start, end });
        // @ts-ignore
        return new NextResponse(stream as any, {
          status: 206,
          headers: {
            'Content-Range': `bytes ${start}-${end}/${stat.size}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize.toString(),
            'Content-Type': contentType,
          },
        });
      }

      const fileBuffer = await fs.promises.readFile(localFilePath);
      return new NextResponse(new Uint8Array(fileBuffer), {
        headers: {
          'Content-Type': contentType,
          'Content-Length': stat.size.toString(),
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }

    const storage = getStorageProvider();
    const buffer = await storage.download(mediaKey);

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (err: any) {
    return new NextResponse('Media not found or stream error', { status: 404 });
  }
}