"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { users } from "@/data/users";

// Mock login — checks against hardcoded admin user in users.ts.
// No real security; purely structural/demo.
export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      const admin = users.find(
        (u) => u.role === "admin" && u.username === username && u.password === password
      );
      if (admin) {
        // Store mock session in sessionStorage (not secure — demo only)
        sessionStorage.setItem("undrafted_admin", "1");
        router.push("/admin/live-control");
      } else {
        setError("Invalid credentials. Try: SportsCentralAdmin / admin123");
        setLoading(false);
      }
    }, 600); // simulate latency
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <span className="text-3xl font-black text-white">
            UN<span className="text-red-500">DRAFTED</span>
          </span>
          <p className="text-sm text-yellow-400 font-bold mt-1 uppercase tracking-widest">Admin CMS</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-xl p-8 space-y-5">
          <h1 className="text-lg font-bold text-white text-center">Sign In</h1>

          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5 block">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="SportsCentralAdmin"
              required
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-600 transition-colors"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5 block">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-600 transition-colors"
            />
          </div>

          {error && (
            <p className="text-sm text-red-400 bg-red-950/30 border border-red-900 rounded px-3 py-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-yellow-600 hover:bg-yellow-500 disabled:opacity-50 text-black font-black text-sm rounded-lg transition-colors"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>

          <p className="text-xs text-gray-600 text-center">
            Demo credentials shown on failed login
          </p>
        </form>
      </div>
    </div>
  );
}
