'use client';

import { useState } from 'react';
import { MOCK_PODCASTS, PodcastItem } from '@/lib/mock-data';
import { 
  Headphones, 
  Play, 
  Pause, 
  Rss, 
  Clock, 
  Calendar, 
  Sparkles, 
  Share2, 
  Download,
  Search,
  CheckCircle
} from 'lucide-react';

export default function PodcastsPage() {
  const [podcasts] = useState<PodcastItem[]>(MOCK_PODCASTS);
  const [activeEpisodeId, setActiveEpisodeId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [search, setSearch] = useState('');

  const togglePlay = (epId: string) => {
    if (activeEpisodeId === epId) {
      setIsPlaying(!isPlaying);
    } else {
      setActiveEpisodeId(epId);
      setIsPlaying(true);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-24">
      {/* Hero Header */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-500/20 via-purple-500/10 to-secondary/30 border border-border/50 p-8 sm:p-12">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-semibold border border-indigo-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Open Audio & Decentralized RSS</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Podcasts & Audio Dispatch
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Listen to long-form audio essays, sovereign internet interviews, and decentralized broadcasts. Subscribe via open RSS or stream directly.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-95 shadow-md shadow-primary/20 transition-all">
              <Rss className="w-4 h-4" />
              <span>Submit RSS Feed</span>
            </button>
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search podcasts or episodes..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-muted-foreground"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Featured Podcast Series */}
      <div className="space-y-8">
        {podcasts.map((pod) => (
          <div
            key={pod.id}
            className="rounded-3xl bg-card border border-border/50 overflow-hidden shadow-sm p-6 sm:p-8 space-y-6"
          >
            {/* Show Header */}
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <img
                src={pod.coverUrl}
                alt={pod.title}
                className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl object-cover shadow-lg shrink-0 border border-border/40"
              />

              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400">
                  <Headphones className="w-3.5 h-3.5" />
                  <span>Verified Podcast Channel</span>
                </div>
                <h2 className="text-2xl font-black text-foreground">{pod.title}</h2>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">{pod.creatorName}</span>
                  <span>•</span>
                  <span>{pod.episodesCount} Episodes</span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-3xl">
                  {pod.description}
                </p>

                <div className="flex items-center gap-3 pt-2">
                  <button className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-sm hover:opacity-90 transition-all">
                    <Rss className="w-3.5 h-3.5" />
                    <span>Follow Show</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-secondary/80 hover:bg-secondary text-xs font-semibold border border-border/50 transition-all">
                    <Share2 className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>Share Series</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Episodes List */}
            <div className="space-y-3 pt-4 border-t border-border/40">
              <h3 className="font-bold text-sm text-foreground">Recent Episodes</h3>
              <div className="space-y-2">
                {pod.episodes.map((ep) => {
                  const isCurrent = activeEpisodeId === ep.id;
                  return (
                    <div
                      key={ep.id}
                      className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                        isCurrent
                          ? 'bg-primary/5 border-primary/40 shadow-sm'
                          : 'bg-secondary/20 hover:bg-secondary/40 border-border/40'
                      }`}
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <button
                          onClick={() => togglePlay(ep.id)}
                          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-md transition-transform hover:scale-105 ${
                            isCurrent && isPlaying
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-foreground text-background'
                          }`}
                        >
                          {isCurrent && isPlaying ? (
                            <Pause className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4 ml-0.5" />
                          )}
                        </button>

                        <div className="min-w-0 space-y-1">
                          <h4 className="font-bold text-xs sm:text-sm text-foreground truncate">
                            {ep.title}
                          </h4>
                          <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {ep.publishedDate}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {ep.duration}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          title="Download episode"
                          className="p-2 rounded-xl bg-secondary/60 hover:bg-secondary text-muted-foreground hover:text-foreground border border-border/40 transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}