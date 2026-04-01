import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <p className="text-8xl mb-6">🏟️</p>
      <h1 className="text-4xl font-black text-surface-text mb-2">404 — Out of Bounds</h1>
      <p className="text-surface-muted mb-8 max-w-sm">
        This page went out of bounds. Maybe the article was pulled, the team moved, or the link is just wrong.
      </p>
      <div className="flex items-center gap-3">
        <Link href="/" className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-surface-text font-bold rounded-lg transition-colors text-sm">
          Back to Home
        </Link>
        <Link href="/scores" className="px-5 py-2.5 bg-surface-200 hover:bg-surface-300 border border-surface-300 text-surface-text font-semibold rounded-lg transition-colors text-sm">
          View Scores
        </Link>
      </div>
    </div>
  );
}
