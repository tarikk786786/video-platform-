'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, X, SkipBack, SkipForward, Music } from 'lucide-react';

export interface ActiveAudioTrack {
  title: string;
  creatorName: string;
  coverUrl: string;
  audioUrl: string;
}

export function PersistentAudioPlayer({
  track,
  onClose,
}: {
  track: ActiveAudioTrack | null;
  onClose?: () => void;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (track && audioRef.current) {
      audioRef.current.src = track.audioUrl;
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  }, [track]);

  if (!track) return null;

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    setDuration(audioRef.current.duration);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
      setCurrentTime(val);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-11/12 max-w-3xl bg-card/90 backdrop-blur-xl border border-border/60 rounded-2xl shadow-2xl p-3 z-40 flex items-center justify-between gap-4">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      />

      {/* Track Info */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <img
          src={track.coverUrl}
          alt={track.title}
          className="w-12 h-12 rounded-xl object-cover border border-border/50 shrink-0"
        />
        <div className="min-w-0 flex-1">
          <h4 className="text-xs font-bold text-foreground truncate">{track.title}</h4>
          <p className="text-[11px] text-muted-foreground truncate">{track.creatorName}</p>
        </div>
      </div>

      {/* Playback Controls & Scrubber */}
      <div className="flex flex-col items-center gap-1.5 flex-1 max-w-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => { if (audioRef.current) audioRef.current.currentTime -= 15; }}
            className="text-muted-foreground hover:text-foreground transition-colors"
            title="Rewind 15s"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={togglePlay}
            className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:scale-105 transition-transform"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>

          <button
            onClick={() => { if (audioRef.current) audioRef.current.currentTime += 15; }}
            className="text-muted-foreground hover:text-foreground transition-colors"
            title="Fast forward 15s"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        <div className="w-full flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground font-mono">{formatTime(currentTime)}</span>
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <span className="text-[10px] text-muted-foreground font-mono">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Volume & Close */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            if (audioRef.current) {
              audioRef.current.muted = !isMuted;
              setIsMuted(!isMuted);
            }
          }}
          className="p-1.5 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground transition-colors"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}