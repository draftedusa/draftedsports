"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─────────────────────────────────────────────────────────
// DraftCoin hexagon icon (inline SVG)
// ─────────────────────────────────────────────────────────
function CoinIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
    >
      {/* Hexagon */}
      <path
        d="M10 2 L17 6 L17 14 L10 18 L3 14 L3 6 Z"
        fill="url(#coinGrad)"
        stroke="rgba(245,158,11,0.6)"
        strokeWidth="0.8"
      />
      {/* D letter */}
      <text
        x="10"
        y="13.5"
        textAnchor="middle"
        fontSize="7"
        fontWeight="900"
        fill="white"
        fontFamily="system-ui, sans-serif"
      >
        D
      </text>
      <defs>
        <linearGradient id="coinGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#fcd34d" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────
// PointsCounter
// ─────────────────────────────────────────────────────────
const STORAGE_KEY = "undrafted-draft-coins";
const BASE_COINS  = 420;

export default function PointsCounter() {
  const [coins, setCoins] = useState<number | null>(null);
  const [bump,  setBump]  = useState(false);

  // Load / initialise from localStorage
  useEffect(() => {
    let stored = parseInt(localStorage.getItem(STORAGE_KEY) ?? "", 10);
    if (isNaN(stored)) {
      stored = BASE_COINS;
      localStorage.setItem(STORAGE_KEY, String(stored));
    }
    setCoins(stored);

    // Listen for coin award events dispatched elsewhere in the app
    function onCoinEvent(e: Event) {
      const amt = (e as CustomEvent<number>).detail ?? 0;
      setCoins((prev) => {
        const next = (prev ?? BASE_COINS) + amt;
        localStorage.setItem(STORAGE_KEY, String(next));
        return next;
      });
      setBump(true);
      setTimeout(() => setBump(false), 800);
    }
    window.addEventListener("draft-coin-award", onCoinEvent);
    return () => window.removeEventListener("draft-coin-award", onCoinEvent);
  }, []);

  if (coins === null) return null; // SSR guard

  return (
    <motion.div
      animate={bump ? { scale: [1, 1.25, 1], y: [0, -3, 0] } : {}}
      transition={{ type: "spring", mass: 0.3, stiffness: 300, damping: 15 }}
      className="hidden lg:flex items-center gap-1.5 px-2.5 h-8 rounded-lg bg-amber-500/10 hover:bg-amber-500/15 border border-amber-500/20 transition-colors cursor-default select-none"
      title="DraftCoin — earned by activity on UNDRAFTED"
    >
      <CoinIcon size={14} />
      <AnimatePresence mode="wait">
        <motion.span
          key={coins}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ type: "spring", mass: 0.2, stiffness: 260, damping: 20 }}
          className="text-[11px] font-black text-amber-600 dark:text-amber-400 tabular-nums"
        >
          {coins.toLocaleString()}
        </motion.span>
      </AnimatePresence>
    </motion.div>
  );
}
