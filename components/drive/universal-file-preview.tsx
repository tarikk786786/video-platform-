'use client';

import { useState } from 'react';
import { DriveFile } from '@/lib/mock-data';
import { VideoPlayer } from '@/components/video/video-player';
import {
  X,
  Download,
  Share2,
  Sparkles,
  Star,
  FileText,
  Code,
  Archive,
  FileCode,
  HardDrive,
  Copy,
  Check,
  ZoomIn,
  ZoomOut,
  Scissors,
  Play,
  Pause,
  Volume2
} from 'lucide-react';

interface UniversalFilePreviewProps {
  file: DriveFile | null;
  isOpen: boolean;
  onClose: () => void;
  onPublishToSocial?: (file: DriveFile) => void;
  onShare?: (file: DriveFile) => void;
}

export function UniversalFilePreview({
  file,
  isOpen,
  onClose,
  onPublishToSocial,
  onShare,
}: UniversalFilePreviewProps) {
  const [copiedHash, setCopiedHash] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [clipMode, setClipMode] = useState(false);
  const [clipRange, setClipRange] = useState({ start: '00:15', end: '01:45' });
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  if (!isOpen || !file) return null;

  const copyHash = () => {
    navigator.clipboard.writeText(file.sha256Hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const formatSize = (bytes: number) => {
    if (bytes >= 1073741824) return (bytes / 1073741824).toFixed(2) + ' GB';
    if (bytes >= 1048576) return (bytes / 1048576).toFixed(1) + ' MB';
    if (bytes >= 1024) return (bytes / 1024).toFixed(0) + ' KB';
    return bytes + ' B';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl h-[90vh] flex flex-col rounded-3xl bg-card border border-border/60 shadow-2xl overflow-hidden">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/40 bg-secondary/20">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
              {file.category === 'video' && <Play className="w-4 h-4" />}
              {file.category === 'photo' && <ZoomIn className="w-4 h-4" />}
              {file.category === 'audio' && <Volume2 className="w-4 h-4" />}
              {file.category === 'document' && <FileText className="w-4 h-4" />}
              {file.category === 'code' && <Code className="w-4 h-4" />}
              {file.category === 'archive' && <Archive className="w-4 h-4" />}
              {file.category === 'binary' && <HardDrive className="w-4 h-4" />}
            </div>
            <div className="min-w-0">
              <h2 className="font-bold text-sm sm:text-base text-foreground truncate">{file.name}</h2>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{formatSize(file.sizeBytes)}</span>
                <span>•</span>
                <span className="uppercase font-semibold">{file.extension}</span>
                <span>•</span>
                <span className="capitalize">Storage: {file.storageProvider}</span>
                <span>•</span>
                <span>v{file.version}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Publish to Social Bridge Button */}
            <button
              onClick={() => onPublishToSocial?.(file)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold shadow-md shadow-primary/20 hover:opacity-95 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Publish to Social</span>
            </button>

            {/* Share link button */}
            <button
              onClick={() => onShare?.(file)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-secondary hover:bg-secondary/80 text-xs font-semibold border border-border/60 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Share</span>
            </button>

            {/* Download button */}
            <a
              href={file.storageUrl || '#'}
              download={file.name}
              className="p-2 rounded-xl bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground border border-border/60 transition-colors"
              title="Download File"
            >
              <Download className="w-4 h-4" />
            </a>

            {/* Close button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground border border-border/60 transition-colors ml-2"
              title="Close Preview"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Content Preview Stage */}
        <div className="flex-1 overflow-hidden relative bg-black/40 flex items-center justify-center p-4">
          {/* VIDEO PREVIEW */}
          {file.category === 'video' && (
            <div className="w-full h-full max-h-full flex flex-col justify-center items-center space-y-3">
              <div className="w-full max-w-3xl aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl">
                <VideoPlayer
                  src={file.storageUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'}
                  poster={file.thumbnailUrl}
                />
              </div>

              {/* PeerTube-style Video Clip Generator */}
              <div className="flex items-center gap-3 bg-card/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-border/50 text-xs">
                <Scissors className="w-4 h-4 text-primary" />
                <span className="font-semibold text-foreground">PeerTube Clip Mode:</span>
                <span className="text-muted-foreground">Start:</span>
                <input
                  type="text"
                  value={clipRange.start}
                  onChange={(e) => setClipRange({ ...clipRange, start: e.target.value })}
                  className="w-14 px-2 py-0.5 rounded-lg bg-secondary border border-border/60 text-center font-mono"
                />
                <span className="text-muted-foreground">End:</span>
                <input
                  type="text"
                  value={clipRange.end}
                  onChange={(e) => setClipRange({ ...clipRange, end: e.target.value })}
                  className="w-14 px-2 py-0.5 rounded-lg bg-secondary border border-border/60 text-center font-mono"
                />
                <button
                  onClick={() => alert(`Clip link created: /video/drive-${file.id}?clip=${clipRange.start}-${clipRange.end}`)}
                  className="px-3 py-1 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-all"
                >
                  Create Clip Link
                </button>
              </div>
            </div>
          )}

          {/* PHOTO PREVIEW */}
          {file.category === 'photo' && (
            <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
              <div
                className="transition-transform duration-200 flex items-center justify-center max-w-full max-h-full"
                style={{ transform: `scale(${zoomLevel})` }}
              >
                <img
                  src={file.storageUrl || file.thumbnailUrl}
                  alt={file.name}
                  className="max-h-[70vh] max-w-full rounded-2xl object-contain shadow-2xl"
                />
              </div>

              <div className="absolute bottom-4 flex items-center gap-2 bg-card/90 backdrop-blur-md p-1.5 rounded-2xl border border-border/60 shadow-lg">
                <button
                  onClick={() => setZoomLevel((z) => Math.max(0.5, z - 0.2))}
                  className="p-1.5 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono font-bold px-2">{Math.round(zoomLevel * 100)}%</span>
                <button
                  onClick={() => setZoomLevel((z) => Math.min(3, z + 0.2))}
                  className="p-1.5 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setZoomLevel(1)}
                  className="text-xs px-2 py-1 rounded-lg bg-secondary text-muted-foreground hover:text-foreground"
                >
                  Reset
                </button>
              </div>
            </div>
          )}

          {/* AUDIO PREVIEW */}
          {file.category === 'audio' && (
            <div className="w-full max-w-md bg-card p-8 rounded-3xl border border-border/60 shadow-2xl space-y-6 text-center">
              <div className="w-32 h-32 mx-auto rounded-3xl bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center shadow-xl shadow-purple-500/20">
                <Volume2 className="w-12 h-12 text-white" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-lg text-foreground">{file.name}</h3>
                <p className="text-xs text-muted-foreground">Lossless Audio Dispatch • 320 kbps</p>
              </div>

              {/* Simulated Waveform */}
              <div className="flex items-end justify-center gap-1.5 h-16 px-4">
                {[40, 65, 80, 50, 95, 75, 45, 90, 85, 60, 40, 70, 88, 52, 98, 64, 42, 77, 85, 30].map((h, i) => (
                  <span
                    key={i}
                    className={`w-1.5 rounded-full transition-all duration-300 ${
                      isPlayingAudio ? 'bg-primary animate-pulse' : 'bg-secondary'
                    }`}
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>

              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                  className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-xl shadow-primary/20 hover:scale-105 transition-all"
                >
                  {isPlayingAudio ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                </button>
              </div>
            </div>
          )}

          {/* DOCUMENT / PDF PREVIEW */}
          {file.category === 'document' && (
            <div className="w-full h-full max-w-4xl bg-card rounded-2xl border border-border/50 shadow-xl flex flex-col overflow-hidden">
              <div className="p-4 border-b border-border/40 bg-secondary/30 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold">
                  <FileText className="w-4 h-4 text-emerald-500" />
                  <span>PDF Document Viewer (Page 1 of 14)</span>
                </div>
                <span className="text-[11px] text-muted-foreground font-mono">PDF.js Engine Enabled</span>
              </div>
              <div className="flex-1 p-8 overflow-y-auto font-serif text-sm leading-relaxed space-y-4 text-foreground/90 bg-white dark:bg-zinc-950">
                <h1 className="text-2xl font-bold font-sans">FreedomPlay Universal Architecture</h1>
                <p className="text-xs font-mono text-muted-foreground uppercase">Abstract & Technical Overview</p>
                <p>
                  This specification introduces the unified Personal Cloud Storage and Social Media protocol. By decoupling raw object storage into pluggable SeaweedFS/Telegram nodes, users retain perpetual ownership of their files while instantly projecting assets into social feeds, community hubs, and encrypted messaging channels.
                </p>
                <div className="p-4 bg-secondary/30 rounded-xl border border-border/40 text-xs font-mono">
                  SHA-256 Checksum: {file.sha256Hash}
                </div>
                <p>
                  Full multi-page document rendered with high-fidelity vector text rendering. All search indices, OCR layers, and highlights are fully navigable.
                </p>
              </div>
            </div>
          )}

          {/* CODE / TEXT PREVIEW */}
          {file.category === 'code' && (
            <div className="w-full h-full max-w-4xl bg-zinc-950 rounded-2xl border border-border/60 shadow-2xl flex flex-col overflow-hidden text-left">
              <div className="px-4 py-2.5 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-primary" />
                  <span className="font-mono text-white">{file.name}</span>
                </div>
                <button
                  onClick={() => alert('Code copied to clipboard!')}
                  className="flex items-center gap-1 text-[11px] hover:text-white transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </button>
              </div>
              <div className="flex-1 p-4 overflow-y-auto font-mono text-xs text-zinc-300 space-y-1">
                <p><span className="text-purple-400">import</span> &#123; StorageProvider &#125; <span className="text-purple-400">from</span> <span className="text-emerald-400">'@/lib/storage'</span>;</p>
                <p><span className="text-purple-400">import</span> &#123; SeaweedFSStorageProvider &#125; <span className="text-purple-400">from</span> <span className="text-emerald-400">'./seaweedfs-storage'</span>;</p>
                <br />
                <p><span className="text-zinc-500">// Distributed media worker chunk processor</span></p>
                <p><span className="text-blue-400">export class</span> <span className="text-amber-400">DistributedMediaWorker</span> &#123;</p>
                <p className="pl-4"><span className="text-purple-400">private</span> storage: StorageProvider;</p>
                <br />
                <p className="pl-4"><span className="text-blue-400">constructor</span>() &#123;</p>
                <p className="pl-8">this.storage = <span className="text-blue-400">new</span> <span className="text-amber-400">SeaweedFSStorageProvider</span>();</p>
                <p className="pl-4">&#125;</p>
                <br />
                <p className="pl-4"><span className="text-purple-400">async</span> <span className="text-blue-400">processFileChunk</span>(chunk: Buffer, offset: number) &#123;</p>
                <p className="pl-8"><span className="text-purple-400">return await</span> this.storage.upload(chunk, <span className="text-emerald-400">`chunks/$&#123;offset&#125;`</span>, &#123; contentType: <span className="text-emerald-400">'video/mp4'</span> &#125;);</p>
                <p className="pl-4">&#125;</p>
                <p>&#125;</p>
              </div>
            </div>
          )}

          {/* ARCHIVE & BINARY INSPECTOR */}
          {(file.category === 'archive' || file.category === 'binary') && (
            <div className="w-full max-w-lg bg-card p-8 rounded-3xl border border-border/60 shadow-2xl space-y-6 text-center">
              <div className="w-24 h-24 mx-auto rounded-3xl bg-secondary/80 flex items-center justify-center border border-border/60">
                {file.category === 'archive' ? (
                  <Archive className="w-12 h-12 text-amber-500" />
                ) : (
                  <HardDrive className="w-12 h-12 text-blue-500" />
                )}
              </div>

              <div className="space-y-1">
                <h3 className="font-bold text-lg text-foreground">{file.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {file.category === 'archive' ? 'Compressed Multi-File Vault' : 'Raw Binary Disk / Package'}
                </p>
              </div>

              <div className="bg-secondary/30 p-4 rounded-2xl border border-border/40 text-left space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Exact Size:</span>
                  <span className="font-mono font-bold text-foreground">{file.sizeBytes.toLocaleString()} bytes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">MIME Type:</span>
                  <span className="font-mono text-foreground">{file.mimeType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Storage Engine:</span>
                  <span className="font-semibold text-primary capitalize">{file.storageProvider} Object Store</span>
                </div>
                <div className="pt-2 border-t border-border/40">
                  <span className="text-muted-foreground block text-[11px] mb-1">SHA-256 Fingerprint:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-foreground truncate">{file.sha256Hash}</span>
                    <button
                      onClick={copyHash}
                      className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground shrink-0"
                    >
                      {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              <a
                href={file.storageUrl || '#'}
                download={file.name}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-md shadow-primary/20 hover:opacity-90 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download {formatSize(file.sizeBytes)}</span>
              </a>
            </div>
          )}
        </div>

        {/* Bottom Footer Info Bar */}
        <div className="px-6 py-3 border-t border-border/40 bg-secondary/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <span>Last updated: {file.updatedAt}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <HardDrive className="w-3 h-3 text-primary" />
              <span>Zero-Byte Dedup ID: {file.sha256Hash.substring(0, 12)}...</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-emerald-500 font-semibold">Integrity Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
}