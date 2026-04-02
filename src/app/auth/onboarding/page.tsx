"use client";

import { useState } from "react";
import Link from "next/link";

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleStep1(e: React.FormEvent) {
    e.preventDefault();
    setStep(2);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-surface-100">
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
          <p className="text-sm text-surface-muted">Create your free account</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 justify-center mb-6">
          {[1, 2].map((s) => (
            <div
              key={s}
              className={`w-2 h-2 rounded-full transition-colors ${
                s === step ? "bg-brand" : s < step ? "bg-brand/40" : "bg-surface-300"
              }`}
            />
          ))}
        </div>

        <div className="bg-surface-200 border border-surface-300 rounded-2xl p-6">
          {step === 1 && (
            <form onSubmit={handleStep1} className="space-y-4">
              <h2 className="text-sm font-black text-surface-text mb-4">Your details</h2>
              <div>
                <label className="block text-xs font-bold text-surface-text mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full bg-surface-100 border border-surface-300 rounded-lg px-3 py-2 text-sm text-surface-text placeholder-surface-muted focus:outline-none focus:border-brand transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-surface-text mb-1.5">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="rocketsfan88"
                  required
                  className="w-full bg-surface-100 border border-surface-300 rounded-lg px-3 py-2 text-sm text-surface-text placeholder-surface-muted focus:outline-none focus:border-brand transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-surface-text mb-1.5">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full bg-surface-100 border border-surface-300 rounded-lg px-3 py-2 text-sm text-surface-text placeholder-surface-muted focus:outline-none focus:border-brand transition-colors"
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2.5 bg-brand hover:bg-brand/90 text-white font-bold rounded-xl text-sm transition-colors"
              >
                Continue
              </button>
            </form>
          )}

          {step === 2 && (
            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-brand/20 flex items-center justify-center text-2xl mx-auto">
                🎉
              </div>
              <h2 className="text-sm font-black text-surface-text">Welcome to UNDRAFTED!</h2>
              <p className="text-xs text-surface-muted">
                Your account has been created. Start exploring unlimited sports coverage.
              </p>
              <Link
                href="/"
                className="block w-full px-4 py-2.5 bg-brand hover:bg-brand/90 text-white font-bold rounded-xl text-sm transition-colors text-center"
              >
                Go to Homepage
              </Link>
            </div>
          )}

          {step === 1 && (
            <div className="mt-4 pt-4 border-t border-surface-300 text-center">
              <p className="text-xs text-surface-muted">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-brand font-bold hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
