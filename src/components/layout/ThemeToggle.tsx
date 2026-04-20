"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="theme-pill"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      role="switch"
      aria-checked={isDark}
    >
      {/* Labels */}
      <span className={`absolute left-6 min-w-[52px] text-[9px] font-bold uppercase tracking-wide transition-opacity select-none ${isDark ? "opacity-0" : "opacity-60"} text-surface-text`}>
        Light
      </span>
      <span className={`absolute right-1.5 min-w-[52px] text-[9px] font-bold uppercase tracking-wide transition-opacity select-none ${isDark ? "opacity-60" : "opacity-0"} text-surface-text`}>
        Dark
      </span>
      {/* Thumb */}
      <span className="theme-pill-thumb" />
    </button>
  );
}
