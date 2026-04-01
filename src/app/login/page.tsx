"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password.");
    } else {
      router.push("/");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left — violet brand panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-brand p-12 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-brand-light/20" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-white/5" />

        <Link href="/" className="relative z-10 text-3xl font-black italic tracking-tighter text-white">
          UNDRAFTED
        </Link>

        <div className="relative z-10">
          <h2 className="text-5xl font-black tracking-tighter leading-none text-white mb-4">
            GET THE PRO<br />EXPERIENCE.
          </h2>
          <p className="text-brand-light/80 text-lg font-medium max-w-xs">
            Live game control, breaking alerts, personalized feeds, and more. All in one place.
          </p>
        </div>

        <div className="relative z-10 flex gap-8 text-sm text-white/60">
          <span>🏈 NFL</span>
          <span>🏀 NBA</span>
          <span>⚾ MLB</span>
          <span>🏒 NHL</span>
        </div>
      </div>

      {/* Right — form panel */}
      <div className="flex-1 flex items-center justify-center bg-surface-100 p-8">
        <div className="w-full max-w-sm">
          <Link href="/" className="lg:hidden block text-2xl font-black italic tracking-tighter text-surface-text mb-8">
            UN<span className="text-brand">DRAFTED</span>
          </Link>

          <h1 className="text-2xl font-black tracking-tighter text-surface-text mb-1">Sign in</h1>
          <p className="text-sm text-surface-muted mb-8">
            Don&apos;t have an account?{" "}
            <span className="text-brand font-semibold cursor-pointer">Contact us</span>
          </p>

          {/* Demo hint */}
          <div className="mb-6 p-3 bg-brand/10 border border-brand/20 rounded-lg text-xs text-surface-muted space-y-1">
            <p><span className="font-semibold text-brand">Admin:</span> admin@undrafted.com / admin123</p>
            <p><span className="font-semibold text-surface-text">User:</span> user@test.com / user123</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-surface-muted uppercase tracking-wide mb-1.5">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-surface-200 border border-surface-300 rounded-lg px-4 py-3 text-surface-text placeholder-surface-muted text-sm focus:outline-none focus:border-brand transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-surface-muted uppercase tracking-wide mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-surface-200 border border-surface-300 rounded-lg px-4 py-3 text-surface-text placeholder-surface-muted text-sm focus:outline-none focus:border-brand transition-colors"
              />
            </div>

            {error && (
              <p className="text-sm text-red-500 font-medium">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-brand hover:bg-brand/90 disabled:opacity-60 text-white font-bold rounded-lg transition-colors text-sm"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-xs text-center text-surface-muted">
            <Link href="/" className="hover:text-surface-text transition-colors">← Back to UNDRAFTED</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
