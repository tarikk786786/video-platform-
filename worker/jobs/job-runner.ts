import { createServiceClient } from '../../lib/supabase/service';
import { getStorageProvider } from '../../lib/storage';
import { VideoProcessor } from '../processor/video-processor';
import fs from 'fs';
import path from 'path';

export class JobRunner {
  private isProcessing = false;

  async processNextJob(): Promise<boolean> {
    if (this.isProcessing) return false;
    this.isProcessing = true;

    try {
      const supabase = createServiceClient();
      
      const { data: jobs, error } = await supabase
        .from('media_jobs')
        .select('*')
        .eq('status', 'queued')
        .order('priority', { ascending: false })
        .order('created_at', { ascending: true })
        .limit(1);

      if (error || !jobs || jobs.length === 0) {
        return false;
      }

      const job = jobs[0];
      console.log(`[JobRunner] Processing job ${job.id} of type: ${job.job_type}`);

      await supabase
        .from('media_jobs')
        .update({
          status: 'processing',
          started_at: new Date().toISOString(),
          attempts: (job.attempts || 0) + 1,
        })
        .eq('id', job.id);

      const payload = job.payload || {};
      const storage = getStorageProvider();

      if (job.job_type === 'thumbnail' || job.job_type === 'metadata' || job.job_type === 'telegram_upload') {
        const tempDir = path.join(process.cwd(), 'worker', 'temp');
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

        if (payload.localPath && fs.existsSync(payload.localPath)) {
          const processed = await VideoProcessor.processVideo(payload.localPath, job.content_id);

          const fileBuffer = await fs.promises.readFile(payload.localPath);
          const uploadRes = await storage.upload(fileBuffer, `videos/${job.content_id}.mp4`, {
            contentType: 'video/mp4',
            filename: `${job.content_id}.mp4`,
          });

          await supabase
            .from('content_assets')
            .upsert({
              content_id: job.content_id,
              storage_provider: uploadRes.storageProvider,
              storage_key: uploadRes.key,
              mime_type: uploadRes.mimeType,
              size_bytes: uploadRes.sizeBytes,
              duration_seconds: processed.metadata.durationSeconds,
              width: processed.metadata.width,
              height: processed.metadata.height,
              thumbnail_key: processed.thumbnailKey,
              telegram_file_id: uploadRes.telegramFileId,
              telegram_message_id: uploadRes.telegramMessageId,
              telegram_chat_id: uploadRes.telegramChatId,
            });

          await supabase
            .from('contents')
            .update({
              status: 'published',
              published_at: new Date().toISOString(),
            })
            .eq('id', job.content_id);
        }
      }

      await supabase
        .from('media_jobs')
        .update({
          status: 'completed',
          progress_percent: 100,
          completed_at: new Date().toISOString(),
        })
        .eq('id', job.id);

      console.log(`[JobRunner] Successfully finished job ${job.id}`);
      return true;
    } catch (err: any) {
      console.error('[JobRunner] Error processing job:', err);
      return false;
    } finally {
      this.isProcessing = false;
    }
  }
}