'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ContentItem } from '@/lib/mock-data';
import { ReactionsPicker } from '@/components/social/reactions-picker';
import {
  MoreVertical,
  Share2,
  Bookmark,
  Flag,
  CheckCircle2,
  BarChart2,
  MessageSquare,
  Check,
  HardDrive,
} from 'lucide-react';

export function ContentCard({ item }: { item: ContentItem }) {
  const [showMenu, setShowMenu] = useState(false);
  const [saved, setSaved] = useState(false);
  const [savedToDrive, setSavedToDrive] = useState(false);
  const [selectedPollOpt, setSelectedPollOpt] = useState<string | null>(null);

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  return (
    <div className="flex flex-col gap-3 group bg-card/40 backdrop-blur-md rounded-2xl p-3 border border-border/40 hover:border-border/80 transition-all shadow-sm hover:shadow-md">
      {/* If Item is Poll, render Interactive Poll Box */}
      {item.type === 'poll' && item.pollData ? (
        <div className="p-4 rounded-2xl bg-secondary/30 border border-border/40 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-primary">
            <BarChart2 className="w-4 h-4" />
            <span>Community Poll</span>
          </div>

          <h3 className="text-sm font-bold text-foreground leading-snug">{item.pollData.question}</h3>

          <div className="space-y-2 pt-1">
            {item.pollData.options.map((opt) => {
              const isSelected = selectedPollOpt === opt.id;
              const pct = Math.round((opt.votes / (item.pollData?.totalVotes || 1)) * 100);

              return (
                <button
                  key={opt.id}
                  onClick={() => setSelectedPollOpt(opt.id)}
                  className={`w-full text-left p-3 rounded-xl border text-xs font-semibold relative overflow-hidden transition-all flex items-center justify-between ${
                    isSelected ? 'border-primary bg-primary/10' : 'border-border/60 hover:bg-secondary/50 bg-secondary/20'
                  }`}
                >
                  <div
                    className="absolute left-0 top-0 bottom-0 bg-primary/20 transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                  <span className="relative z-10 flex items-center gap-2 text-foreground">
                    {isSelected && <Check className="w-3.5 h-3.5 text-primary" />}
                    {opt.text}
                  </span>
                  <span className="relative z-10 font-mono text-muted-foreground">{pct}%</span>
                </button>
              );
            })}
          </div>

          <div className="text-[11px] text-muted-foreground font-mono">
            {item.pollData.totalVotes.toLocaleString()} total community votes
          </div>
        </div>
      ) : (
        /* Standard Media Thumbnail */
        <div className="relative aspect-video rounded-xl overflow-hidden bg-secondary border border-border/40 group-hover:border-border transition-all duration-300 shadow-sm">
          <Link href={`/video/${item.id}`} className="block w-full h-full">
            <img
              src={item.asset?.thumbnailUrl || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800'}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </Link>

          {item.asset?.durationSeconds && (
            <div className="absolute bottom-2.5 right-2.5 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded-md text-[11px] font-semibold text-white tracking-wider font-mono">
              {formatDuration(item.asset.durationSeconds)}
            </div>
          )}

          <div className="absolute top-2.5 left-2.5 bg-background/80 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-medium text-foreground border border-border/40">
            {item.category}
          </div>
        </div>
      )}

      {/* Author & Info */}
      <div className="flex gap-3 items-start px-0.5">
        <Link href={`/u/${item.author.username}`} className="shrink-0">
          <img
            src={item.author.avatarUrl}
            alt={item.author.displayName}
            className="w-9 h-9 rounded-full object-cover border border-border/40 hover:ring-2 hover:ring-primary transition-all"
          />
        </Link>

        <div className="flex-1 min-w-0">
          <Link href={`/video/${item.id}`}>
            <h3 className="text-sm font-semibold leading-snug line-clamp-2 text-foreground group-hover:text-primary transition-colors">
              {item.title}
            </h3>
          </Link>

          <Link
            href={`/u/${item.author.username}`}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mt-1 transition-colors"
          >
            <span>{item.author.displayName}</span>
            {item.author.isVerified && <CheckCircle2 className="w-3 h-3 text-blue-500 fill-blue-500/20" />}
          </Link>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground/80 mt-0.5 font-normal">
            <span>{formatViews(item.viewCount)} views</span>
            <span>•</span>
            <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* 3-Dot Options Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-secondary transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-8 bg-card border border-border rounded-xl shadow-2xl p-1.5 min-w-[140px] z-30 flex flex-col gap-0.5">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.origin + `/video/${item.id}`);
                  setShowMenu(false);
                }}
                className="flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg text-foreground hover:bg-accent text-left transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Link</span>
              </button>

              <button
                onClick={() => {
                  setSaved(!saved);
                  setShowMenu(false);
                }}
                className="flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg text-foreground hover:bg-accent text-left transition-colors"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{saved ? 'Saved' : 'Save to Bookmark'}</span>
              </button>

              <button
                onClick={() => {
                  setSavedToDrive(!savedToDrive);
                  setShowMenu(false);
                  alert(`"${item.title.substring(0, 30)}..." saved to your Personal Cloud Drive!`);
                }}
                className="flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg text-foreground hover:bg-accent text-left transition-colors"
              >
                <HardDrive className="w-3.5 h-3.5 text-primary" />
                <span>{savedToDrive ? 'Saved in Drive' : 'Save to My Drive'}</span>
              </button>

              <button
                onClick={() => {
                  alert('Report submitted to community moderation queue.');
                  setShowMenu(false);
                }}
                className="flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg text-destructive hover:bg-destructive/10 text-left transition-colors"
              >
                <Flag className="w-3.5 h-3.5" />
                <span>Report</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Social Engagement Footer with Reactions */}
      <div className="flex items-center justify-between pt-2 border-t border-border/30">
        <ReactionsPicker initialReactions={item.reactions} />

        <Link
          href={`/video/${item.id}`}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>{item.commentCount}</span>
        </Link>
      </div>
    </div>
  );
}