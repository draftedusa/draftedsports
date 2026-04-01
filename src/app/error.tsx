"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error("Page error:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <p className="text-7xl mb-6">⚡</p>
      <h1 className="text-3xl font-black text-surface-text mb-2">Something went wrong</h1>
      <p className="text-surface-muted mb-6 max-w-sm text-sm">{error.message || "An unexpected error occurred."}</p>
      <div className="flex items-center gap-3">
        <button
          onClick={reset}
          className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-surface-text font-bold rounded-lg transition-colors text-sm"
        >
          Try Again
        </button>
        <Link href="/" className="px-5 py-2.5 bg-surface-200 hover:bg-surface-300 border border-surface-300 text-surface-text font-semibold rounded-lg transition-colors text-sm">
          Home
        </Link>
      </div>
    </div>
  );
}
