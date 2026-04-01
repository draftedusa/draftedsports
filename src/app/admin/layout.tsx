import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "UNDRAFTED Admin",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface-100">
      {/* Admin top nav */}
      <div className="bg-surface-200 border-b border-surface-300 px-4 py-2 flex items-center gap-4">
        <Link href="/" className="text-sm font-black italic tracking-tighter text-surface-text">
          UN<span className="text-brand">DRAFTED</span>
        </Link>
        <span className="text-surface-300">·</span>
        <span className="text-xs font-bold text-brand uppercase tracking-widest">Admin CMS</span>
        <div className="ml-auto flex items-center gap-3">
          <Link href="/admin/live-control" className="text-xs font-semibold text-yellow-500 hover:text-yellow-400 px-3 py-1.5 border border-yellow-800/50 hover:border-yellow-600 rounded-lg transition-colors">
            ⚡ Live Control
          </Link>
          <Link href="/admin/analytics" className="text-xs font-semibold text-blue-400 hover:text-blue-300 px-3 py-1.5 border border-blue-800/50 hover:border-blue-600 rounded-lg transition-colors">
            📊 Analytics
          </Link>
          <Link href="/" className="text-xs text-surface-muted hover:text-surface-text transition-colors">
            ← Back to Site
          </Link>
        </div>
      </div>
      {children}
    </div>
  );
}
