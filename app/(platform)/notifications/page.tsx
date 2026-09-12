import { Bell, Heart, MessageSquare, UserPlus } from 'lucide-react';

export default function NotificationsPage() {
  const notifications = [
    {
      id: 'notif-1',
      type: 'like',
      actor: 'Cyber Sage',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      action: 'liked your video',
      target: 'Decentralized Storage & Freedom of Expression',
      time: '12m ago',
      icon: Heart,
      color: 'text-rose-500',
    },
    {
      id: 'notif-2',
      type: 'comment',
      actor: 'Tech Frontier',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      action: 'replied to your discussion on',
      target: 'FFmpeg media processing pipelines',
      time: '1h ago',
      icon: MessageSquare,
      color: 'text-blue-500',
    },
    {
      id: 'notif-3',
      type: 'follow',
      actor: 'Open Discourse Foundation',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      action: 'started following you',
      target: '',
      time: '3h ago',
      icon: UserPlus,
      color: 'text-emerald-500',
    },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-2">
      <div className="flex items-center gap-3 border-b border-border/40 pb-4">
        <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
          <Bell className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">Activity & Notifications</h1>
          <p className="text-xs text-muted-foreground">Real-time notifications for followers, mentions, and comments.</p>
        </div>
      </div>

      <div className="divide-y divide-border/30 rounded-2xl border border-border/40 bg-card/60 backdrop-blur-md overflow-hidden">
        {notifications.map((n) => {
          const Icon = n.icon;
          return (
            <div key={n.id} className="p-4 flex items-center gap-3.5 hover:bg-secondary/30 transition-colors">
              <div className="relative">
                <img
                  src={n.avatar}
                  alt={n.actor}
                  className="w-10 h-10 rounded-full object-cover border border-border"
                />
                <div className={`absolute -bottom-1 -right-1 p-1 rounded-full bg-background ring-1 ring-border ${n.color}`}>
                  <Icon className="w-3 h-3 fill-current" />
                </div>
              </div>

              <div className="flex-1 min-w-0 text-xs">
                <span className="font-bold text-foreground">{n.actor}</span>{' '}
                <span className="text-muted-foreground">{n.action}</span>{' '}
                {n.target && <span className="font-semibold text-foreground">"{n.target}"</span>}
                <p className="text-[11px] text-muted-foreground/70 font-mono mt-0.5">{n.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}