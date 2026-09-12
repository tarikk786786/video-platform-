'use client';

import { useState, useRef } from 'react';
import { DriveFile } from '@/lib/mock-data';
import {
  UploadCloud,
  X,
  Pause,
  Play,
  CheckCircle2,
  AlertCircle,
  File,
  Layers,
  Sparkles,
  RefreshCw,
  HardDrive
} from 'lucide-react';

interface UploadItem {
  id: string;
  file: File;
  progress: number;
  totalChunks: number;
  uploadedChunks: number;
  status: 'pending' | 'uploading' | 'paused' | 'completed' | 'dedup' | 'error';
  speedMBs: number;
  result?: DriveFile;
}

interface ChunkedUploaderProps {
  isOpen: boolean;
  currentFolderId: string | null;
  onClose: () => void;
  onUploadSuccess: (file: DriveFile) => void;
}

const CHUNK_SIZE = 5 * 1024 * 1024; // 5 MB chunks

export function ChunkedUploader({
  isOpen,
  currentFolderId,
  onClose,
  onUploadSuccess,
}: ChunkedUploaderProps) {
  const [items, setItems] = useState<UploadItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFiles = (fileList: FileList) => {
    const newItems: UploadItem[] = Array.from(fileList).map((f) => ({
      id: `up-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      file: f,
      progress: 0,
      totalChunks: Math.ceil(f.size / CHUNK_SIZE) || 1,
      uploadedChunks: 0,
      status: 'uploading',
      speedMBs: Math.round((8 + Math.random() * 12) * 10) / 10,
    }));

    setItems((prev) => [...prev, ...newItems]);
    newItems.forEach((item) => startChunkedUpload(item));
  };

  const startChunkedUpload = async (item: UploadItem) => {
    const totalChunks = item.totalChunks;
    let currentChunk = 0;

    // Simulate SHA-256 fingerprint generation
    const sha256 = `sha256_${item.file.name}_${item.file.size}`;

    const uploadInterval = setInterval(async () => {
      currentChunk++;
      const progress = Math.min(100, Math.round((currentChunk / totalChunks) * 100));

      setItems((prev) =>
        prev.map((i) =>
          i.id === item.id
            ? { ...i, uploadedChunks: currentChunk, progress }
            : i
        )
      );

      if (currentChunk >= totalChunks) {
        clearInterval(uploadInterval);

        try {
          const res = await fetch('/api/drive/upload/commit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              uploadId: item.id,
              fileName: item.file.name,
              fileSize: item.file.size,
              mimeType: item.file.type || 'application/octet-stream',
              folderId: currentFolderId,
              sha256Hash: sha256,
            }),
          });

          const data = await res.json();
          if (data.success) {
            setItems((prev) =>
              prev.map((i) =>
                i.id === item.id
                  ? {
                      ...i,
                      status: data.dedupHit ? 'dedup' : 'completed',
                      progress: 100,
                      result: data.file,
                    }
                  : i
              )
            );
            onUploadSuccess(data.file);
          }
        } catch (err) {
          setItems((prev) =>
            prev.map((i) => (i.id === item.id ? { ...i, status: 'error' } : i))
          );
        }
      }
    }, 400);
  };

  const formatSize = (bytes: number) => {
    if (bytes >= 1073741824) return (bytes / 1073741824).toFixed(2) + ' GB';
    if (bytes >= 1048576) return (bytes / 1048576).toFixed(1) + ' MB';
    if (bytes >= 1024) return (bytes / 1024).toFixed(0) + ' KB';
    return bytes + ' B';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-card border border-border/60 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/40 bg-secondary/20">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-sm sm:text-base text-foreground">
                Resumable Chunked Upload Engine
              </h2>
              <p className="text-xs text-muted-foreground">
                Slices large files into 5MB chunks • SHA-256 zero-byte instant deduplication
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground border border-border/50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drag & Drop Zone */}
        <div className="p-6 space-y-4 flex-1 overflow-y-auto">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              if (e.dataTransfer.files?.length) {
                handleFiles(e.dataTransfer.files);
              }
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
              isDragging
                ? 'border-primary bg-primary/5 scale-[0.99]'
                : 'border-border/60 hover:border-primary/50 hover:bg-secondary/20'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.length) {
                  handleFiles(e.target.files);
                }
              }}
            />
            <div className="w-14 h-14 rounded-2xl bg-secondary/80 flex items-center justify-center text-primary shadow-inner">
              <UploadCloud className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <p className="font-bold text-sm text-foreground">
                Click to browse or drag and drop any file
              </p>
              <p className="text-xs text-muted-foreground">
                Supports videos (up to 4K), images, audio, documents, code, archives, and binaries
              </p>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-muted-foreground pt-1">
              <span className="flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-primary" />
                <span>5MB Chunk Slices</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <HardDrive className="w-3.5 h-3.5 text-emerald-500" />
                <span>Auto-Deduplication</span>
              </span>
            </div>
          </div>

          {/* Active Upload Queue */}
          {items.length > 0 && (
            <div className="space-y-3 pt-2">
              <h3 className="font-bold text-xs text-foreground flex items-center justify-between">
                <span>Upload Queue ({items.length})</span>
                <span className="text-[11px] text-muted-foreground">Parallel S3/SeaweedFS Stream</span>
              </h3>

              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-card border border-border/50 space-y-2.5 shadow-sm"
                  >
                    <div className="flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <File className="w-4 h-4 text-primary shrink-0" />
                        <div className="min-w-0">
                          <span className="font-semibold text-foreground truncate block">
                            {item.file.name}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {formatSize(item.file.size)} • {item.uploadedChunks}/{item.totalChunks} chunks
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {item.status === 'uploading' && (
                          <span className="text-[11px] font-mono text-primary font-bold">
                            {item.speedMBs} MB/s
                          </span>
                        )}
                        {item.status === 'completed' && (
                          <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-500">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Done</span>
                          </span>
                        )}
                        {item.status === 'dedup' && (
                          <span className="flex items-center gap-1 text-[11px] font-semibold text-indigo-400">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Instant Dedup!</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-1.5 rounded-full bg-secondary overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          item.status === 'completed'
                            ? 'bg-emerald-500'
                            : item.status === 'dedup'
                            ? 'bg-indigo-500'
                            : 'bg-primary'
                        }`}
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-border/40 bg-secondary/10 flex items-center justify-between text-xs text-muted-foreground">
          <span>Automatic reconnect on network pause</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground font-semibold border border-border/50 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}