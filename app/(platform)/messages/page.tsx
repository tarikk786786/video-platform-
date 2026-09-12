'use client';

import { useState } from 'react';
import { MOCK_CREATORS } from '@/lib/mock-data';
import { Send, Paperclip, MoreVertical, Phone, Video, Search } from 'lucide-react';

interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isSelf: boolean;
}

export default function MessagesPage() {
  const [activeUser, setActiveUser] = useState(MOCK_CREATORS[1]);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      senderId: 'user-2',
      text: 'Hey! Loved your latest post on distributed video pipelines and Telegram storage.',
      timestamp: '10:30 AM',
      isSelf: false,
    },
    {
      id: 'm-2',
      senderId: 'self',
      text: 'Thanks! The decoupled worker model is keeping Vercel functions fast and lightweight.',
      timestamp: '10:32 AM',
      isSelf: true,
    },
    {
      id: 'm-3',
      senderId: 'user-2',
      text: 'Are you planning to add HLS multi-bitrate slicing to the background worker as well?',
      timestamp: '10:35 AM',
      isSelf: false,
    },
  ]);
  const [inputMsg, setInputMsg] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const newMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      senderId: 'self',
      text: inputMsg.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSelf: true,
    };

    setMessages([...messages, newMsg]);
    setInputMsg('');
  };

  return (
    <div className="h-[calc(100vh-8rem)] rounded-3xl border border-border/40 bg-card/60 backdrop-blur-xl overflow-hidden flex shadow-2xl">
      <div className="w-80 border-r border-border/40 flex flex-col">
        <div className="p-4 border-b border-border/40 space-y-3">
          <h2 className="font-bold text-base text-foreground">Encrypted Messages</h2>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full bg-secondary/50 border border-border/50 rounded-xl pl-9 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-border/20">
          {MOCK_CREATORS.map((creator) => {
            const isSelected = activeUser.id === creator.id;
            return (
              <button
                key={creator.id}
                onClick={() => setActiveUser(creator)}
                className={`w-full p-3.5 flex items-center gap-3 text-left transition-all ${
                  isSelected ? 'bg-primary/10 border-l-2 border-primary' : 'hover:bg-secondary/40'
                }`}
              >
                <div className="relative">
                  <img
                    src={creator.avatarUrl}
                    alt={creator.displayName}
                    className="w-10 h-10 rounded-full object-cover border border-border/50"
                  />
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full absolute bottom-0 right-0 ring-2 ring-background"></span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h4 className="text-xs font-bold text-foreground truncate">{creator.displayName}</h4>
                    <span className="text-[10px] text-muted-foreground font-mono">10:35 AM</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {creator.bio}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-background/50">
        <div className="h-16 px-6 border-b border-border/40 flex items-center justify-between bg-card/40 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <img
              src={activeUser.avatarUrl}
              alt={activeUser.displayName}
              className="w-10 h-10 rounded-full object-cover border border-border/40"
            />
            <div>
              <h3 className="text-sm font-bold text-foreground">{activeUser.displayName}</h3>
              <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Online • End-to-end freedom protocol
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <button className="p-2 hover:bg-secondary rounded-xl hover:text-foreground transition-colors">
              <Phone className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-secondary rounded-xl hover:text-foreground transition-colors">
              <Video className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-secondary rounded-xl hover:text-foreground transition-colors">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.isSelf ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-md px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.isSelf
                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 rounded-br-none'
                    : 'bg-secondary text-foreground border border-border/40 rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[10px] text-muted-foreground/80 mt-1 font-mono px-1">
                {msg.timestamp}
              </span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSendMessage} className="p-4 border-t border-border/40 bg-card/30 flex items-center gap-2">
          <button
            type="button"
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-xl transition-colors"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          <input
            type="text"
            placeholder={`Message ${activeUser.displayName}...`}
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            className="flex-1 bg-secondary/50 border border-border/50 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all"
          />

          <button
            type="submit"
            className="p-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}