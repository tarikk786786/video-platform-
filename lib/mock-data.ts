export interface ContentItem {
  id: string;
  type: 'video' | 'short' | 'image' | 'audio' | 'document' | 'text' | 'link' | 'gallery' | 'poll';
  title: string;
  description: string;
  category: string;
  visibility: 'public' | 'unlisted' | 'followers_only' | 'private';
  status: 'draft' | 'uploading' | 'processing' | 'published' | 'failed';
  viewCount: number;
  watchTimeSeconds: number;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  saveCount: number;
  publishedAt: string;
  reactions?: Record<string, number>;
  pollData?: {
    question: string;
    options: { id: string; text: string; votes: number }[];
    totalVotes: number;
  };
  communitySlug?: string;
  author: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string;
    isVerified: boolean;
    followersCount: number;
  };
  asset?: {
    storageProvider: string;
    storageKey: string;
    mimeType: string;
    durationSeconds?: number;
    width?: number;
    height?: number;
    thumbnailUrl?: string;
    videoUrl?: string;
    audioUrl?: string;
    hlsUrl?: string;
  };
}

export interface StoryItem {
  id: string;
  creator: {
    username: string;
    displayName: string;
    avatarUrl: string;
  };
  mediaUrl: string;
  mediaType: 'image' | 'video';
  textOverlay?: string;
  hasUnread: boolean;
}

export interface CommunityItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  avatarUrl: string;
  bannerUrl: string;
  memberCount: number;
  isVerified: boolean;
  rules: string[];
}

export interface PodcastItem {
  id: string;
  title: string;
  creatorName: string;
  coverUrl: string;
  description: string;
  episodesCount: number;
  episodes: {
    id: string;
    title: string;
    duration: string;
    publishedDate: string;
    audioUrl: string;
  }[];
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  dateStr: string;
  timeStr: string;
  locationType: 'online' | 'physical';
  locationUrl?: string;
  bannerUrl: string;
  attendeesCount: number;
  creatorName: string;
}

export const MOCK_CREATORS = [
  {
    id: 'user-1',
    username: 'open_discourse',
    displayName: 'Open Discourse Foundation',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    bio: 'Championing freedom of expression, open knowledge, and decentralized media infrastructure.',
    followersCount: 24800,
    followingCount: 112,
    totalLikes: 198000,
    isVerified: true,
  },
  {
    id: 'user-2',
    username: 'tech_frontier',
    displayName: 'Tech Frontier',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80',
    bio: 'Exploring Next.js 15, AI architectures, distributed storage & Telegram media pipelines.',
    followersCount: 18200,
    followingCount: 84,
    totalLikes: 145000,
    isVerified: true,
  },
  {
    id: 'user-3',
    username: 'cyber_sage',
    displayName: 'Cyber Sage',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=1200&auto=format&fit=crop&q=80',
    bio: 'Independent journalism, open web protocols, and zero-compromise digital autonomy.',
    followersCount: 9400,
    followingCount: 45,
    totalLikes: 67000,
    isVerified: false,
  }
];

export const MOCK_STORIES: StoryItem[] = [
  {
    id: 'st-1',
    creator: {
      username: 'open_discourse',
      displayName: 'Open Discourse',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    },
    mediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
    mediaType: 'image',
    textOverlay: 'New freedom manifesto dropped! 🚀',
    hasUnread: true,
  },
  {
    id: 'st-2',
    creator: {
      username: 'tech_frontier',
      displayName: 'Tech Frontier',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    },
    mediaUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800',
    mediaType: 'image',
    textOverlay: 'Live coding worker queues in 10 mins',
    hasUnread: true,
  },
  {
    id: 'st-3',
    creator: {
      username: 'cyber_sage',
      displayName: 'Cyber Sage',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    },
    mediaUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800',
    mediaType: 'image',
    textOverlay: 'Privacy is non-negotiable 🔒',
    hasUnread: false,
  }
];

