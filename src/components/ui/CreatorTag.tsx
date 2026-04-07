import Link from "next/link";

/**
 * Maps known bylines to their editorial franchise/show.
 * In production this would come from a CMS.
 */
const CREATOR_FRANCHISES: Record<string, { show: string; color: string }> = {
  "Marcus Webb":   { show: "Film Room",    color: "text-brand" },
  "Dana Howell":   { show: "Dynasty Watch", color: "text-amber-500" },
  "Priya Nair":    { show: "Big Board",     color: "text-emerald-500" },
  "Jamal Carter":  { show: "Inside Track",  color: "text-blue-400" },
  "Sarah Chen":    { show: "Power Rankings", color: "text-pink-500" },
  "Mike Torres":   { show: "Hot Seat",      color: "text-red-400" },
};

interface CreatorTagProps {
  byline: string;
  className?: string;
  showAvatar?: boolean;
}

export default function CreatorTag({ byline, className = "", showAvatar = false }: CreatorTagProps) {
  const franchise = CREATOR_FRANCHISES[byline];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showAvatar && (
        <div className="w-6 h-6 rounded-full bg-brand flex items-center justify-center text-white text-[10px] font-bold shrink-0">
          {byline[0]}
        </div>
      )}
      <div className="flex items-center gap-1.5 text-xs">
        <span className="font-semibold text-surface-text">{byline}</span>
        {franchise && (
          <>
            <span className="text-surface-muted">·</span>
            <span className={`font-bold ${franchise.color}`}>{franchise.show}</span>
          </>
        )}
      </div>
    </div>
  );
}
