"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function MarkReadButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function markAll() {
    setLoading(true);
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ all: true }),
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <button
      onClick={markAll}
      disabled={loading}
      className="text-xs font-bold text-brand hover:text-brand/80 transition-colors disabled:opacity-50"
    >
      {loading ? "Marking…" : "Mark all read"}
    </button>
  );
}
