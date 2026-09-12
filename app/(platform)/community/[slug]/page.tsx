'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { MOCK_COMMUNITIES, MOCK_CONTENTS } from '@/lib/mock-data';
import { ContentCard } from '@/components/video/content-card';
import { UniversalComposer } from '@/components/upload/universal-composer';
import { 
  Users, 
  CheckCircle, 
  ShieldCheck, 
  Plus, 
  ArrowLeft, 
  MessageSquare, 
  Film, 
  BarChart2, 
  Info,
  Share2,
  Bell
} from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function CommunityDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const community = MOCK_COMMUNITIES.find((c) => c.slug === slug) || MOCK_COMMUNITIES[0];
  const [isJoined, setIsJoined] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'media' | 'polls' | 'rules'>('all');

  // Filter content belonging to this community, or fallback to relevant items
  const communityPosts = MOCK_CONTENTS.filter(
    (item) => item.communitySlug === slug || item.category.toLowerCase() === slug.toLowerCase()
  );

  const postsToShow = activeTab === 'media'
    ? communityPosts.filter(p => p.type === 'video' || p.type === 'short' || p.type === 'image')
    : activeTab === 'polls'
    ? communityPosts.filter(p => p.type === 'poll')
    : communityPosts;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Back link */}
      <div>
        <Link
          href="/communities"
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Communities</span>
        </Link>
      </div>

      {/* Hero Banner & Identity Header */}
      <div className="rounded-3xl border border-border/50 bg-card overflow-hidden">
        <div className="relative h-48 sm:h-64 w-full bg-secondary">
          <img
            src={community.bannerUrl}
            alt={community.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        </div>

        <div className="px-6 sm:px-8 pb-6 -mt-16 sm:-mt-20 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="flex items-end gap-5">
              <img
                src={community.avatarUrl}
                alt={community.name}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl object-cover ring-4 ring-background bg-card shadow-xl"
              />
              <div className="pb-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-foreground">{community.name}</h1>
                  {community.isVerified && (
                    <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">c/{community.slug}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {community.memberCount.toLocaleString()} members
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsJoined(!isJoined)}
                className={`px-6 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-sm ${
                  isJoined
                    ? 'bg-secondary text-foreground hover:bg-secondary/80 border border-border'
                    : 'bg-primary text-primary-foreground hover:opacity-90 shadow-primary/20'
                }`}
              >
                {isJoined ? 'Joined Community' : 'Join Community'}
              </button>
              <button 
                title="Notifications"
                className="p-2.5 rounded-2xl bg-secondary/60 text-muted-foreground hover:text-foreground border border-border/50 transition-colors"
              >
                <Bell className="w-4 h-4" />
              </button>
              <button 
                title="Share"
                className="p-2.5 rounded-2xl bg-secondary/60 text-muted-foreground hover:text-foreground border border-border/50 transition-colors"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <p className="mt-4 text-xs sm:text-sm text-muted-foreground max-w-3xl leading-relaxed">
            {community.description}
          </p>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Feeds & Composer */}
        <div className="lg:col-span-2 space-y-6">
          {/* Universal Composer Scoped to Community */}
          <UniversalComposer />

          {/* Feed Filter Tabs */}
          <div className="flex items-center gap-2 border-b border-border/40 pb-3">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'all'
                  ? 'bg-foreground text-background'
                  : 'bg-secondary/40 text-muted-foreground hover:text-foreground'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>All Discussions ({communityPosts.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('media')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'media'
                  ? 'bg-foreground text-background'
                  : 'bg-secondary/40 text-muted-foreground hover:text-foreground'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>Media & Videos</span>
            </button>

            <button
              onClick={() => setActiveTab('polls')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'polls'
                  ? 'bg-foreground text-background'
                  : 'bg-secondary/40 text-muted-foreground hover:text-foreground'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>Polls</span>
            </button>
          </div>

          {/* Posts List */}
          {postsToShow.length > 0 ? (
            <div className="space-y-6">
              {postsToShow.map((item) => (
                <ContentCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center rounded-3xl bg-card border border-border/40 space-y-3">
              <MessageSquare className="w-10 h-10 text-muted-foreground mx-auto stroke-1" />
              <h3 className="font-bold text-foreground text-sm">No posts yet in this tab</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Be the first member to start an open discussion or share media in c/{community.slug}.
              </p>
            </div>
          )}
        </div>

        {/* Right Sidebar: Rules & Governance */}
        <div className="space-y-6">
          <div className="rounded-3xl bg-card border border-border/50 p-6 space-y-4">
            <div className="flex items-center gap-2 font-bold text-foreground text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Community Rules & Charter</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              These guidelines are enforced by elected community moderators and transparent cryptographic audit logs.
            </p>

            <ol className="space-y-3 text-xs">
              {community.rules && community.rules.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-2.5 bg-secondary/30 p-3 rounded-2xl border border-border/40">
                  <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-[11px] font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-muted-foreground leading-tight pt-0.5">{rule}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-3xl bg-secondary/30 border border-border/40 p-6 space-y-3">
            <div className="flex items-center gap-2 font-bold text-xs text-foreground">
              <Info className="w-4 h-4 text-primary" />
              <span>Decentralized Governance</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              This community operates under FreedomPlay Open Governance Protocol v1. Moderators are accountable to community recall votes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}