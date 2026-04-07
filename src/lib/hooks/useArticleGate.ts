"use client";

import { useEffect, useState, useRef } from "react";

const FREE_ARTICLE_LIMIT = 3;

interface GateState {
  showPaywall: boolean;
  articlesViewed: number;
  dismissPaywall: () => void;
}

/**
 * Server-side article metering via HttpOnly cookie.
 *
 * Security properties:
 * - Counter lives in an HttpOnly cookie — cannot be read/modified by JS
 * - SameSite=Strict prevents cross-origin manipulation
 * - Server validates and increments via POST /api/gate
 *
 * Fallback: if the API call fails, falls back to sessionStorage (client-side)
 * to ensure the paywall still renders — just not JS-bypass-proof in that edge case.
 */
export function useArticleGate(slug: string): GateState {
  const [showPaywall, setShowPaywall] = useState(false);
  const [articlesViewed, setArticlesViewed] = useState(0);
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    async function checkGate() {
      try {
        // POST to server-side gate — increments HttpOnly cookie
        const res = await fetch("/api/gate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug }),
          credentials: "same-origin",
        });

        if (!res.ok) throw new Error(`Gate API ${res.status}`);

        const { count, paywalled } = await res.json();
        setArticlesViewed(count);
        if (paywalled) setShowPaywall(true);
      } catch {
        // Fallback: sessionStorage-based counting
        // This activates only if the API route is unreachable.
        // The paywall still fires — just not HttpOnly-hardened.
        try {
          const KEY = "undrafted_gate_fallback";
          const raw = sessionStorage.getItem(KEY);
          const visited: string[] = raw ? JSON.parse(raw) : [];
          if (!visited.includes(slug)) visited.push(slug);
          sessionStorage.setItem(KEY, JSON.stringify(visited));
          setArticlesViewed(visited.length);
          if (visited.length > FREE_ARTICLE_LIMIT) setShowPaywall(true);
        } catch {
          // sessionStorage also unavailable — fail silently, no paywall
        }
      }
    }

    checkGate();
  }, [slug]);

  function dismissPaywall() {
    setShowPaywall(false);
  }

  return { showPaywall, dismissPaywall, articlesViewed };
}
