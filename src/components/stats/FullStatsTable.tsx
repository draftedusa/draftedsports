"use client";

import { useState } from "react";

export interface ColumnDef {
  key: string;
  label: string;
  align?: "left" | "right";
}

export interface StatRow {
  rank: number;
  name: string;
  team: string;
  conference?: string;
  [key: string]: string | number | undefined;
}

interface FullStatsTableProps {
  title: string;
  columns: ColumnDef[];
  rows: StatRow[];
  conferenceToggle?: boolean;
  conferences?: string[];
}

const PAGE_SIZE = 10;

export default function FullStatsTable({
  title,
  columns,
  rows,
  conferenceToggle,
  conferences,
}: FullStatsTableProps) {
  const [page, setPage] = useState(1);
  const [activeConf, setActiveConf] = useState("All");

  const filtered =
    activeConf === "All" ? rows : rows.filter((r) => r.conference === activeConf);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const start      = (page - 1) * PAGE_SIZE;
  const end        = Math.min(start + PAGE_SIZE, filtered.length);
  const visible    = filtered.slice(start, end);
  const showingFrom = filtered.length === 0 ? 0 : start + 1;

  function handleConf(conf: string) {
    setActiveConf(conf);
    setPage(1);
  }

  return (
    <div className="rounded-xl border border-surface-300 bg-surface-200 overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-surface-300">
        <h2 className="text-[10px] font-black uppercase tracking-widest text-surface-muted">
          {title}
        </h2>
        <span className="text-[9px] font-mono text-surface-muted tabular-nums">
          {showingFrom}–{end} of {filtered.length}
        </span>
      </div>

      {/* Conference toggle */}
      {conferenceToggle && conferences && (
        <div className="flex items-center gap-2 px-4 py-2 border-b border-surface-300 flex-wrap">
          {["All", ...conferences].map((conf) => (
            <button
              key={conf}
              onClick={() => handleConf(conf)}
              className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest transition-colors ${
                activeConf === conf
                  ? "bg-brand text-white"
                  : "border border-surface-300 text-surface-muted hover:text-surface-text hover:border-brand/40"
              }`}
            >
              {conf}
            </button>
          ))}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-surface-200 border-b border-surface-300">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-3 py-2.5 text-[9px] font-black uppercase tracking-widest text-surface-muted whitespace-nowrap ${
                    col.align === "left" ? "text-left" : "text-right"
                  }`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-300">
            {visible.map((row, i) => (
              <tr
                key={`${row.rank}-${row.name}`}
                className={`transition-colors hover:bg-surface-300/30 ${
                  i % 2 === 1 ? "bg-surface-300/10" : ""
                }`}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={[
                      "px-3 py-2.5 text-xs tabular-nums whitespace-nowrap",
                      col.align === "left" ? "text-left" : "text-right",
                      col.key === "rank"        ? "text-surface-muted font-mono w-8" : "",
                      col.key === "name"        ? "font-bold text-surface-text text-left" : "",
                      col.key === "team"        ? "text-surface-muted uppercase text-[10px] text-left" : "",
                      col.key === "conference"  ? "text-surface-muted uppercase text-[10px] text-left" : "",
                      col.key !== "rank" && col.key !== "name" && col.key !== "team" && col.key !== "conference"
                        ? "text-surface-muted"
                        : "",
                    ].join(" ")}
                  >
                    {row[col.key] ?? "—"}
                  </td>
                ))}
              </tr>
            ))}
            {visible.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-8 text-center text-xs text-surface-muted"
                >
                  No data for this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-surface-300">
          <span className="text-[9px] font-mono text-surface-muted tabular-nums">
            Page {page} of {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 text-[10px] font-black uppercase border border-surface-300 text-surface-muted rounded-lg hover:text-surface-text hover:border-brand/40 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Prev
            </button>
            <span className="text-[10px] font-mono text-surface-muted tabular-nums w-12 text-center">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 text-[10px] font-black uppercase border border-surface-300 text-surface-muted rounded-lg hover:text-surface-text hover:border-brand/40 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
