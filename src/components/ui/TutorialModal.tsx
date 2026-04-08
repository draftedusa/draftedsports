"use client";

import { useEffect, useState } from "react";

const TUTORIAL_KEY = "undrafted_tutorial_seen";

const STEPS = [
  {
    icon: "🏈",
    title: "Follow Your Teams",
    body: "Click any team card and hit Follow to get updates, scores, and breaking news straight to your feed.",
  },
  {
    icon: "⚡",
    title: "Fan Pulse is Live",
    body: "Drop your take in Fan Pulse and react to what other fans are saying — in real time, all game long.",
  },
  {
    icon: "🎬",
    title: "Film Room & Premium",
    body: "Unlock deep-dive film breakdowns, advanced metrics, and creator-exclusive content with UNDRAFTED+.",
  },
];

export default function TutorialModal() {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Only show if never dismissed before
    if (typeof window === "undefined") return;
    if (localStorage.getItem(TUTORIAL_KEY)) return;

    const timer = setTimeout(() => setVisible(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  function dismiss() {
    localStorage.setItem(TUTORIAL_KEY, "1");
    setVisible(false);
  }

  function next() {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      dismiss();
    }
  }

  if (!visible) return null;

  const current = STEPS[step];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={dismiss}
      />

      {/* Modal */}
      <div className="relative bg-surface-200 border border-surface-300 rounded-2xl shadow-2xl w-full max-w-sm p-6 z-10">
        {/* Close */}
        <button
          onClick={dismiss}
          className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center text-surface-muted hover:text-surface-text transition-colors rounded-lg hover:bg-surface-300"
          aria-label="Close tutorial"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>

        {/* Brand badge */}
        <div className="flex items-center gap-2 mb-5">
          <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest text-brand">Welcome to UNDRAFTED</span>
        </div>

        {/* Step icon */}
        <div className="text-5xl text-center mb-4">{current.icon}</div>

        {/* Content */}
        <h2 className="text-xl font-black tracking-tighter text-surface-text text-center mb-2">
          {current.title}
        </h2>
        <p className="text-sm text-surface-muted text-center leading-relaxed mb-6">
          {current.body}
        </p>

        {/* Step dots */}
        <div className="flex items-center justify-center gap-1.5 mb-5">
          {STEPS.map((_, i) => (
            <span
              key={i}
              className={`rounded-full transition-all duration-200 ${
                i === step
                  ? "w-4 h-2 bg-brand"
                  : "w-2 h-2 bg-surface-300"
              }`}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={dismiss}
            className="flex-1 px-4 py-2 bg-surface-300 hover:bg-surface-300 border border-surface-300 text-surface-muted text-sm font-semibold rounded-xl transition-colors"
          >
            Skip
          </button>
          <button
            onClick={next}
            className="flex-1 px-4 py-2 bg-brand hover:bg-brand/90 text-white text-sm font-bold rounded-xl transition-colors"
          >
            {step < STEPS.length - 1 ? "Next →" : "Get Started"}
          </button>
        </div>
      </div>
    </div>
  );
}
