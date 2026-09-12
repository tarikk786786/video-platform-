'use client';

import { useState } from 'react';
import { MOCK_EVENTS, EventItem } from '@/lib/mock-data';
import { 
  Calendar as CalendarIcon, 
  MapPin, 
  Users, 
  Clock, 
  Plus, 
  Check, 
  Share2, 
  ExternalLink,
  Sparkles,
  Search
} from 'lucide-react';

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>(MOCK_EVENTS);
  const [rsvpd, setRsvpd] = useState<Record<string, boolean>>({
    'ev-1': true,
  });
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'online' | 'in-person'>('all');

  const toggleRsvp = (id: string) => {
    const isNow = !rsvpd[id];
    setRsvpd((prev) => ({ ...prev, [id]: isNow }));
    setEvents((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, attendeesCount: e.attendeesCount + (isNow ? 1 : -1) } : e
      )
    );
  };

  const filtered = events.filter((e) => {
    if (filterType !== 'all' && e.locationType !== filterType) return false;
    if (search && !e.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-500/20 via-primary/10 to-secondary/30 border border-border/50 p-8 sm:p-12">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-500 text-xs font-semibold border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Community Meetups & Hackathons</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Events & Live Assemblies
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Attend virtual town halls, collaborative developer workshops, and local freedom tech summits hosted by sovereign creators.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-95 shadow-md shadow-primary/20 transition-all">
              <Plus className="w-4 h-4" />
              <span>Host an Event</span>
            </button>
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search events by keyword..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-muted-foreground"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-border/40 pb-3">
        <div className="flex items-center gap-2">
          {(['all', 'online', 'in-person'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                filterType === type
                  ? 'bg-foreground text-background'
                  : 'bg-secondary/40 text-muted-foreground hover:text-foreground'
              }`}
            >
              {type === 'all' ? 'All Events' : type}
            </button>
          ))}
        </div>

        <span className="text-xs text-muted-foreground">
          Showing {filtered.length} upcoming events
        </span>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((event) => {
          const isAttending = !!rsvpd[event.id];
          return (
            <div
              key={event.id}
              className="rounded-3xl bg-card border border-border/50 overflow-hidden flex flex-col justify-between group hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/5"
            >
              <div className="relative h-48 w-full bg-secondary overflow-hidden">
                <img
                  src={event.bannerUrl}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-bold border border-white/10 flex items-center gap-1.5">
                  <CalendarIcon className="w-3.5 h-3.5 text-primary" />
                  <span>{event.dateStr}</span>
                </div>

                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-medium flex items-center gap-1.5 border border-white/10">
                  <Users className="w-3 h-3 text-emerald-400" />
                  <span>{event.attendeesCount} RSVPs</span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white/90">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    {event.timeStr}
                  </span>
                  <span className="flex items-center gap-1.5 capitalize font-medium">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" />
                    {event.locationType}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="text-xs text-primary font-semibold">
                    Hosted by {event.creatorName}
                  </div>
                  <h3 className="font-bold text-lg text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                    {event.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-border/40 flex items-center justify-between gap-3">
                  <button
                    onClick={() => toggleRsvp(event.id)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      isAttending
                        ? 'bg-secondary text-foreground border border-border hover:bg-secondary/80'
                        : 'bg-primary text-primary-foreground hover:opacity-90 shadow-md shadow-primary/20'
                    }`}
                  >
                    {isAttending ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span>You're Going!</span>
                      </>
                    ) : (
                      <>
                        <CalendarIcon className="w-3.5 h-3.5" />
                        <span>RSVP Now</span>
                      </>
                    )}
                  </button>

                  <button
                    title="Share Event"
                    className="p-2.5 rounded-xl bg-secondary/60 hover:bg-secondary border border-border/50 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}