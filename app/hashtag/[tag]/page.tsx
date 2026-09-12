'use client';

import { use } from 'react';
import { MOCK_CONTENTS } from '@/lib/mock-data';
import { ContentCard } from '@/components/video/content-card';
import { Hash } from 'lucide-react';

export default function HashtagDiscoveryPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const resolvedParams = use(params);
  const tag = resolvedParams.tag;

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-2">
      <div className="flex items-center gap-3 border-b border-border/40 pb-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
          <Hash className="w-7 h-7" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">#{tag}</h1>
          <p className="text-xs text-muted-foreground">Showing all videos, posts, and media tagged with #{tag}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_CONTENTS.map((item) => (
          <ContentCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}