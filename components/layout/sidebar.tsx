'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Compass,
  TrendingUp,
  Users,
  Film,
  MessageSquare,
  Bell,
  Bookmark,
  PlusCircle,
  LayoutDashboard,
  ShieldAlert,
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Home', href: '/home', icon: Home },
  { label: 'Shorts', href: '/shorts', icon: Film },
  { label: 'Explore', href: '/explore', icon: Compass },
  { label: 'Trending', href: '/trending', icon: TrendingUp },
  { label: 'Following', href: '/following', icon: Users },
  { label: 'Messages', href: '/messages', icon: MessageSquare },
  { label: 'Notifications', href: '/notifications', icon: Bell },
  { label: 'Bookmarks', href: '/bookmarks', icon: Bookmark },
  { label: 'Creator Studio', href: '/creator', icon: LayoutDashboard },
  { label: 'Admin Panel', href: '/admin', icon: ShieldAlert },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-border/40 bg-card/60 backdrop-blur-xl h-[calc(100vh-4rem)] sticky top-16 hidden md:flex flex-col justify-between p-4 z-20">
      <div className="space-y-1">
        <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Discover
        </div>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/home' && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25 font-semibold'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="pt-4 border-t border-border/40 space-y-2">
        <Link
          href="/upload"
          className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-semibold text-sm shadow-md shadow-blue-500/20 transition-all active:scale-[0.98]"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Publish Content</span>
        </Link>
        <div className="text-xs text-center text-muted-foreground/60 pt-2">
          Freedom-First Architecture v1.0
        </div>
      </div>
    </aside>
  );
}