export const MOCK_COMMUNITIES: CommunityItem[] = [
  {
    id: 'comm-1',
    slug: 'technology',
    name: 'Open Technology & Protocols',
    description: 'A global forum for open-source software, decentralized infrastructure, WebRTC, and distributed computing.',
    avatarUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=200',
    bannerUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200',
    memberCount: 42300,
    isVerified: true,
    rules: [
      'Focus on technical merit and factual accuracy',
      'Share source code and reproducible experiments',
      'Respect freedom of inquiry and civil debate',
    ],
  },
  {
    id: 'comm-2',
    slug: 'freedom-speech',
    name: 'Free Speech & Digital Rights',
    description: 'Discussing civil liberties, algorithmic transparency, censorship resistance, and consumer ownership.',
    avatarUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=200',
    bannerUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200',
    memberCount: 68100,
    isVerified: true,
    rules: [
      'No ideological deplatforming or suppression of controversial discussion',
      'Community reporting handles safety and law compliance',
      'Debate opinions with evidence and logic',
    ],
  },
  {
    id: 'comm-3',
    slug: 'gaming',
    name: 'Indie Game Creators & Modding',
    description: 'Game development logs, asset sharing, gameplay streams, and independent studios.',
    avatarUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200',
    bannerUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200',
    memberCount: 29400,
    isVerified: false,
    rules: [
      'Credit all artists and modders',
      'Mark major story spoilers',
    ],
  }
];

export const MOCK_PODCASTS: PodcastItem[] = [
  {
    id: 'pod-1',
    title: 'The Sovereign Net Podcast',
    creatorName: 'Open Discourse Foundation',
    coverUrl: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=600',
    description: 'Weekly conversations with software architects, cryptographers, and independent journalists on the future of an open internet.',
    episodesCount: 24,
    episodes: [
      {
        id: 'ep-1',
        title: 'Episode 24: Building Censorship-Resistant Storage with Telegram & S3',
        duration: '48:12',
        publishedDate: 'Sep 10, 2026',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      },
      {
        id: 'ep-2',
        title: 'Episode 23: Why Centralized Algorithmic Feeds Stifle Creative Expression',
        duration: '52:40',
        publishedDate: 'Sep 3, 2026',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
      },
    ],
  },
];

export const MOCK_EVENTS: EventItem[] = [
  {
    id: 'ev-1',
    title: 'FreedomPlay Global Community Roundtable & Live Q&A',
    description: 'Join the community founders to discuss roadmap items: E2EE direct messages, P2P live streaming, and decentralized media storage nodes.',
    dateStr: 'Saturday, Sep 20, 2026',
    timeStr: '6:00 PM UTC',
    locationType: 'online',
    locationUrl: 'https://freedomplay.org/live',
    bannerUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200',
    attendeesCount: 418,
    creatorName: 'Open Discourse Foundation',
  },
  {
    id: 'ev-2',
    title: 'Next.js 15 & High-Scale Media Workers Workshop',
    description: 'Hands-on live stream coding session demonstrating FFmpeg HLS chunking and custom Telegram Bot API media workers.',
    dateStr: 'Wednesday, Sep 24, 2026',
    timeStr: '4:00 PM UTC',
    locationType: 'online',
    locationUrl: 'https://freedomplay.org/live',
    bannerUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200',
    attendeesCount: 290,
    creatorName: 'Tech Frontier',
  },
];

