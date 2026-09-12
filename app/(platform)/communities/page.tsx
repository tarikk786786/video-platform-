'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MOCK_COMMUNITIES } from '@/lib/mock-data';
import { Users, CheckCircle, Search, ShieldCheck, Plus, TrendingUp, Sparkles } from 'lucide-react';

export default function CommunitiesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [joinedCommunities, setJoinedCommunities] = useState<Record<string, boolean>>({
    'technology': true,
  });

  const toggleJoin = (slug: string) => {
    setJoinedCommunities(prev => ({ ...prev, [slug]: !prev[slug] }));
  };

  const filteredCommunities = MOCK_COMMUNITIES.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-primary/20 via-primary/5 to-secondary/30 border border-border/50 p-8 sm:p-12">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-semibold border border-primary/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Decentralized & Moderated Forums</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Explore Freedom Communities
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Discover self-governed spaces where creators and members converse openly. No algorithmic suppression, clear community rules, and transparent moderation.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-95 shadow-md shadow-primary/20 transition-all">
              <Plus className="w-4 h-4" />
              <span>Create Community</span>
            </button>
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search communities by topic..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-muted-foreground"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Categories / Trending Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-base font-bold">
          <TrendingUp className="w-4 h-4 text-primary" />
          <span>Active Hubs ({filteredCommunities.length})</span>
        </div>
        <div className="text-xs text-muted-foreground">
          Showing verified community channels
        </div>
      </div>

      {/* Grid of Communities */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCommunities.map((comm) => {
          const isJoined = !!joinedCommunities[comm.slug];
          return (
            <div
              key={comm.id}
              className="group flex flex-col justify-between rounded-3xl bg-card border border-border/50 overflow-hidden hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/5"
            >
              {/* Cover Banner */}
              <div className="relative h-32 w-full overflow-hidden bg-secondary/60">
                <img
                  src={comm.bannerUrl}
                  alt={comm.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-medium flex items-center gap-1.5 border border-white/10">
                  <Users className="w-3 h-3" />
                  <span>{comm.memberCount.toLocaleString()} members</span>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="flex items-start gap-3.5 -mt-10 relative z-10">
                  <img
                    src={comm.avatarUrl}
                    alt={comm.name}
                    className="w-14 h-14 rounded-2xl object-cover ring-4 ring-card bg-card shadow-md shrink-0"
                  />
                  <div className="pt-8">
                    <div className="flex items-center gap-1.5">
                      <Link
                        href={`/community/${comm.slug}`}
                        className="font-bold text-foreground text-base hover:text-primary transition-colors line-clamp-1"
                      >
                        {comm.name}
                      </Link>
                      {comm.isVerified && (
                        <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">c/{comm.slug}</span>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  {comm.description}
                </p>

                {comm.rules && comm.rules.length > 0 && (
                  <div className="bg-secondary/40 rounded-xl p-3 border border-border/40 text-[11px] text-muted-foreground space-y-1">
                    <div className="flex items-center gap-1 font-semibold text-foreground">
                      <ShieldCheck className="w-3 h-3 text-emerald-500" />
                      <span>Key Guideline</span>
                    </div>
                    <p className="line-clamp-1 italic">"{comm.rules[0]}"</p>
                  </div>
                )}

                <div className="pt-2 flex items-center justify-between gap-3 border-t border-border/40">
                  <Link
                    href={`/community/${comm.slug}`}
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    View Community
                  </Link>

                  <button
                    onClick={() => toggleJoin(comm.slug)}
                    className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      isJoined
                        ? 'bg-secondary text-foreground hover:bg-secondary/80 border border-border/60'
                        : 'bg-primary text-primary-foreground hover:opacity-90 shadow-sm'
                    }`}
                  >
                    {isJoined ? 'Joined' : 'Join'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}