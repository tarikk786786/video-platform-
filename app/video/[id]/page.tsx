'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { MOCK_CONTENTS, MOCK_COMMENTS } from '@/lib/mock-data';
import { VideoPlayer } from '@/components/video/video-player';
import {
  ThumbsUp,
  Share2,
  Bookmark,
  Flag,
  MessageSquare,
  CheckCircle2,
  Send,
} from 'lucide-react';

export default function VideoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const content = MOCK_CONTENTS.find((c) => c.id === resolvedParams.id) || MOCK_CONTENTS[0];

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(content.likeCount);
  const [saved, setSaved] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  const [comments, setComments] = useState<any[]>(MOCK_COMMENTS);
  const [newComment, setNewComment] = useState('');
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const handleToggleLike = () => {
    if (liked) {
      setLikeCount(likeCount - 1);
      setLiked(false);
    } else {
      setLikeCount(likeCount + 1);
      setLiked(true);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const added = {
      id: `com-${Date.now()}`,
      contentId: content.id,
      userId: 'user-current',
      user: {
        id: 'user-current',
        username: 'you',
        displayName: 'You (Current User)',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        followersCount: 1,
        isVerified: false,
      },
      content: newComment.trim(),
      likeCount: 0,
      createdAt: 'Just now',
      replies: [],
    };

    setComments([added as any, ...comments]);
    setNewComment('');
  };

  const handleAddReply = (parentCommentId: string) => {
    if (!replyText.trim()) return;

    setComments((prev) =>
      prev.map((c) => {
        if (c.id === parentCommentId) {
          return {
            ...c,
            replies: [
              ...c.replies,
              {
                id: `reply-${Date.now()}`,
                contentId: content.id,
                userId: 'user-current',
                user: {
                  id: 'user-current',
                  username: 'you',
                  displayName: 'You (Current User)',
                  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
                  followersCount: 1,
                  isVerified: false,
                },
                content: replyText.trim(),
                likeCount: 0,
                createdAt: 'Just now',
              },
            ],
          };
        }
        return c;
      })
    );

    setReplyText('');
    setReplyingToId(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-2xl bg-black border border-border/40">
          <VideoPlayer
            src={content.asset?.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'}
            poster={content.asset?.thumbnailUrl}
            autoPlay
          />
        </div>

        <div className="space-y-4">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            {content.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 py-2 border-b border-border/40">
            <div className="flex items-center gap-3">
              <Link href={`/u/${content.author.username}`}>
                <img
                  src={content.author.avatarUrl}
                  alt={content.author.displayName}
                  className="w-11 h-11 rounded-full object-cover border border-border hover:ring-2 hover:ring-primary transition-all"
                />
              </Link>

              <div>
                <Link
                  href={`/u/${content.author.username}`}
                  className="flex items-center gap-1.5 font-bold text-sm hover:text-primary transition-colors"
                >
                  <span>{content.author.displayName}</span>
                  {content.author.isVerified && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-blue-500/20" />
                  )}
                </Link>
                <div className="text-xs text-muted-foreground">
                  {(content.author.followersCount / 1000).toFixed(1)}K followers
                </div>
              </div>

              <button
                onClick={() => setIsFollowing(!isFollowing)}
                className={`ml-3 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                  isFollowing
                    ? 'bg-secondary text-foreground hover:bg-secondary/80'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
                }`}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  liked
                    ? 'bg-primary text-primary-foreground border-primary shadow-md'
                    : 'bg-secondary/60 hover:bg-secondary border-border/40 text-foreground'
                }`}
              >
                <ThumbsUp className="w-4 h-4" />
                <span>{likeCount}</span>
              </button>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Video link copied to clipboard!');
                }}
                className="flex items-center gap-2 px-3.5 py-2 bg-secondary/60 hover:bg-secondary border border-border/40 rounded-xl text-xs font-semibold text-foreground transition-all"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Share</span>
              </button>

              <button
                onClick={() => setSaved(!saved)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  saved
                    ? 'bg-blue-600/20 text-blue-400 border-blue-500/30'
                    : 'bg-secondary/60 hover:bg-secondary border-border/40 text-foreground'
                }`}
              >
                <Bookmark className="w-4 h-4" />
                <span className="hidden sm:inline">{saved ? 'Saved' : 'Save'}</span>
              </button>

              <button
                onClick={() => alert('Report submitted for safety/moderation review.')}
                className="p-2 hover:bg-destructive/10 hover:text-destructive text-muted-foreground rounded-xl transition-colors"
                title="Report video"
              >
                <Flag className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-secondary/30 border border-border/40 text-sm space-y-2">
            <div className="flex items-center gap-3 text-xs font-semibold text-muted-foreground">
              <span>{content.viewCount.toLocaleString()} views</span>
              <span>•</span>
              <span>Published {new Date(content.publishedAt).toLocaleDateString()}</span>
              <span>•</span>
              <span className="text-primary">#{content.category}</span>
            </div>
            <p className="text-foreground/90 whitespace-pre-line leading-relaxed">
              {content.description}
            </p>
          </div>
        </div>

        <div className="space-y-6 pt-4">
          <div className="flex items-center gap-2 text-lg font-bold">
            <MessageSquare className="w-5 h-5 text-primary" />
            <span>Comments & Community Discussion ({comments.length})</span>
          </div>

          <form onSubmit={handleAddComment} className="flex gap-3 items-start">
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"
              alt="User"
              className="w-9 h-9 rounded-full object-cover border border-border"
            />
            <div className="flex-1 space-y-2">
              <textarea
                rows={2}
                placeholder="Share your thoughts openly and without censorship..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full bg-secondary/40 border border-border/60 rounded-xl p-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-xs font-bold hover:bg-primary/90 transition-all shadow-md shadow-primary/20 flex items-center gap-1.5"
                >
                  <Send className="w-3 h-3" />
                  <span>Comment</span>
                </button>
              </div>
            </div>
          </form>

          <div className="space-y-4 divide-y divide-border/30">
            {comments.map((comm) => (
              <div key={comm.id} className="pt-4 space-y-3">
                <div className="flex gap-3 items-start">
                  <Link href={`/u/${comm.user.username}`}>
                    <img
                      src={comm.user.avatarUrl}
                      alt={comm.user.displayName}
                      className="w-8 h-8 rounded-full object-cover border border-border"
                    />
                  </Link>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2 text-xs font-semibold">
                      <Link href={`/u/${comm.user.username}`} className="hover:underline">
                        {comm.user.displayName}
                      </Link>
                      <span className="text-muted-foreground font-normal">{comm.createdAt}</span>
                    </div>

                    <p className="text-sm text-foreground/90 leading-normal">{comm.content}</p>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                      <button className="flex items-center gap-1 hover:text-primary transition-colors">
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>{comm.likeCount}</span>
                      </button>

                      <button
                        onClick={() => setReplyingToId(replyingToId === comm.id ? null : comm.id)}
                        className="hover:text-primary transition-colors"
                      >
                        Reply
                      </button>
                    </div>

                    {replyingToId === comm.id && (
                      <div className="pt-3 flex gap-2">
                        <input
                          type="text"
                          placeholder="Write a reply..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          className="flex-1 bg-secondary/50 border border-border/50 rounded-xl px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                        <button
                          onClick={() => handleAddReply(comm.id)}
                          className="px-3 py-1.5 bg-primary text-primary-foreground rounded-xl text-xs font-bold hover:bg-primary/90 transition-all"
                        >
                          Reply
                        </button>
                      </div>
                    )}

                    {comm.replies && comm.replies.length > 0 && (
                      <div className="space-y-3 pl-4 pt-2 border-l-2 border-border/40 mt-2">
                        {comm.replies.map((rep: any) => (
                          <div key={rep.id} className="flex gap-2.5 items-start">
                            <Link href={`/u/${rep.user.username}`}>
                              <img
                                src={rep.user.avatarUrl}
                                alt={rep.user.displayName}
                                className="w-6 h-6 rounded-full object-cover"
                              />
                            </Link>
                            <div className="flex-1 space-y-0.5">
                              <div className="flex items-center gap-2 text-xs font-semibold">
                                <Link href={`/u/${rep.user.username}`} className="hover:underline">
                                  {rep.user.displayName}
                                </Link>
                                <span className="text-muted-foreground font-normal">{rep.createdAt}</span>
                              </div>
                              <p className="text-xs text-foreground/90 leading-normal">{rep.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Recommended Next
        </h3>

        <div className="space-y-3">
          {MOCK_CONTENTS.filter((c) => c.id !== content.id).map((item) => (
            <Link
              key={item.id}
              href={`/video/${item.id}`}
              className="flex gap-3 group rounded-xl p-2 hover:bg-secondary/40 transition-colors border border-transparent hover:border-border/40"
            >
              <div className="relative w-36 aspect-video rounded-lg overflow-hidden bg-secondary shrink-0">
                <img
                  src={item.asset?.thumbnailUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <h4 className="text-xs font-bold text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                  {item.title}
                </h4>
                <p className="text-[11px] text-muted-foreground truncate">{item.author.displayName}</p>
                <p className="text-[11px] text-muted-foreground/80 font-mono">
                  {(item.viewCount / 1000).toFixed(1)}K views
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}