'use client';

import { useState } from 'react';
import { MOCK_STORIES, StoryItem } from '@/lib/mock-data';
import { Plus, X, Volume2, VolumeX } from 'lucide-react';

export function StoriesBar() {
  const [selectedStory, setSelectedStory] = useState<StoryItem | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  return (
    <>
      <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-none">
        <div className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group">
          <div className="relative w-16 h-16 rounded-full p-0.5 border-2 border-dashed border-border/70 group-hover:border-primary transition-colors flex items-center justify-center">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
              alt="You"
              className="w-full h-full rounded-full object-cover"
            />
            <div className="absolute bottom-0 right-0 w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-md ring-2 ring-background">
              <Plus className="w-3.5 h-3.5" />
            </div>
          </div>
          <span className="text-[11px] font-medium text-muted-foreground truncate w-16 text-center">
            Your Story
          </span>
        </div>

        {MOCK_STORIES.map((story) => (
          <div
            key={story.id}
            onClick={() => setSelectedStory(story)}
            className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
          >
            <div
              className={`w-16 h-16 rounded-full p-0.5 transition-transform duration-300 group-hover:scale-105 ${
                story.hasUnread
                  ? 'bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-500 shadow-md shadow-rose-500/20'
                  : 'bg-border/60'
              }`}
            >
              <div className="w-full h-full rounded-full p-0.5 bg-background overflow-hidden">
                <img
                  src={story.creator.avatarUrl}
                  alt={story.creator.displayName}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>
            <span className="text-[11px] font-medium text-foreground/90 truncate w-16 text-center">
              {story.creator.displayName.split(' ')[0]}
            </span>
          </div>
        ))}
      </div>

      {selectedStory && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-2xl z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-sm aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl border border-border/40 flex flex-col justify-between bg-black">
            <div className="relative z-10 p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent space-y-3">
              <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white" style={{ width: '65%' }}></div>
              </div>

              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-2.5">
                  <img
                    src={selectedStory.creator.avatarUrl}
                    alt={selectedStory.creator.displayName}
                    className="w-8 h-8 rounded-full object-cover border border-white/50"
                  />
                  <div>
                    <h4 className="text-xs font-bold leading-none">{selectedStory.creator.displayName}</h4>
                    <span className="text-[10px] text-zinc-300 font-mono">2h ago</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => setSelectedStory(null)}
                    className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <img
              src={selectedStory.mediaUrl}
              alt="Story media"
              className="absolute inset-0 w-full h-full object-cover"
            />

            {selectedStory.textOverlay && (
              <div className="relative z-10 p-5 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                <p className="text-white text-sm font-semibold text-center drop-shadow-md">
                  {selectedStory.textOverlay}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}