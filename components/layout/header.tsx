'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Search, Upload, Bell, Shield } from 'lucide-react';

export function Header() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="h-16 border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-4 lg:px-8">
      <div className="flex items-center gap-4">
        <Link href="/home" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Shield className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            Freedom<span className="text-blue-500">Play</span>
          </span>
        </Link>
      </div>

      <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-6 hidden sm:block">
        <div className="relative">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search creators, videos, tags, transcripts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-secondary/50 border border-border/50 rounded-full pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>
      </form>

      <div className="flex items-center gap-3">
        <Link
          href="/upload"
          className="flex items-center gap-2 bg-secondary hover:bg-accent text-foreground text-sm font-medium py-2 px-3.5 rounded-full transition-colors border border-border/40"
        >
          <Upload className="w-4 h-4 text-primary" />
          <span className="hidden sm:inline">Upload</span>
        </Link>

        <Link
          href="/notifications"
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground relative transition-colors"
        >
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 bg-primary rounded-full absolute top-2 right-2 ring-2 ring-background"></span>
        </Link>

        <Link
          href="/u/open_discourse"
          className="w-9 h-9 rounded-full overflow-hidden border border-border/50 hover:ring-2 hover:ring-primary transition-all"
        >
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </Link>
      </div>
    </header>
  );
}