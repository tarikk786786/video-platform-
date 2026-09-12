'use client';

import { use, useState } from 'react';
import { MOCK_CREATORS, MOCK_CONTENTS } from '@/lib/mock-data';
import { ContentCard } from '@/components/video/content-card';
import {
  CheckCircle2,
  Globe,
  Share2,
  Film,
  FileText,
  Image as ImageIcon,
  Music,
  FileCode,
  ListVideo,
  Heart,
} from 'lucide-react';

export default function UserProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const resolvedParams = use(params);
  const creator = MOCK_CREATORS.find((c) => c.username === resolvedParams.username) || MOCK_CREATORS[0];
  const [activeTab, setActiveTab] = useState<'videos' | 'posts' | 'images' | 'audio' | 'documents' | 'playlists' | 'liked'>('videos');
  const [isFollowing, setIsFollowing] = useState(false);

  const TABS = [
    { id: 'videos', label: 'Videos', icon: Film },
    { id: 'posts', label: 'Posts', icon: FileText },
    { id: 'images', label: 'Images', icon: ImageIcon },
    { id: 'audio', label: 'Audio', icon: Music },
    { id: 'documents', label: 'Documents', icon: FileCode },
    { id: 'playlists', label: 'Playlists', icon: ListVideo },
    { id: 'liked', label: 'Liked', icon: Heart },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="relative h-48 sm:h-64 rounded-3xl overflow-hidden bg-secondary border border-border/40 shadow-inner">
        <img
          src={creator.bannerUrl}
          alt={creator.displayName}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      <div className="relative px-4 sm:px-8 -mt-20 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 z-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
          <img
            src={creator.avatarUrl}
            alt={creator.displayName}
            className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl object-cover border-4 border-background shadow-2xl"
          />

          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-foreground">{creator.displayName}</h1>
              {creator.isVerified && <CheckCircle2 className="w-5 h-5 text-blue-500 fill-blue-500/20" />}
            </div>

            <p className="text-sm text-muted-foreground font-mono">@{creator.username}</p>

            <div className="flex items-center gap-4 text-xs font-semibold text-foreground/80 pt-1">
              <span>{(creator.followersCount / 1000).toFixed(1)}K <span className="text-muted-foreground font-normal">Followers</span></span>
              <span>•</span>
              <span>{creator.followingCount} <span className="text-muted-foreground font-normal">Following</span></span>
              <span>•</span>
              <span>{(creator.totalLikes / 1000).toFixed(1)}K <span className="text-muted-foreground font-normal">Total Likes</span></span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => setIsFollowing(!isFollowing)}
            className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md ${
              isFollowing
                ? 'bg-secondary text-foreground hover:bg-secondary/80 border border-border'
                : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/20'
            }`}
          >
            {isFollowing ? 'Following' : 'Follow Creator'}
          </button>

          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert('Profile link copied!');
            }}
            className="p-2.5 bg-secondary/80 hover:bg-secondary border border-border/50 rounded-xl text-muted-foreground hover:text-foreground transition-colors"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="px-4 sm:px-8 space-y-3">
        <p className="text-sm text-foreground/90 max-w-2xl leading-relaxed">
          {creator.bio}
        </p>
        <div className="flex items-center gap-2 text-xs text-primary hover:underline cursor-pointer">
          <Globe className="w-3.5 h-3.5" />
          <span>https://freedomplay.org/@{creator.username}</span>
        </div>
      </div>

      <div className="border-b border-border/40 px-4 sm:px-8 flex items-center gap-2 overflow-x-auto scrollbar-none">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="px-4 sm:px-8">
        {activeTab === 'videos' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_CONTENTS.map((item) => (
              <ContentCard key={item.id} item={item} />
            ))}
          </div>
        )}

        {activeTab !== 'videos' && (
          <div className="py-16 text-center text-muted-foreground space-y-2">
            <p className="text-sm font-semibold text-foreground">No {activeTab} published yet</p>
            <p className="text-xs">When this creator shares {activeTab}, they will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}