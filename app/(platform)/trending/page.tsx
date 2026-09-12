import { MOCK_CONTENTS } from '@/lib/mock-data';
import { ContentCard } from '@/components/video/content-card';
import { Flame } from 'lucide-react';

export default function TrendingPage() {
  const sortedTrending = [...MOCK_CONTENTS].sort((a, b) => b.viewCount - a.viewCount);

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-2">
      <div className="flex items-center gap-3 border-b border-border/40 pb-4">
        <div className="w-10 h-10 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500">
          <Flame className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">Trending Now</h1>
          <p className="text-xs text-muted-foreground">Content with the fastest engagement velocity, shares, and watch time.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedTrending.map((item) => (
          <ContentCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}