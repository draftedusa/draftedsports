"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await signIn("credentials", {
      username: email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (result?.error) {
      setError("Invalid username or password.");
    } else {
      window.location.href = "/";
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-surface-100">
      {/* Back link */}
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-xs text-surface-muted hover:text-surface-text transition-colors"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5m7-7-7 7 7 7" />
        </svg>
        Back to UNDRAFTED
      </Link>

      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-brand" />
            <span className="text-xl font-black tracking-tighter text-surface-text">UNDRAFTED</span>
          </div>
          <p className="text-sm text-surface-muted">Sign in to your account</p>
        </div>

        {/* Form */}
        <div className="bg-surface-200 border border-surface-300 rounded-2xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-surface-text mb-1.5">
                Username or Email
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rocketsfan88"
                required
                className="w-full bg-surface-100 border border-surface-300 rounded-lg px-3 py-2 text-sm text-surface-text placeholder-surface-muted focus:outline-none focus:border-brand transition-colors"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-surface-text">Password</label>
                <button type="button" className="text-[10px] text-brand hover:underline">
                  Forgot password?
                </button>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-surface-100 border border-surface-300 rounded-lg px-3 py-2 text-sm text-surface-text placeholder-surface-muted focus:outline-none focus:border-brand transition-colors"
              />
            </div>

            {error && (
              <p className="text-xs text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2.5 bg-brand hover:bg-brand/90 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold rounded-xl text-sm transition-colors"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-surface-300 text-center">
            <p className="text-xs text-surface-muted">
              Don&apos;t have an account?{" "}
              <Link href="/auth/onboarding" className="text-brand font-bold hover:underline">
                Create one free
              </Link>
            </p>
          </div>
        </div>

        {/* Demo hint */}
        <p className="text-center text-[10px] text-surface-muted mt-4">
          Demo credentials: <span className="font-mono">SportsCentralAdmin</span> / <span className="font-mono">admin123</span>
        </p>
      </div>
    </div>
  );
}
