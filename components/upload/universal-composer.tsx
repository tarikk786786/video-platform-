'use client';

import { useState } from 'react';
import {
  Image,
  Film,
  Music,
  FileCode,
  BarChart2,
  Send,
  Sparkles,
  Lock,
  Globe,
  Users,
} from 'lucide-react';

export function UniversalComposer({ onPostCreated }: { onPostCreated?: () => void }) {
  const [text, setText] = useState('');
  const [activeAttach, setActiveAttach] = useState<string | null>(null);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [visibility, setVisibility] = useState<'public' | 'followers_only' | 'private'>('public');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() && !activeAttach) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setText('');
      setActiveAttach(null);
      setPollQuestion('');
      setIsSubmitting(false);
      alert('Post published to universal feed!');
      onPostCreated?.();
    }, 600);
  };

  return (
    <div className="rounded-3xl border border-border/50 bg-card/60 backdrop-blur-xl p-4 sm:p-5 shadow-lg space-y-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex gap-3 items-start">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
            alt="You"
            className="w-10 h-10 rounded-full object-cover border border-border shrink-0"
          />

          <div className="flex-1 min-w-0 space-y-2">
            <textarea
              rows={3}
              placeholder="What's on your mind? Share text, ideas, media, code, or discussions..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full bg-transparent border-none text-sm text-foreground placeholder:text-muted-foreground focus:outline-none resize-none"
            />

            {/* Poll creator attachment */}
            {activeAttach === 'poll' && (
              <div className="p-3.5 rounded-2xl bg-secondary/40 border border-border/50 space-y-2.5">
                <input
                  type="text"
                  placeholder="Ask a community question..."
                  value={pollQuestion}
                  onChange={(e) => setPollQuestion(e.target.value)}
                  className="w-full bg-secondary/60 border border-border/50 rounded-xl px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {pollOptions.map((opt, i) => (
                  <input
                    key={i}
                    type="text"
                    placeholder={`Option ${i + 1}`}
                    value={opt}
                    onChange={(e) => {
                      const next = [...pollOptions];
                      next[i] = e.target.value;
                      setPollOptions(next);
                    }}
                    className="w-full bg-secondary/60 border border-border/50 rounded-xl px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border/30">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setActiveAttach(activeAttach === 'image' ? null : 'image')}
              className={`p-2 rounded-xl text-xs transition-colors flex items-center gap-1.5 ${
                activeAttach === 'image' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary text-muted-foreground hover:text-foreground'
              }`}
              title="Add Image"
            >
              <Image className="w-4 h-4" />
              <span className="hidden sm:inline">Photo</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveAttach(activeAttach === 'video' ? null : 'video')}
              className={`p-2 rounded-xl text-xs transition-colors flex items-center gap-1.5 ${
                activeAttach === 'video' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary text-muted-foreground hover:text-foreground'
              }`}
              title="Add Video"
            >
              <Film className="w-4 h-4" />
              <span className="hidden sm:inline">Video</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveAttach(activeAttach === 'audio' ? null : 'audio')}
              className={`p-2 rounded-xl text-xs transition-colors flex items-center gap-1.5 ${
                activeAttach === 'audio' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary text-muted-foreground hover:text-foreground'
              }`}
              title="Add Audio"
            >
              <Music className="w-4 h-4" />
              <span className="hidden sm:inline">Audio</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveAttach(activeAttach === 'poll' ? null : 'poll')}
              className={`p-2 rounded-xl text-xs transition-colors flex items-center gap-1.5 ${
                activeAttach === 'poll' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary text-muted-foreground hover:text-foreground'
              }`}
              title="Create Poll"
            >
              <BarChart2 className="w-4 h-4" />
              <span className="hidden sm:inline">Poll</span>
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value as any)}
              className="bg-secondary/60 border border-border/50 text-[11px] font-semibold text-muted-foreground hover:text-foreground rounded-xl px-2.5 py-1.5 focus:outline-none"
            >
              <option value="public">Public</option>
              <option value="followers_only">Followers Only</option>
              <option value="private">Private</option>
            </select>

            <button
              type="submit"
              disabled={isSubmitting || (!text.trim() && !activeAttach)}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Post</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}