"use client";

import { useEffect } from "react";
import Link from "next/link";

interface PaywallModalProps {
  onClose: () => void;
}

export default function PaywallModal({ onClose }: PaywallModalProps) {
  // Close on ESC
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", backgroundColor: "rgba(0,0,0,0.4)" }}
      onClick={onClose}
    >
      <div
        className="relative bg-surface-100 border border-surface-300 rounded-2xl p-8 max-w-md w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-surface-200 hover:bg-surface-300 flex items-center justify-center text-surface-muted hover:text-surface-text transition-colors"
          aria-label="Close"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Logo / badge */}
        <div className="flex items-center gap-2 mb-5">
          <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
          <span className="text-xs font-black tracking-widest uppercase text-brand">UNDRAFTED</span>
        </div>

        {/* Headline */}
        <h2 className="text-2xl font-black tracking-tighter text-surface-text mb-2">
          You&apos;ve reached your free article limit
        </h2>
        <p className="text-sm text-surface-muted leading-relaxed mb-6">
          Get unlimited access to in-depth analysis, live coverage, and breaking news. No ads. No limits. Cancel any time.
        </p>

        {/* Benefits */}
        <ul className="space-y-2 mb-6">
          {[
            "Unlimited articles across all sports",
            "Live game coverage & breaking news alerts",
            "Exclusive film room & draft analysis",
            "Ad-free reading experience",
          ].map((benefit) => (
            <li key={benefit} className="flex items-center gap-2 text-sm text-surface-text">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-brand shrink-0">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
              </svg>
              {benefit}
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Link
          href="/auth/login"
          className="block w-full text-center px-6 py-3 bg-brand hover:bg-brand/90 text-white font-bold rounded-xl text-sm transition-colors mb-3"
        >
          Start Free Trial
        </Link>
        <Link
          href="/auth/onboarding"
          className="block w-full text-center px-6 py-3 bg-surface-200 hover:bg-surface-300 border border-surface-300 text-surface-text font-bold rounded-xl text-sm transition-colors mb-4"
        >
          Create Free Account
        </Link>

        {/* No thanks */}
        <button
          onClick={onClose}
          className="block w-full text-center text-xs text-surface-muted hover:text-surface-text transition-colors"
        >
          No thanks, I&apos;ll stick with limited access
        </button>
      </div>
    </div>
  );
}