export const MOCK_CONTENTS: ContentItem[] = [
  {
    id: 'c-1',
    type: 'video',
    title: 'Decentralized Storage & Freedom of Expression: The New Era',
    description: 'A deep dive into building content platforms that prioritize user ownership, distributed storage, and censorship resistance.',
    category: 'Technology',
    communitySlug: 'technology',
    visibility: 'public',
    status: 'published',
    viewCount: 14200,
    watchTimeSeconds: 42600,
    likeCount: 2150,
    commentCount: 184,
    shareCount: 420,
    saveCount: 310,
    publishedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    reactions: { heart: 1420, fire: 890, clap: 340, wow: 120 },
    author: MOCK_CREATORS[0],
    asset: {
      storageProvider: 'telegram',
      storageKey: 'videos/c-1.mp4',
      mimeType: 'video/mp4',
      durationSeconds: 240,
      width: 1920,
      height: 1080,
      thumbnailUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    }
  },
  {
    id: 'c-poll',
    type: 'poll',
    title: 'Community Poll: Which media storage provider should we benchmark next for zero-cost scalability?',
    description: 'We are expanding the StorageProvider interface beyond Telegram. Vote for your preferred production backend.',
    category: 'Technology',
    communitySlug: 'technology',
    visibility: 'public',
    status: 'published',
    viewCount: 6400,
    watchTimeSeconds: 0,
    likeCount: 840,
    commentCount: 95,
    shareCount: 120,
    saveCount: 85,
    publishedAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    pollData: {
      question: 'Which storage backend should be benchmarked next?',
      totalVotes: 1284,
      options: [
        { id: 'opt-1', text: 'Cloudflare R2 (Zero egress fees)', votes: 642 },
        { id: 'opt-2', text: 'Self-hosted MinIO Object Storage', votes: 385 },
        { id: 'opt-3', text: 'Backblaze B2 S3 Compatible', votes: 192 },
        { id: 'opt-4', text: 'IPFS / Filecoin Decentralized', votes: 65 },
      ],
    },
    reactions: { fire: 512, heart: 240, clap: 110 },
    author: MOCK_CREATORS[1],
  },
  {
    id: 'c-2',
    type: 'video',
    title: 'Building Universal Media Pipelines with FFmpeg and Next.js',
    description: 'Complete breakdown of decoupling Vercel compute from heavy background workers using custom job queues and Telegram storage.',
    category: 'Education',
    communitySlug: 'technology',
    visibility: 'public',
    status: 'published',
    viewCount: 8900,
    watchTimeSeconds: 26700,
    likeCount: 1340,
    commentCount: 92,
    shareCount: 210,
    saveCount: 180,
    publishedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    reactions: { fire: 620, heart: 480, clap: 240 },
    author: MOCK_CREATORS[1],
    asset: {
      storageProvider: 'telegram',
      storageKey: 'videos/c-2.mp4',
      mimeType: 'video/mp4',
      durationSeconds: 180,
      width: 1920,
      height: 1080,
      thumbnailUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    }
  },
  {
    id: 'c-3',
    type: 'video',
    title: 'Why Open Platforms Win: A Manifesto for Free Speech',
    description: 'Platforms should empower discussion rather than policing opinion. Let the community curate and discuss freely.',
    category: 'Freedom',
    communitySlug: 'freedom-speech',
    visibility: 'public',
    status: 'published',
    viewCount: 31200,
    watchTimeSeconds: 93600,
    likeCount: 5400,
    commentCount: 512,
    shareCount: 1200,
    saveCount: 940,
    publishedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    reactions: { heart: 3200, fire: 1800, clap: 950 },
    author: MOCK_CREATORS[2],
    asset: {
      storageProvider: 'telegram',
      storageKey: 'videos/c-3.mp4',
      mimeType: 'video/mp4',
      durationSeconds: 320,
      width: 1920,
      height: 1080,
      thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    }
  },
  {
    id: 'c-4',
    type: 'video',
    title: 'Shorts: Micro-architecture of high performance workers #shorts',
    description: 'How we process 1GB videos in under 10 seconds using parallel thumbnail generators.',
    category: 'Technology',
    communitySlug: 'technology',
    visibility: 'public',
    status: 'published',
    viewCount: 45000,
    watchTimeSeconds: 22500,
    likeCount: 8900,
    commentCount: 320,
    shareCount: 1540,
    saveCount: 810,
    publishedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    reactions: { fire: 4200, clap: 1200, heart: 2100 },
    author: MOCK_CREATORS[1],
    asset: {
      storageProvider: 'telegram',
      storageKey: 'videos/c-4.mp4',
      mimeType: 'video/mp4',
      durationSeconds: 45,
      width: 1080,
      height: 1920,
      thumbnailUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    }
  }
];

