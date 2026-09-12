export interface ContentEngagementStats {
  viewCount: number;
  watchTimeSeconds: number;
  completionRate?: number; // 0 to 1
  likeCount: number;
  commentCount: number;
  shareCount: number;
  saveCount: number;
  authorFollowersCount?: number;
  publishedAt: Date | string;
}

export function calculateRecommendationScore(stats: ContentEngagementStats): number {
  const publishedTime = new Date(stats.publishedAt).getTime();
  const now = Date.now();
  const hoursSincePublished = Math.max(0.1, (now - publishedTime) / (1000 * 60 * 60));

  // Weightings defined in Section 15 of PRD
  const watchTimeScore = stats.watchTimeSeconds * 1.5;
  const completionScore = (stats.completionRate || 0) * 50;
  const likesScore = stats.likeCount * 5;
  const commentsScore = stats.commentCount * 10;
  const sharesScore = stats.shareCount * 20;
  const savesScore = stats.saveCount * 15;
  const authorAuthority = Math.log10(Math.max(1, stats.authorFollowersCount || 1)) * 10;

  const rawEngagementScore =
    watchTimeScore +
    completionScore +
    likesScore +
    commentsScore +
    sharesScore +
    savesScore +
    authorAuthority;

  // Time decay freshness multiplier (gravity curve)
  // score decays gradually over 48-72 hours
  const freshnessMultiplier = 1 / Math.pow(hoursSincePublished + 2, 1.2);

  return Math.round(rawEngagementScore * freshnessMultiplier * 100);
}
