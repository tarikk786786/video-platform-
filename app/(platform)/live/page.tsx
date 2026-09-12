'use client';

import { useState } from 'react';
import { VideoPlayer } from '@/components/video/video-player';
import { 
  Radio, 
  Users, 
  Send, 
  Settings, 
  Key, 
  Copy, 
  Check, 
  Sparkles, 
  Calendar, 
  Heart,
  MessageCircle,
  Share2
} from 'lucide-react';

interface ChatMessage {
  id: string;
  user: string;
  avatar: string;
  text: string;
  time: string;
}

export default function LiveStreamPage() {
  const [copiedKey, setCopiedKey] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      user: 'SovereignCoder',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
      text: 'Great stream! How is latency looking on HLS low-latency mode?',
      time: 'Just now',
    },
    {
      id: '2',
      user: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      text: 'Audio is crystal clear here in Europe 🎧',
      time: '1m ago',
    },
    {
      id: '3',
      user: 'DecentralizedDev',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100',
      text: 'FreedomPlay live streaming architecture is insanely responsive!',
      time: '2m ago',
    },
  ]);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    setChatMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        user: 'You',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
        text: chatInput.trim(),
        time: 'Just now',
      },
    ]);
    setChatInput('');
  };

  const copyStreamKey = () => {
    navigator.clipboard.writeText('fp_live_849204918230912481');
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Live Stream Stage Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-rose-500/20 text-rose-500 border border-rose-500/30">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black">FreedomPlay Live Studio</h1>
              <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-extrabold uppercase tracking-wider animate-pulse">
                LIVE
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Uncensored peer-assisted live broadcasts & interactive WebRTC chat
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={copyStreamKey}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-secondary/80 hover:bg-secondary text-xs font-semibold border border-border/60 transition-all"
          >
            <Key className="w-3.5 h-3.5 text-primary" />
            <span>{copiedKey ? 'Stream Key Copied!' : 'Copy RTMP Key'}</span>
            {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground" />}
          </button>

          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-md shadow-primary/20 hover:opacity-90 transition-all">
            <Radio className="w-3.5 h-3.5" />
            <span>Start My Broadcast</span>
          </button>
        </div>
      </div>

      {/* Main Broadcast Theater & Live Chat */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Main Player & Stream Info */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-3xl overflow-hidden bg-black border border-border/40 shadow-2xl relative">
            <VideoPlayer
              src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
              poster="https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200"
            />
          </div>

          <div className="rounded-3xl bg-card border border-border/40 p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h2 className="text-lg sm:text-xl font-bold text-foreground">
                  Building Censorship-Resistant Global Infrastructure: The Architecture Stream
                </h2>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">Tech Frontier</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-rose-500 font-bold">
                    <Users className="w-3.5 h-3.5" />
                    1,420 watching
                  </span>
                  <span>•</span>
                  <span>Started 24 mins ago</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-secondary/80 text-xs font-semibold hover:bg-secondary border border-border/50">
                  <Heart className="w-3.5 h-3.5 text-rose-500" />
                  <span>2.4k</span>
                </button>
                <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-secondary/80 text-xs font-semibold hover:bg-secondary border border-border/50">
                  <Share2 className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>Share</span>
                </button>
              </div>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Welcome to the live interactive broadcast! In this live session we demonstrate running decentralized background video encoding workers, streaming fragments to Telegram storage arrays, and maintaining 0ms buffer times.
            </p>
          </div>
        </div>

        {/* Right Col: Live Chat */}
        <div className="flex flex-col h-[580px] rounded-3xl bg-card border border-border/50 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-border/40 flex items-center justify-between bg-secondary/20">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-primary" />
              <span className="font-bold text-xs text-foreground">Live Stream Chat</span>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
            {chatMessages.map((msg) => (
              <div key={msg.id} className="flex items-start gap-2.5 text-xs">
                <img
                  src={msg.avatar}
                  alt={msg.user}
                  className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5"
                />
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground text-[11px]">{msg.user}</span>
                    <span className="text-[10px] text-muted-foreground">{msg.time}</span>
                  </div>
                  <p className="text-muted-foreground leading-snug text-[12px]">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendChat} className="p-3 border-t border-border/40 bg-secondary/10 flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Send a live message..."
              className="flex-1 px-3 py-2 rounded-xl bg-background border border-border/60 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              type="submit"
              className="p-2 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Upcoming Scheduled Streams */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center gap-2 font-bold text-base text-foreground">
          <Calendar className="w-4 h-4 text-primary" />
          <span>Upcoming Scheduled Broadcasts</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: 'Open Source AI Models: Self-Hosting Guide',
              creator: 'Cyber Sage',
              date: 'Tomorrow at 7:00 PM UTC',
              cover: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
            },
            {
              title: 'Decentralized Social Protocols vs Walled Gardens',
              creator: 'Open Discourse Foundation',
              date: 'Friday at 5:00 PM UTC',
              cover: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
            },
            {
              title: 'Game Dev Log: Procedural World Generation Live',
              creator: 'Indie Game Forge',
              date: 'Sunday at 2:00 PM UTC',
              cover: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800',
            }
          ].map((item, i) => (
            <div key={i} className="rounded-2xl bg-card border border-border/50 overflow-hidden group hover:border-primary/50 transition-all">
              <div className="relative h-36 bg-secondary overflow-hidden">
                <img src={item.cover} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-2.5 right-2.5 px-2 py-1 rounded-md bg-black/70 backdrop-blur-md text-white text-[10px] font-bold">
                  {item.date}
                </div>
              </div>
              <div className="p-4 space-y-2">
                <h3 className="font-bold text-sm text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{item.creator}</span>
                  <button className="font-semibold text-primary hover:underline">Remind Me</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}