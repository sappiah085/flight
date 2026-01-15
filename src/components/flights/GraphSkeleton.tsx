export function PriceGraphSkeleton() {
  return (
    <div className="floating-card p-5 lg:p-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="space-y-2">
          <div className="h-5 w-32 rounded-md bg-muted" />
          <div className="h-4 w-40 rounded-md bg-muted/70" />
        </div>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-muted" />
            <div className="h-4 w-20 rounded-md bg-muted/70" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-muted" />
            <div className="h-4 w-20 rounded-md bg-muted/70" />
          </div>
        </div>
      </div>

      {/* Chart area */}
      <div className="h-48 lg:h-56 rounded-xl bg-muted/40 relative overflow-hidden">
        {/* Fake grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between p-4">
          <div className="h-px bg-muted/60" />
          <div className="h-px bg-muted/60" />
          <div className="h-px bg-muted/60" />
          <div className="h-px bg-muted/60" />
        </div>

        {/* Fake area shape */}
        <div className="absolute inset-0 flex items-end p-4">
          <div className="w-full h-2/3 rounded-lg bg-muted/70" />
        </div>
      </div>
    </div>
  );
}
