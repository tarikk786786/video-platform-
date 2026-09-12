import { MOCK_CONTENTS } from '@/lib/mock-data';
import { ContentCard } from '@/components/video/content-card';
import { Users } from 'lucide-react';

export default function FollowingPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto py-2">
      <div className="flex items-center gap-3 border-b border-border/40 pb-4">
        <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
          <Users className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">Following Feed</h1>
          <p className="text-xs text-muted-foreground">Chronological updates from the creators and voices you follow.</p>
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