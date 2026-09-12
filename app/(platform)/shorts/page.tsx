'use client';

import { useState } from 'react';
import { MOCK_CONTENTS } from '@/lib/mock-data';
import { Heart, MessageCircle, Share2, Bookmark } from 'lucide-react';
import Link from 'next/link';

export default function ShortsPage() {
  const shorts = MOCK_CONTENTS.filter((c) => c.asset?.durationSeconds && c.asset.durationSeconds < 90);
  const currentShort = shorts[0] || MOCK_CONTENTS[0];
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(currentShort.likeCount);

  const toggleLike = () => {
    if (liked) {
      setLikeCount(likeCount - 1);
      setLiked(false);
    } else {
      setLikeCount(likeCount + 1);
      setLiked(true);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <div className="flex items-end gap-4 max-w-sm w-full">
        <div className="relative w-full aspect-[9/16] bg-black rounded-3xl overflow-hidden border border-border/40 shadow-2xl flex flex-col justify-end">
          <video
            src={currentShort.asset?.videoUrl}
            poster={currentShort.asset?.thumbnailUrl}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div className="relative z-10 p-5 bg-gradient-to-t from-black/90 via-black/40 to-transparent space-y-2.5 text-white">
            <div className="flex items-center gap-2.5">
              <Link href={`/u/${currentShort.author.username}`} className="flex items-center gap-2 group">
                <img
                  src={currentShort.author.avatarUrl}
                  alt={currentShort.author.displayName}
                  className="w-9 h-9 rounded-full object-cover border-2 border-white/80"
                />
                <span className="font-bold text-sm group-hover:underline">@{currentShort.author.username}</span>
              </Link>

              <button className="px-3 py-1 bg-white text-black hover:bg-zinc-200 text-xs font-bold rounded-full transition-all shadow-md">
                Follow
              </button>
            </div>

            <p className="text-sm font-medium line-clamp-2 drop-shadow">
              {currentShort.title}
            </p>

            <div className="text-xs text-zinc-300 flex items-center gap-2 font-mono">
              <span>#freedom</span>
              <span>#tech</span>
              <span>#shorts</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-5 pb-4 text-white">
          <button
            onClick={toggleLike}
            className="flex flex-col items-center gap-1 group"
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
              liked ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/40' : 'bg-secondary/60 text-foreground hover:bg-secondary'
            }`}>
              <Heart className={`w-6 h-6 ${liked ? 'fill-white' : ''}`} />
            </div>
            <span className="text-xs font-semibold text-muted-foreground">{likeCount}</span>
          </button>

          <Link
            href={`/video/${currentShort.id}`}
            className="flex flex-col items-center gap-1 group"
          >
            <div className="w-12 h-12 rounded-full bg-secondary/60 hover:bg-secondary text-foreground flex items-center justify-center backdrop-blur-md transition-all">
              <MessageCircle className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-muted-foreground">{currentShort.commentCount}</span>
          </Link>

          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert('Link copied to clipboard!');
            }}
            className="flex flex-col items-center gap-1 group"
          >
            <div className="w-12 h-12 rounded-full bg-secondary/60 hover:bg-secondary text-foreground flex items-center justify-center backdrop-blur-md transition-all">
              <Share2 className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-muted-foreground">Share</span>
          </button>

          <button
            className="flex flex-col items-center gap-1 group"
          >
            <div className="w-12 h-12 rounded-full bg-secondary/60 hover:bg-secondary text-foreground flex items-center justify-center backdrop-blur-md transition-all">
              <Bookmark className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-muted-foreground">Save</span>
          </button>
        </div>
      </div>
    </div>
  );
}