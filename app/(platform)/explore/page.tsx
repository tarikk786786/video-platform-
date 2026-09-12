'use client';

import { MOCK_CREATORS, MOCK_CONTENTS } from '@/lib/mock-data';
import { ContentCard } from '@/components/video/content-card';
import Link from 'next/link';
import { Compass, Hash, Users, CheckCircle2 } from 'lucide-react';

export default function ExplorePage() {
  const TRENDING_TAGS = [
    { tag: 'freedom', count: '14.2K' },
    { tag: 'nextjs15', count: '8.5K' },
    { tag: 'telegramstorage', count: '5.1K' },
    { tag: 'opensource', count: '12.8K' },
    { tag: 'censorshipresistance', count: '9.4K' },
    { tag: 'ffmpeg', count: '3.7K' },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-2">
      <div className="flex items-center gap-3 border-b border-border/40 pb-4">
        <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
          <Compass className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">Explore Platform Discovery</h1>
          <p className="text-xs text-muted-foreground">Discover new creators, active hashtags, and high-engagement discussions.</p>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <Hash className="w-3.5 h-3.5 text-primary" />
          <span>Trending Hashtags</span>
        </h2>
        <div className="flex flex-wrap gap-2.5">
          {TRENDING_TAGS.map((t) => (
            <Link
              key={t.tag}
              href={`/hashtag/${t.tag}`}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-secondary/50 hover:bg-secondary border border-border/50 transition-colors text-xs font-medium text-foreground"
            >
              <span className="text-primary font-bold">#{t.tag}</span>
              <span className="text-[11px] text-muted-foreground font-mono">{t.count} posts</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-primary" />
          <span>Featured Creators</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {MOCK_CREATORS.map((c) => (
            <Link
              key={c.id}
              href={`/u/${c.username}`}
              className="p-4 rounded-2xl bg-card/60 border border-border/40 hover:border-primary/50 transition-all flex items-center gap-3.5 group"
            >
              <img
                src={c.avatarUrl}
                alt={c.displayName}
                className="w-12 h-12 rounded-full object-cover border border-border group-hover:scale-105 transition-transform"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1 font-bold text-sm text-foreground truncate">
                  <span>{c.displayName}</span>
                  {c.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-blue-500/20" />}
                </div>
                <p className="text-xs text-muted-foreground truncate">@{c.username}</p>
                <p className="text-[11px] text-muted-foreground/80 font-mono mt-0.5">
                  {(c.followersCount / 1000).toFixed(1)}K followers
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="space-y-4 pt-2">
        <h2 className="text-base font-bold text-foreground">Popular Across Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_CONTENTS.map((item) => (
            <ContentCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}