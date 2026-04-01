"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [done, setDone] = useState(false);

  if (done) {
    return <p className="text-green-400 font-semibold text-sm">✅ You&apos;re in! Check your inbox.</p>;
  }

  return (
    <form
      className="flex gap-2 max-w-sm mx-auto"
      onSubmit={(e) => { e.preventDefault(); setDone(true); }}
    >
      <input
        type="email"
        required
        placeholder="your@email.com"
        className="flex-1 bg-surface-300 border border-surface-300 rounded-lg px-4 py-2.5 text-surface-text placeholder-surface-muted text-sm focus:outline-none focus:border-brand"
      />
      <button type="submit" className="px-5 py-2.5 bg-brand hover:bg-brand/90 text-white font-bold text-sm rounded-lg transition-colors">
        Subscribe
      </button>
    </form>
  );
}
