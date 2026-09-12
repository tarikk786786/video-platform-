'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { MOCK_DRIVE_FILES, DriveFile } from '@/lib/mock-data';
import { UniversalFilePreview } from '@/components/drive/universal-file-preview';
import {
  HardDrive,
  Download,
  Lock,
  Unlock,
  ShieldCheck,
  Clock,
  Eye,
  Sparkles,
  ArrowRight,
  File,
  CheckCircle2,
  Share2
} from 'lucide-react';

interface SharePageProps {
  params: Promise<{ token: string }>;
}

export default function SharePortalPage({ params }: SharePageProps) {
  const resolvedParams = use(params);
  const token = resolvedParams.token;

  // Mock share record
  const file: DriveFile = MOCK_DRIVE_FILES[0];
  const [isProtected, setIsProtected] = useState(token.includes('lock'));
  const [password, setPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(!token.includes('lock'));
  const [previewOpen, setPreviewOpen] = useState(false);
  const [savedToDrive, setSavedToDrive] = useState(false);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '1234' || password.length > 0) {
      setIsUnlocked(true);
    } else {
      alert('Incorrect password. Please try again.');
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes >= 1073741824) return (bytes / 1073741824).toFixed(2) + ' GB';
    if (bytes >= 1048576) return (bytes / 1048576).toFixed(1) + ' MB';
    if (bytes >= 1024) return (bytes / 1024).toFixed(0) + ' KB';
    return bytes + ' B';
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8">
      {/* Top Navbar Brand */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between pb-8">
        <Link href="/home" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-primary to-indigo-500 flex items-center justify-center text-primary-foreground font-black text-lg shadow-lg shadow-primary/20">
            F
          </div>
          <div>
            <span className="font-black text-base tracking-tight text-foreground">FreedomPlay</span>
            <span className="text-[10px] block text-primary font-bold uppercase tracking-widest">Share Portal</span>
          </div>
        </Link>

        <Link
          href="/drive"
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-secondary text-xs font-semibold hover:bg-secondary/80 border border-border/50 transition-colors"
        >
          <HardDrive className="w-3.5 h-3.5 text-primary" />
          <span>Go to My Drive</span>
        </Link>
      </div>

      {/* Main Card */}
      <div className="max-w-xl mx-auto w-full">
        {isProtected && !isUnlocked ? (
          /* Password Gate Card */
          <div className="rounded-3xl bg-card border border-border/60 shadow-2xl p-8 space-y-6 text-center">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center mx-auto shadow-inner">
              <Lock className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h1 className="text-xl font-black text-foreground">Protected Share Link</h1>
              <p className="text-xs text-muted-foreground">
                This file or folder has been encrypted with a passkey by the creator.
              </p>
            </div>

            <form onSubmit={handleUnlock} className="space-y-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full px-4 py-3 rounded-2xl bg-secondary/50 border border-border/60 text-sm text-center focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-bold text-xs shadow-md shadow-primary/20 hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                <Unlock className="w-4 h-4" />
                <span>Unlock & Access Files</span>
              </button>
            </form>
          </div>
        ) : (
          /* Unlocked File Share Card */
          <div className="rounded-3xl bg-card border border-border/60 shadow-2xl overflow-hidden">
            {/* Header Banner */}
            <div className="relative h-44 bg-gradient-to-r from-primary/20 via-indigo-500/10 to-secondary p-6 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-background/80 backdrop-blur-md text-foreground text-xs font-semibold border border-border/40 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  <span>Permanent Access</span>
                </span>

                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[11px] font-bold border border-emerald-500/20 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Verified Clean</span>
                </span>
              </div>

              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"
                  alt="Owner"
                  className="w-10 h-10 rounded-xl object-cover ring-2 ring-background shadow-md"
                />
                <div>
                  <span className="text-xs text-muted-foreground">Shared by</span>
                  <p className="text-xs font-bold text-foreground leading-tight">Freedom Architecture Labs</p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center text-primary shadow-inner shrink-0 border border-border/50">
                  <File className="w-7 h-7" />
                </div>
                <div className="space-y-1 min-w-0">
                  <h1 className="font-extrabold text-base sm:text-lg text-foreground truncate">
                    {file.name}
                  </h1>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-bold text-foreground">{formatSize(file.sizeBytes)}</span>
                    <span>•</span>
                    <span className="uppercase font-semibold">{file.extension}</span>
                    <span>•</span>
                    <span className="capitalize">{file.storageProvider} Object Store</span>
                  </div>
                </div>
              </div>

              {/* SHA-256 Checksum pill */}
              <div className="p-3 rounded-2xl bg-secondary/30 border border-border/40 text-xs flex items-center justify-between">
                <span className="text-muted-foreground text-[11px]">Integrity Hash:</span>
                <span className="font-mono text-[11px] text-foreground truncate max-w-[240px]">
                  {file.sha256Hash}
                </span>
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => setPreviewOpen(true)}
                    className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-secondary hover:bg-secondary/80 text-foreground text-xs font-bold border border-border/60 transition-colors"
                  >
                    <Eye className="w-4 h-4 text-primary" />
                    <span>Open Preview</span>
                  </button>

                  <a
                    href={file.storageUrl || '#'}
                    download={file.name}
                    className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-primary text-primary-foreground text-xs font-bold shadow-md shadow-primary/20 hover:opacity-90 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download File</span>
                  </a>
                </div>

                {/* 1-Click Save to My Drive Bridge */}
                <button
                  onClick={() => {
                    setSavedToDrive(true);
                    setTimeout(() => setSavedToDrive(false), 3000);
                  }}
                  className={`w-full py-3 rounded-2xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    savedToDrive
                      ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                      : 'bg-card hover:bg-secondary/40 text-foreground border-border/60'
                  }`}
                >
                  {savedToDrive ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>Saved to Your Personal Cloud Drive!</span>
                    </>
                  ) : (
                    <>
                      <HardDrive className="w-4 h-4 text-primary" />
                      <span>Save to My Drive (Zero-Byte Reference)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Universal Preview Modal */}
      <UniversalFilePreview
        file={file}
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
      />

      {/* Footer */}
      <div className="text-center text-xs text-muted-foreground pt-8">
        Protected by FreedomPlay Zero-Knowledge Protocol • End-to-End Hash Verified
      </div>
    </div>
  );
}