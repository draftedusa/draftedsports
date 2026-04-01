export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6 animate-pulse">
      {/* Hero skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-64 bg-surface-300 rounded-xl" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-3">
              <div className="w-16 h-16 bg-surface-300 rounded shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-surface-300 rounded w-full" />
                <div className="h-3 bg-surface-300 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-surface-300 rounded-xl h-48" />
        ))}
      </div>
    </div>
  );
}
