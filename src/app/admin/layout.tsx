import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "UNDRAFTED Admin",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-950">
      {/* Admin top nav */}
      <div className="bg-gray-900 border-b border-yellow-900/50 px-4 py-2 flex items-center gap-4">
        <Link href="/" className="text-sm font-black text-white">
          UN<span className="text-red-500">DRAFTED</span>
        </Link>
        <span className="text-gray-600">·</span>
        <span className="text-xs font-bold text-yellow-400 uppercase tracking-widest">Admin CMS</span>
        <div className="ml-auto flex items-center gap-3">
          <Link href="/admin/live-control" className="text-xs font-semibold text-yellow-400 hover:text-yellow-300 px-3 py-1.5 border border-yellow-800 hover:border-yellow-600 rounded transition-colors">
            ⚡ Live Control
          </Link>
          <Link href="/admin/analytics" className="text-xs font-semibold text-blue-400 hover:text-blue-300 px-3 py-1.5 border border-blue-800 hover:border-blue-600 rounded transition-colors">
            📊 Analytics
          </Link>
          <Link href="/" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
            ← Back to Site
          </Link>
        </div>
      </div>
      {children}
    </div>
  );
}
