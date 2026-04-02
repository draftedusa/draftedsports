interface SkeletonProps {
  className?: string;
}

export function SkeletonBlock({ className = "" }: SkeletonProps) {
  return <div className={`skeleton ${className}`} />;
}

export function SkeletonArticleCard() {
  return (
    <div className="bg-surface-200 border border-surface-300 rounded-xl overflow-hidden">
      <SkeletonBlock className="h-36 w-full rounded-none" />
      <div className="p-4 space-y-2">
        <SkeletonBlock className="h-3 w-1/3" />
        <SkeletonBlock className="h-4 w-full" />
        <SkeletonBlock className="h-4 w-5/6" />
        <SkeletonBlock className="h-3 w-2/5 mt-3" />
      </div>
    </div>
  );
}

export function SkeletonHero() {
  return (
    <div className="space-y-4">
      <SkeletonBlock className="aspect-video w-full rounded-xl" />
      <SkeletonBlock className="h-3 w-24" />
      <SkeletonBlock className="h-8 w-full" />
      <SkeletonBlock className="h-8 w-3/4" />
      <SkeletonBlock className="h-4 w-1/3" />
    </div>
  );
}

export function SkeletonGameCard() {
  return (
    <div className="bg-surface-200 border border-surface-300 rounded-xl p-4 space-y-3">
      <SkeletonBlock className="h-3 w-16" />
      <div className="flex justify-between items-center">
        <SkeletonBlock className="h-4 w-28" />
        <SkeletonBlock className="h-6 w-10" />
      </div>
      <div className="flex justify-between items-center">
        <SkeletonBlock className="h-4 w-28" />
        <SkeletonBlock className="h-6 w-10" />
      </div>
    </div>
  );
}

export function SkeletonSidebarList() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-start gap-3">
          <SkeletonBlock className="h-8 w-8 rounded-full shrink-0" />
          <div className="flex-1 space-y-1.5">
            <SkeletonBlock className="h-3 w-full" />
            <SkeletonBlock className="h-3 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
}