export const MOCK_COMMENTS = [
  {
    id: 'com-1',
    contentId: 'c-1',
    userId: 'user-2',
    user: MOCK_CREATORS[1],
    content: 'The storage provider abstraction is brilliant. Being able to swap Telegram for S3 or R2 without breaking frontend contracts makes this production ready.',
    likeCount: 42,
    createdAt: '2 hours ago',
    replies: [
      {
        id: 'com-1-1',
        contentId: 'c-1',
        userId: 'user-1',
        user: MOCK_CREATORS[0],
        content: 'Exactly! And keeping bot tokens on the backend worker prevents any token scraping.',
        likeCount: 19,
        createdAt: '1 hour ago',
      }
    ]
  },
  {
    id: 'com-2',
    contentId: 'c-1',
    userId: 'user-3',
    user: MOCK_CREATORS[2],
    content: 'Community-driven reporting instead of algorithmic suppression is the exact model modern media platforms need.',
    likeCount: 88,
    createdAt: '3 hours ago',
    replies: []
  }
];

export const CATEGORIES = [
  'All',
  'Technology',
  'Freedom',
  'Communities',
  'Live',
  'Education',
  'Podcasts',
  'Events',
  'Gaming',
  'Music',
  'News',
  'Art'
];

export interface DriveFolder {
  id: string;
  name: string;
  parentId: string | null;
  color?: string;
  isStarred?: boolean;
  itemCount: number;
  sizeBytes: number;
  updatedAt: string;
}

export interface DriveFile {
  id: string;
  folderId: string | null;
  name: string;
  extension: string;
  mimeType: string;
  category: 'video' | 'photo' | 'audio' | 'document' | 'code' | 'archive' | 'binary';
  sizeBytes: number;
  sha256Hash: string;
  storageProvider: 'telegram' | 'seaweedfs' | 's3' | 'r2' | 'local';
  storageKey: string;
  storageUrl?: string;
  thumbnailUrl?: string;
  isStarred: boolean;
  isTrashed: boolean;
  isPublishedToSocial: boolean;
  version: number;
  updatedAt: string;
}

export interface StorageQuota {
  totalBytes: number;
  usedBytes: number;
  fileCount: number;
  videoBytes: number;
  photoBytes: number;
  audioBytes: number;
  docBytes: number;
  archiveBytes: number;
  otherBytes: number;
}

export const MOCK_STORAGE_QUOTA: StorageQuota = {
  totalBytes: 1099511627776, // 1 TB
  usedBytes: 84620000000,    // ~84.62 GB
  fileCount: 342,
  videoBytes: 52400000000,   // ~52.4 GB
  photoBytes: 18200000000,   // ~18.2 GB
  audioBytes: 7400000000,    // ~7.4 GB
  docBytes: 2800000000,      // ~2.8 GB
  archiveBytes: 3100000000,  // ~3.1 GB
  otherBytes: 720000000,     // ~720 MB
};

export const MOCK_DRIVE_FOLDERS: DriveFolder[] = [
  {
    id: 'f-videos',
    name: 'Videos & Streams',
    parentId: null,
    color: '#ef4444',
    isStarred: true,
    itemCount: 48,
    sizeBytes: 52400000000,
    updatedAt: '2 hours ago',
  },
  {
    id: 'f-images',
    name: 'Photos & Artwork',
    parentId: null,
    color: '#3b82f6',
    isStarred: true,
    itemCount: 184,
    sizeBytes: 18200000000,
    updatedAt: 'Yesterday',
  },
  {
    id: 'f-podcasts',
    name: 'Audio Masters & Podcasts',
    parentId: null,
    color: '#8b5cf6',
    isStarred: false,
    itemCount: 32,
    sizeBytes: 7400000000,
    updatedAt: 'Sep 8, 2026',
  },
  {
    id: 'f-docs',
    name: 'Documents & Whitepapers',
    parentId: null,
    color: '#10b981',
    isStarred: false,
    itemCount: 56,
    sizeBytes: 2800000000,
    updatedAt: 'Sep 4, 2026',
  },
  {
    id: 'f-backups',
    name: 'Archives & Source Code',
    parentId: null,
    color: '#f59e0b',
    isStarred: false,
    itemCount: 22,
    sizeBytes: 3820000000,
    updatedAt: 'Aug 28, 2026',
  },
];

