import { MOCK_CONTENTS } from '@/lib/mock-data';
import { ContentCard } from '@/components/video/content-card';
import { Bookmark } from 'lucide-react';

export default function BookmarksPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto py-2">
      <div className="flex items-center gap-3 border-b border-border/40 pb-4">
        <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
          <Bookmark className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">Saved & Bookmarks</h1>
          <p className="text-xs text-muted-foreground">Quick access to media, documents, and videos you saved for later.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_CONTENTS.slice(0, 2).map((item) => (
          <ContentCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}