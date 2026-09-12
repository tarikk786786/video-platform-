'use client';

import { useState } from 'react';
import {
  Shield,
  AlertTriangle,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [reports, setReports] = useState([
    {
      id: 'rep-1',
      reporter: '@user_delta',
      target: 'Spam comment loop on video #1',
      reason: 'Automated spam promotion',
      status: 'pending',
      time: '15 mins ago',
    },
    {
      id: 'rep-2',
      reporter: '@freedom_advocate',
      target: 'Copyright claimant notification',
      reason: 'Fair use review requested',
      status: 'investigating',
      time: '1 hour ago',
    },
  ]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-2">
      <div className="border-b border-border/40 pb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider mb-1">
            <Shield className="w-4 h-4" />
            <span>FreedomPlay System Administration</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Platform & Moderation Console</h1>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>Core Services 100% Operational</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Total Users', value: '18,420', sub: '+12% this week' },
          { label: 'Published Items', value: '45.2K', sub: '99.8% auto-published' },
          { label: 'Views (24h)', value: '342.1K', sub: 'Peak 4,200 req/s' },
          { label: 'Storage Used', value: '1.42 TB', sub: 'Telegram / Local' },
          { label: 'Active Reports', value: '2', sub: '0 urgent flags' },
          { label: 'Job Failures', value: '0', sub: '100% worker success' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="p-4 rounded-2xl bg-card/60 border border-border/40 space-y-1"
          >
            <span className="text-[11px] font-semibold text-muted-foreground uppercase">{stat.label}</span>
            <div className="text-lg font-black text-foreground">{stat.value}</div>
            <div className="text-[10px] text-muted-foreground/80">{stat.sub}</div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Community Reports & Safety Triage</span>
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Investigate reports without arbitrary suppression of legitimate controversial speech.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-border/40 overflow-hidden bg-card/40 backdrop-blur-md shadow-lg">
          <table className="w-full text-left text-sm">
            <thead className="bg-secondary/40 text-xs font-bold text-muted-foreground uppercase tracking-wider border-b border-border/40">
              <tr>
                <th className="p-4">Reporter</th>
                <th className="p-4">Reported Target</th>
                <th className="p-4">Alleged Reason</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {reports.map((rep) => (
                <tr key={rep.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="p-4 font-mono text-xs text-foreground">{rep.reporter}</td>
                  <td className="p-4 text-xs font-medium text-foreground">{rep.target}</td>
                  <td className="p-4 text-xs text-muted-foreground">{rep.reason}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/20">
                      {rep.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2 text-xs font-semibold">
                      <button
                        onClick={() => setReports(reports.filter((r) => r.id !== rep.id))}
                        className="px-3 py-1 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 rounded-lg transition-colors"
                      >
                        Dismiss
                      </button>
                      <button
                        onClick={() => {
                          alert('Action taken: restricted abusive target according to community guidelines.');
                          setReports(reports.filter((r) => r.id !== rep.id));
                        }}
                        className="px-3 py-1 bg-destructive/20 text-destructive hover:bg-destructive/30 rounded-lg transition-colors"
                      >
                        Enforce
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
  );
}