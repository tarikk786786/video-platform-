'use client';

import { useState } from 'react';

const REACTIONS = [
  { id: 'heart', emoji: '❤️', label: 'Heart' },
  { id: 'fire', emoji: '🔥', label: 'Fire' },
  { id: 'clap', emoji: '👏', label: 'Clap' },
  { id: 'laugh', emoji: '😂', label: 'Laugh' },
  { id: 'wow', emoji: '😮', label: 'Wow' },
  { id: 'sad', emoji: '😢', label: 'Sad' },
];

interface ReactionsPickerProps {
  initialReactions?: Record<string, number>;
  onReact?: (reactionId: string) => void;
}

export function ReactionsPicker({
  initialReactions = {},
  onReact,
}: ReactionsPickerProps) {
  const [reactions, setReactions] = useState<Record<string, number>>(initialReactions);
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  const handleSelect = (id: string) => {
    const isRemoving = selectedReaction === id;
    setSelectedReaction(isRemoving ? null : id);

    setReactions((prev) => {
      const next = { ...prev };
      if (isRemoving) {
        next[id] = Math.max(0, (next[id] || 1) - 1);
        if (next[id] === 0) delete next[id];
      } else {
        next[id] = (next[id] || 0) + 1;
        if (selectedReaction && next[selectedReaction]) {
          next[selectedReaction] = Math.max(0, next[selectedReaction] - 1);
          if (next[selectedReaction] === 0) delete next[selectedReaction];
        }
      }
      return next;
    });

    setShowPicker(false);
    onReact?.(id);
  };

  return (
    <div className="relative flex items-center gap-1.5">
      {/* Existing reactions pills */}
      <div className="flex items-center gap-1">
        {Object.entries(reactions).map(([key, count]) => {
          const rObj = REACTIONS.find((r) => r.id === key);
          if (!rObj || count <= 0) return null;
          const isSelected = selectedReaction === key;

          return (
            <button
              key={key}
              onClick={() => handleSelect(key)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-all border ${
                isSelected
                  ? 'bg-primary/20 border-primary text-primary'
                  : 'bg-secondary/60 hover:bg-secondary border-border/40 text-foreground'
              }`}
            >
              <span>{rObj.emoji}</span>
              <span className="text-[11px] font-mono">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Add reaction button */}
      <div className="relative">
        <button
          onClick={() => setShowPicker(!showPicker)}
          className="px-2.5 py-1 rounded-full bg-secondary/50 hover:bg-secondary border border-border/40 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          React +
        </button>

        {showPicker && (
          <div className="absolute bottom-9 left-0 bg-card border border-border rounded-full p-1 shadow-2xl flex items-center gap-1 z-30 animate-in fade-in zoom-in-95">
            {REACTIONS.map((r) => (
              <button
                key={r.id}
                onClick={() => handleSelect(r.id)}
                className="w-8 h-8 rounded-full hover:bg-secondary flex items-center justify-center text-lg hover:scale-125 transition-transform"
                title={r.label}
              >
                {r.emoji}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}