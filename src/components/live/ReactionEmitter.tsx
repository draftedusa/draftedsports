"use client";

import { useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

// ─────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────
interface Particle {
  id: number;
  emoji: string;
  /** Horizontal drift offset in px */
  drift: number;
}

const EMOJIS = ["🔥", "🧊", "😱"] as const;

// ─────────────────────────────────────────────────────────
// Particle
// ─────────────────────────────────────────────────────────
function ReactionParticle({
  particle,
  onDone,
}: {
  particle: Particle;
  onDone: (id: number) => void;
}) {
  return (
    <motion.span
      className="absolute bottom-14 left-1/2 pointer-events-none select-none text-2xl leading-none"
      style={{ x: particle.drift - 12 }}
      initial={{ opacity: 1, y: 0, scale: 1 }}
      animate={{
        opacity:  [1, 1, 0.7, 0],
        y:        [-20, -90, -200, -310],
        scale:    [1, 1.35, 1.1, 0.7],
        x:        particle.drift + (Math.random() > 0.5 ? 16 : -16),
      }}
      transition={{
        duration: 2.4,
        type: "spring",
        mass: 0.25,
        stiffness: 70,
        damping: 12,
      }}
      onAnimationComplete={() => onDone(particle.id)}
    >
      {particle.emoji}
    </motion.span>
  );
}

// ─────────────────────────────────────────────────────────
// Main emitter
// ─────────────────────────────────────────────────────────
export default function ReactionEmitter({ slug }: { slug: string }) {
  const pathname = usePathname();
  const [particles, setParticles] = useState<Particle[]>([]);

  // Only visible on pulse and betting sub-routes
  const isVisible =
    pathname === `/league/${slug}/pulse` ||
    pathname === `/league/${slug}/betting`;

  const removeParticle = useCallback((id: number) => {
    setParticles((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const emit = useCallback((emoji: string) => {
    const drift = Math.random() * 28 - 14;
    setParticles((prev) => [
      ...prev.slice(-12), // cap at 12 concurrent particles
      { id: Date.now() + Math.random(), emoji, drift },
    ]);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[150] flex flex-col items-center"
      aria-label="Live reactions"
    >
      {/* Particle canvas — no pointer events */}
      <div className="relative pointer-events-none">
        <AnimatePresence>
          {particles.map((p) => (
            <ReactionParticle key={p.id} particle={p} onDone={removeParticle} />
          ))}
        </AnimatePresence>
      </div>

      {/* Emoji button strip */}
      <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl border border-surface-300 dark:border-white/10 shadow-lg"
        style={{ background: "var(--surface-100)" }}
      >
        <span className="text-[8px] font-black uppercase tracking-widest text-surface-muted mr-1 hidden sm:inline">
          React
        </span>
        {EMOJIS.map((emoji) => (
          <motion.button
            key={emoji}
            type="button"
            onClick={() => emit(emoji)}
            aria-label={`React ${emoji}`}
            whileTap={{ scale: 0.82 }}
            whileHover={{ scale: 1.18 }}
            transition={{ type: "spring", mass: 0.3, stiffness: 280, damping: 16 }}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-xl hover:bg-surface-200 transition-colors"
          >
            {emoji}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
