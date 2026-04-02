"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "undrafted_articles_viewed";
const FREE_ARTICLE_LIMIT = 3;

function getViewedArticles(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function recordArticleView(slug: string): string[] {
  const viewed = getViewedArticles();
  if (viewed.includes(slug)) return viewed;
  const updated = [...viewed, slug];
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // sessionStorage unavailable
  }
  return updated;
}

/**
 * Tracks article views in sessionStorage.
 * Returns `showPaywall: true` once the user exceeds FREE_ARTICLE_LIMIT unique articles.
 */
export function useArticleGate(slug: string) {
  const [showPaywall, setShowPaywall] = useState(false);

  useEffect(() => {
    const viewed = recordArticleView(slug);
    if (viewed.length > FREE_ARTICLE_LIMIT) {
      setShowPaywall(true);
    }
  }, [slug]);

  function dismissPaywall() {
    setShowPaywall(false);
  }

  return { showPaywall, dismissPaywall, articlesViewed: getViewedArticles().length };
}
