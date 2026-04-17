"use client";

import { useState } from "react";
import Link from "next/link";

const NOTIFICATION_TYPES = [
  { key: "achievement_earned",      emoji: "🏆", label: "Achievement earned",      desc: "When you unlock a new achievement" },
  { key: "new_follower",            emoji: "👤", label: "New follower",             desc: "When someone starts following you" },
  { key: "post_liked",              emoji: "🔥", label: "Post reactions",           desc: "When someone reacts to your post" },
  { key: "post_replied",            emoji: "💬", label: "Post replies",             desc: "When someone replies to your post" },
  { key: "team_game_live",          emoji: "🏟️", label: "Team game is live",       desc: "When a game involving your teams starts" },
  { key: "article_saved_milestone", emoji: "📚", label: "Reading milestones",       desc: "When you hit article-saving milestones" },
  { key: "teammate_formed",         emoji: "🤝", label: "New teammate",             desc: "When you and another fan share teams" },
  { key: "live_game_alert",         emoji: "⚡", label: "Game starting soon",       desc: "5-minute warning before a game starts" },
];

const STORAGE_KEY = "notif_settings";

function loadSettings(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

export default function NotificationSettingsPage() {
  const [settings, setSettings] = useState<Record<string, boolean>>(() => {
    const saved = loadSettings();
    return Object.fromEntries(NOTIFICATION_TYPES.map((t) => [t.key, saved[t.key] ?? true]));
  });

  function toggle(key: string) {
    setSettings((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/notifications" className="text-xs font-bold text-surface-muted hover:text-surface-text transition-colors">
          ← Back
        </Link>
        <h1 className="text-2xl font-black tracking-tighter text-surface-text">Notification Settings</h1>
      </div>

      <div className="bg-surface-200 border border-surface-300 rounded-2xl overflow-hidden divide-y divide-surface-300">
        {NOTIFICATION_TYPES.map((type) => (
          <div key={type.key} className="flex items-center gap-3 px-4 py-4">
            <span className="text-xl shrink-0">{type.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-surface-text">{type.label}</p>
              <p className="text-xs text-surface-muted">{type.desc}</p>
            </div>
            <button
              role="switch"
              aria-checked={settings[type.key]}
              onClick={() => toggle(type.key)}
              className={`relative w-10 h-5 rounded-full transition-colors shrink-0 ${
                settings[type.key] ? "bg-brand" : "bg-surface-300"
              }`}
            >
              <span
                className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                  settings[type.key] ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        ))}
      </div>

      <p className="text-xs text-surface-muted mt-4 text-center">
        Settings are saved to your browser.
      </p>
    </div>
  );
}
