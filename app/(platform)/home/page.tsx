'use client';

import { useState } from 'react';
import { MOCK_CONTENTS, CATEGORIES } from '@/lib/mock-data';
import { ContentCard } from '@/components/video/content-card';
import { StoriesBar } from '@/components/stories/stories-bar';
import { UniversalComposer } from '@/components/upload/universal-composer';
import { Flame, Sparkles, Users } from 'lucide-react';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'for-you' | 'following' | 'trending'>('for-you');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredItems = MOCK_CONTENTS.filter((item) => {
    if (selectedCategory !== 'All' && item.category !== selectedCategory) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 24-hour Ephemeral Stories Reel */}
      <section className="bg-card/40 border border-border/40 p-4 rounded-3xl backdrop-blur-md">
        <StoriesBar />
      </section>

      {/* Universal Omnichannel Post Composer */}
      <UniversalComposer />

      {/* Feed Filter Headers & Tabs */}
      <div className="flex items-center justify-between border-b border-border/40 pb-4">
        <div className="flex items-center gap-2 bg-secondary/40 p-1 rounded-2xl border border-border/40">
          <button
            onClick={() => setActiveTab('for-you')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'for-you'
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>For You</span>
          </button>

          <button
            onClick={() => setActiveTab('following')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'following'
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Following</span>
          </button>

          <button
            onClick={() => setActiveTab('trending')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'trending'
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Trending</span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground font-medium">
          <span>Freedom of Expression Guaranteed</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all border ${
              selectedCategory === cat
                ? 'bg-foreground text-background font-semibold border-foreground'
                : 'bg-secondary/40 text-muted-foreground hover:bg-secondary hover:text-foreground border-border/40'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <ContentCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}