'use client';

import { useState } from 'react';
import { DriveFile, MOCK_COMMUNITIES } from '@/lib/mock-data';
import {
  Sparkles,
  X,
  Share2,
  Globe,
  Users,
  Lock,
  CheckCircle2,
  Layers,
  ArrowRight,
  MessageSquare
} from 'lucide-react';

interface PublishToSocialModalProps {
  file: DriveFile | null;
  isOpen: boolean;
  onClose: () => void;
  onPublished?: () => void;
}

export function PublishToSocialModal({
  file,
  isOpen,
  onClose,
  onPublished,
}: PublishToSocialModalProps) {
  const [destination, setDestination] = useState<'feed' | 'community' | 'story' | 'dm'>('feed');
  const [selectedCommunity, setSelectedCommunity] = useState('technology');
  const [postTitle, setPostTitle] = useState('');
  const [postDescription, setPostDescription] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'followers_only' | 'private'>('public');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !file) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        onPublished?.();
      }, 1500);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-card border border-border/60 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/40 bg-secondary/20">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-sm sm:text-base text-foreground">
                Publish to Social Universe
              </h2>
              <p className="text-xs text-muted-foreground">
                Upload once, use everywhere • Zero-copy reference
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

        {isSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-foreground">Published Successfully!</h3>
              <p className="text-xs text-muted-foreground">
                Your file is now live in the social feed without duplicate storage overhead.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* File info card */}
            <div className="p-3.5 rounded-2xl bg-secondary/30 border border-border/40 flex items-center justify-between gap-3 text-xs">
              <div className="min-w-0">
                <span className="font-bold text-foreground truncate block">{file.name}</span>
                <span className="text-muted-foreground capitalize">
                  {file.category} • {(file.sizeBytes / 1048576).toFixed(1)} MB • {file.storageProvider}
                </span>
              </div>
              <span className="px-2.5 py-1 rounded-xl bg-primary/10 text-primary font-semibold text-[11px] shrink-0 border border-primary/20">
                Zero Duplication
              </span>
            </div>

            {/* Target Destination Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground">Publish Destination</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'feed', label: 'Public Feed', icon: Globe },
                  { id: 'community', label: 'Community', icon: Users },
                  { id: 'story', label: 'Story (24h)', icon: Sparkles },
                  { id: 'dm', label: 'Direct Chat', icon: MessageSquare },
                ].map((dest) => {
                  const Icon = dest.icon;
                  const isSelected = destination === dest.id;
                  return (
                    <button
                      type="button"
                      key={dest.id}
                      onClick={() => setDestination(dest.id as any)}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border text-xs font-semibold transition-all ${
                        isSelected
                          ? 'bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20'
                          : 'bg-card text-muted-foreground hover:bg-secondary/60 border-border/60'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{dest.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Community dropdown if destination is community */}
            {destination === 'community' && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Select Target Community</label>
                <select
                  value={selectedCommunity}
                  onChange={(e) => setSelectedCommunity(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-secondary/60 border border-border/60 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {MOCK_COMMUNITIES.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      c/{c.slug} — {c.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Post Title</label>
              <input
                type="text"
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                placeholder={file.name.replace(/\.[^/.]+$/, '')}
                className="w-full px-3.5 py-2 rounded-xl bg-secondary/40 border border-border/60 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Caption & Commentary</label>
              <textarea
                value={postDescription}
                onChange={(e) => setPostDescription(e.target.value)}
                rows={3}
                placeholder="Share your perspective with the freedom network..."
                className="w-full px-3.5 py-2 rounded-xl bg-secondary/40 border border-border/60 text-xs focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            {/* Submit */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground text-xs font-semibold border border-border/50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-md shadow-primary/20 hover:opacity-90 transition-all disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Linking...' : 'Publish to Network'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}