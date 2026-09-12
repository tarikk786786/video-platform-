import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { getStorageProvider } from '@/lib/storage';
import path from 'path';
import fs from 'fs';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const title = (formData.get('title') as string) || 'Untitled';
    const description = (formData.get('description') as string) || '';
    const type = (formData.get('type') as string) || 'video';
    const category = (formData.get('category') as string) || 'General';
    const visibility = (formData.get('visibility') as string) || 'public';
    const userId = (formData.get('userId') as string) || '00000000-0000-0000-0000-000000000000';

    if (!file && type !== 'text') {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const supabase = createServiceClient();
    const contentId = crypto.randomUUID();

    const { error: contentError } = await supabase
      .from('contents')
      .insert({
        id: contentId,
        user_id: userId,
        type,
        title,
        description,
        category,
        visibility,
        status: file ? 'processing' : 'published',
        published_at: file ? null : new Date().toISOString(),
      });

    if (contentError) {
      console.error('[UploadAPI] DB Error creating content:', contentError);
    }

    if (!file) {
      return NextResponse.json({
        success: true,
        contentId,
        message: 'Text post published successfully',
      });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = path.extname(file.name) || (type === 'video' ? '.mp4' : '.jpg');
    
    const tempDir = path.join(process.cwd(), 'worker', 'temp');
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
    
    const stagedPath = path.join(tempDir, `${contentId}_upload${ext}`);
    await fs.promises.writeFile(stagedPath, buffer);

    const { error: jobError } = await supabase
      .from('media_jobs')
      .insert({
        content_id: contentId,
        job_type: type === 'video' ? 'thumbnail' : 'telegram_upload',
        status: 'queued',
        priority: 10,
        payload: {
          localPath: stagedPath,
          originalName: file.name,
          contentType: file.type,
          size: file.size,
        },
      });

    if (jobError) {
      console.warn('[UploadAPI] Media job table queueing error:', jobError);
    }

    if (type !== 'video') {
      const storage = getStorageProvider();
      const uploadRes = await storage.upload(buffer, `uploads/${contentId}${ext}`, {
        contentType: file.type,
        filename: file.name,
      });

      await supabase
        .from('content_assets')
        .insert({
          content_id: contentId,
          storage_provider: uploadRes.storageProvider,
          storage_key: uploadRes.key,
          mime_type: uploadRes.mimeType,
          size_bytes: uploadRes.sizeBytes,
          telegram_file_id: uploadRes.telegramFileId,
        });

      await supabase
        .from('contents')
        .update({ status: 'published', published_at: new Date().toISOString() })
        .eq('id', contentId);
    }

    return NextResponse.json({
      success: true,
      contentId,
      status: type === 'video' ? 'processing' : 'published',
      message: 'Upload received and queued for media processing',
    });
  } catch (err: any) {
    console.error('[UploadAPI] Handler error:', err);
    return NextResponse.json({ error: err.message || 'Upload failed' }, { status: 500 });
  }
}