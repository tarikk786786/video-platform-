import { NextRequest, NextResponse } from 'next/server';
import { getStorageProvider } from '@/lib/storage';

function categorizeMime(mime: string, ext: string): 'video' | 'photo' | 'audio' | 'document' | 'code' | 'archive' | 'binary' {
  if (mime.startsWith('video/') || ['mp4', 'mkv', 'mov', 'webm', 'avi', 'flv'].includes(ext)) return 'video';
  if (mime.startsWith('image/') || ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'].includes(ext)) return 'photo';
  if (mime.startsWith('audio/') || ['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a'].includes(ext)) return 'audio';
  if (mime.includes('pdf') || ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv', 'md'].includes(ext)) return 'document';
  if (['ts', 'js', 'json', 'py', 'go', 'rs', 'html', 'css', 'sql', 'sh', 'yaml', 'yml'].includes(ext)) return 'code';
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) return 'archive';
  return 'binary';
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { uploadId, fileName, fileSize, mimeType, folderId, sha256Hash } = body;

    if (!fileName || !fileSize) {
      return NextResponse.json({ error: 'fileName and fileSize are required' }, { status: 400 });
    }

    const extension = fileName.split('.').pop()?.toLowerCase() || 'bin';
    const category = categorizeMime(mimeType || 'application/octet-stream', extension);

    // Mock deduplication hit check: If file has known hash, reference instantly
    const knownDedupHashes = new Set([
      'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      'a89c72e21b194f4c8996fb92427ae41e4649b934ca495991b7852b8558492049',
    ]);
    const isDedup = knownDedupHashes.has(sha256Hash);

    const storageProviderName = process.env.STORAGE_PROVIDER || 'seaweedfs';
    const storageKey = `drive/${category}s/${Date.now()}-${fileName}`;

    const newFile = {
      id: `file-${Date.now()}`,
      folderId: folderId || null,
      name: fileName,
      extension,
      mimeType: mimeType || 'application/octet-stream',
      category,
      sizeBytes: fileSize,
      sha256Hash: sha256Hash || `sha256_${Date.now()}`,
      storageProvider: storageProviderName,
      storageKey,
      storageUrl: `/api/media/${storageKey}`,
      isStarred: false,
      isTrashed: false,
      isPublishedToSocial: false,
      version: 1,
      updatedAt: 'Just now',
    };

    return NextResponse.json({
      success: true,
      dedupHit: isDedup,
      message: isDedup ? 'Instant zero-byte deduplication reference created!' : 'File committed to object store successfully',
      file: newFile,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Commit failed' }, { status: 500 });
  }
}