export const MOCK_DRIVE_FILES: DriveFile[] = [
  {
    id: 'file-1',
    folderId: 'f-videos',
    name: 'Decentralized_Infrastructure_Keynote_4K.mp4',
    extension: 'mp4',
    mimeType: 'video/mp4',
    category: 'video',
    sizeBytes: 1480000000, // 1.48 GB
    sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    storageProvider: 'seaweedfs',
    storageKey: 'drive/videos/keynote_4k.mp4',
    storageUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800',
    isStarred: true,
    isTrashed: false,
    isPublishedToSocial: true,
    version: 2,
    updatedAt: 'Just now',
  },
  {
    id: 'file-2',
    folderId: 'f-images',
    name: 'Future_City_Cyberpunk_Artwork_Raw.png',
    extension: 'png',
    mimeType: 'image/png',
    category: 'photo',
    sizeBytes: 18400000, // 18.4 MB
    sha256Hash: 'a89c72e21b194f4c8996fb92427ae41e4649b934ca495991b7852b8558492049',
    storageProvider: 'telegram',
    storageKey: 'drive/photos/cyberpunk_art.png',
    storageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1600',
    thumbnailUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800',
    isStarred: true,
    isTrashed: false,
    isPublishedToSocial: false,
    version: 1,
    updatedAt: '3 hours ago',
  },
  {
    id: 'file-3',
    folderId: 'f-docs',
    name: 'FreedomPlay_Architecture_Whitepaper_v2.pdf',
    extension: 'pdf',
    mimeType: 'application/pdf',
    category: 'document',
    sizeBytes: 8400000, // 8.4 MB
    sha256Hash: 'b48291a109fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b812',
    storageProvider: 'seaweedfs',
    storageKey: 'drive/docs/whitepaper_v2.pdf',
    storageUrl: 'https://raw.githubusercontent.com/mozilla/pdf.js/master/examples/learning/helloworld.pdf',
    isStarred: false,
    isTrashed: false,
    isPublishedToSocial: true,
    version: 3,
    updatedAt: 'Yesterday',
  },
  {
    id: 'file-4',
    folderId: 'f-podcasts',
    name: 'Sovereign_Net_Episode_24_Master.mp3',
    extension: 'mp3',
    mimeType: 'audio/mpeg',
    category: 'audio',
    sizeBytes: 84200000, // 84.2 MB
    sha256Hash: 'c710492198fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b877',
    storageProvider: 'telegram',
    storageKey: 'drive/audio/episode_24.mp3',
    storageUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    thumbnailUrl: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800',
    isStarred: true,
    isTrashed: false,
    isPublishedToSocial: true,
    version: 1,
    updatedAt: 'Sep 9, 2026',
  },
  {
    id: 'file-5',
    folderId: 'f-backups',
    name: 'distributed_media_worker.ts',
    extension: 'ts',
    mimeType: 'text/plain',
    category: 'code',
    sizeBytes: 18400, // 18.4 KB
    sha256Hash: 'd928401928fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b899',
    storageProvider: 'local',
    storageKey: 'drive/code/worker.ts',
    storageUrl: '',
    isStarred: false,
    isTrashed: false,
    isPublishedToSocial: false,
    version: 4,
    updatedAt: 'Sep 5, 2026',
  },
  {
    id: 'file-6',
    folderId: 'f-backups',
    name: 'FreedomPlay_Full_Vault_Backup.zip',
    extension: 'zip',
    mimeType: 'application/zip',
    category: 'archive',
    sizeBytes: 420000000, // 420 MB
    sha256Hash: 'f492049182fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b800',
    storageProvider: 'seaweedfs',
    storageKey: 'drive/archives/backup.zip',
    storageUrl: '',
    isStarred: false,
    isTrashed: false,
    isPublishedToSocial: false,
    version: 1,
    updatedAt: 'Aug 29, 2026',
  },
  {
    id: 'file-7',
    folderId: null,
    name: 'linux_live_environment_x86_64.iso',
    extension: 'iso',
    mimeType: 'application/octet-stream',
    category: 'binary',
    sizeBytes: 2147483648, // 2.14 GB
    sha256Hash: '9840294829fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b844',
    storageProvider: 'seaweedfs',
    storageKey: 'drive/binaries/linux.iso',
    storageUrl: '',
    isStarred: false,
    isTrashed: false,
    isPublishedToSocial: false,
    version: 1,
    updatedAt: 'Aug 20, 2026',
  },
];