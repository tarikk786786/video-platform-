export interface ContentItem {
  id: string;
  type: 'video' | 'image' | 'audio' | 'document' | 'text' | 'link' | 'gallery';
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
    hlsUrl?: string;
  };
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

export const MOCK_CONTENTS: ContentItem[] = [
  {
    id: 'c-1',
    type: 'video',
    title: 'Decentralized Storage & Freedom of Expression: The New Era',
    description: 'A deep dive into building content platforms that prioritize user ownership, distributed storage, and censorship resistance.',
    category: 'Technology',
    visibility: 'public',
    status: 'published',
    viewCount: 14200,
    watchTimeSeconds: 42600,
    likeCount: 2150,
    commentCount: 184,
    shareCount: 420,
    saveCount: 310,
    publishedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
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
    id: 'c-2',
    type: 'video',
    title: 'Building Universal Media Pipelines with FFmpeg and Next.js',
    description: 'Complete breakdown of decoupling Vercel compute from heavy background workers using custom job queues and Telegram storage.',
    category: 'Education',
    visibility: 'public',
    status: 'published',
    viewCount: 8900,
    watchTimeSeconds: 26700,
    likeCount: 1340,
    commentCount: 92,
    shareCount: 210,
    saveCount: 180,
    publishedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
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
    visibility: 'public',
    status: 'published',
    viewCount: 31200,
    watchTimeSeconds: 93600,
    likeCount: 5400,
    commentCount: 512,
    shareCount: 1200,
    saveCount: 940,
    publishedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
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
    visibility: 'public',
    status: 'published',
    viewCount: 45000,
    watchTimeSeconds: 22500,
    likeCount: 8900,
    commentCount: 320,
    shareCount: 1540,
    saveCount: 810,
    publishedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
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
  'Education',
  'News',
  'Gaming',
  'Music',
  'Art',
  'Science',
  'Lifestyle'
];
