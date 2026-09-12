'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Eye,
  Clock,
  Users,
  ThumbsUp,
  PlusCircle,
  Edit2,
  Trash2,
  CheckCircle2,
  Loader2,
  FileText,
} from 'lucide-react';

export default function CreatorStudioPage() {
  const [uploads, setUploads] = useState([
    {
      id: 'up-1',
      title: 'Decentralized Storage & Freedom of Expression: The New Era',
      type: 'video',
      status: 'published',
      progress: 100,
      views: 14200,
      likes: 2150,
      comments: 184,
      date: 'Today, 2:40 PM',
    },
    {
      id: 'up-2',
      title: 'Building Universal Media Pipelines with FFmpeg',
      type: 'video',
      status: 'processing',
      progress: 72,
      views: 0,
      likes: 0,
      comments: 0,
      date: '10 mins ago',
    },
    {
      id: 'up-3',
      title: 'Community Moderation Protocol Notes (Draft)',
      type: 'text',
      status: 'draft',
      progress: 0,
      views: 0,
      likes: 0,
      comments: 0,
      date: 'Yesterday',
    },
  ]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-2">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Creator Studio & Analytics</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Track audience reach, engagement velocity, and manage processing jobs.
          </p>
        </div>

        <Link
          href="/upload"
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-500/20 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Upload</span>
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Views', value: '42.8K', change: '+18.4%', icon: Eye, color: 'text-blue-500' },
          { label: 'Watch Time (Hrs)', value: '1,420', change: '+24.1%', icon: Clock, color: 'text-indigo-500' },
          { label: 'New Followers', value: '1,240', change: '+9.2%', icon: Users, color: 'text-emerald-500' },
          { label: 'Total Likes', value: '8.9K', change: '+32.0%', icon: ThumbsUp, color: 'text-rose-500' },
        ].map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className="p-5 rounded-2xl bg-card/60 backdrop-blur-md border border-border/40 shadow-sm space-y-2"
            >
              <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
                <span>{kpi.label}</span>
                <Icon className={`w-4 h-4 ${kpi.color}`} />
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black tracking-tight text-foreground">{kpi.value}</span>
                <span className="text-xs text-emerald-400 font-bold">{kpi.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-foreground">Uploads & Content Pipeline</h2>
          <span className="text-xs text-muted-foreground">Real-time worker sync active</span>
        </div>

        <div className="rounded-2xl border border-border/40 overflow-hidden bg-card/40 backdrop-blur-md shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-secondary/40 text-xs font-bold text-muted-foreground uppercase tracking-wider border-b border-border/40">
                <tr>
                  <th className="p-4">Content</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Views</th>
                  <th className="p-4">Likes</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {uploads.map((item) => (
                  <tr key={item.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="p-4 font-semibold text-foreground max-w-xs truncate">
                      {item.title}
                    </td>
                    <td className="p-4">
                      {item.status === 'published' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" />
                          Published
                        </span>
                      )}
                      {item.status === 'processing' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/20">
                          <Loader2 className="w-3 h-3 animate-spin" />
                          Processing {item.progress}%
                        </span>
                      )}
                      {item.status === 'draft' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-zinc-500/15 text-zinc-400 border border-zinc-500/20">
                          <FileText className="w-3 h-3" />
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="p-4 font-mono text-xs text-muted-foreground">{item.views.toLocaleString()}</td>
                    <td className="p-4 font-mono text-xs text-muted-foreground">{item.likes.toLocaleString()}</td>
                    <td className="p-4 text-xs text-muted-foreground">{item.date}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2 text-muted-foreground">
                        <button className="p-1.5 hover:text-foreground hover:bg-secondary rounded-lg transition-colors">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setUploads(uploads.filter((u) => u.id !== item.id))}
                          className="p-1.5 hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}