"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUser, SignInButton } from "@clerk/nextjs";
import { Bell } from "lucide-react";

const POLL_MS = 60_000;

export default function NotificationBell() {
  const { isSignedIn } = useUser();
  const router = useRouter();
  const [unread, setUnread] = useState(0);

  const poll = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications?unread=1");
      if (!res.ok) return;
      const { unreadCount } = await res.json();
      setUnread(unreadCount ?? 0);
    } catch {}
  }, []);

  useEffect(() => {
    if (!isSignedIn) { setUnread(0); return; }
    poll();
    const id = setInterval(poll, POLL_MS);
    return () => clearInterval(id);
  }, [isSignedIn, poll]);

  if (!isSignedIn) {
    return (
      <SignInButton mode="modal">
        <button
          aria-label="Sign in to see notifications"
          className="relative p-2 text-white/60 hover:text-white transition-colors"
        >
          <Bell size={18} />
        </button>
      </SignInButton>
    );
  }

  return (
    <button
      aria-label={`Notifications${unread > 0 ? ` — ${unread} unread` : ""}`}
      onClick={() => router.push("/notifications")}
      className="relative p-2 text-white/60 hover:text-white transition-colors"
    >
      <Bell size={18} />
      {unread > 0 && (
        <span
          aria-hidden
          className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-600 ring-1 ring-black"
        />
      )}
    </button>
  );
}
