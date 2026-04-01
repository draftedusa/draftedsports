import { GameStatus } from "@/types";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "live" | "final" | "upcoming" | "default" | "hot";
  className?: string;
}

export default function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  const base = "inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide";
  const variants: Record<string, string> = {
    live: "bg-brand text-white animate-pulse",
    final: "bg-surface-300 text-surface-muted",
    upcoming: "bg-blue-500/20 text-blue-400",
    hot: "bg-orange-600 text-white",
    default: "bg-surface-300 text-surface-muted",
  };
  return (
    <span className={`${base} ${variants[variant]} ${className}`}>
      {variant === "live" && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
      {children}
    </span>
  );
}

/** Convenience: maps GameStatus → Badge variant */
export function GameStatusBadge({ status }: { status: GameStatus }) {
  const variantMap: Record<GameStatus, "live" | "final" | "upcoming"> = {
    live: "live",
    final: "final",
    upcoming: "upcoming",
  };
  const labelMap: Record<GameStatus, string> = {
    live: "Live",
    final: "Final",
    upcoming: "Upcoming",
  };
  return <Badge variant={variantMap[status]}>{labelMap[status]}</Badge>;
}
