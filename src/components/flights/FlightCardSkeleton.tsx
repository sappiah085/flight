import { Skeleton } from "@/components/ui/skeleton";

export function FlightCardSkeleton() {
  return (
    <div className="flight-card">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
        {/* Airline Info */}
        <div className="flex items-center gap-3 lg:w-36">
          <Skeleton className="w-11 h-11 bg-accent rounded-none" />
          <Skeleton className="h-4 w-20 bg-accent" />
        </div>

        {/* Time & Route */}
        <div className="flex-1 flex items-center gap-4">
          <div className="space-y-2 min-w-[60px]">
            <Skeleton className="h-5 w-14 bg-accent" />
            <Skeleton className="h-3 w-10 bg-accent" />
          </div>

          <div className="flex-1 flex flex-col items-center gap-2 px-4">
            <Skeleton className="h-3 w-16 bg-accent" />
            <div className="w-full flex items-center gap-1.5">
              <Skeleton className="w-2 h-2 rounded-full bg-accent" />
              <Skeleton className="h-0.5 flex-1 bg-accent" />
              <Skeleton className="w-4 h-4 rounded bg-accent" />
            </div>
            <Skeleton className="h-3 w-12 bg-accent" />
          </div>

          <div className="space-y-2 text-right min-w-[60px]">
            <Skeleton className="h-5 w-14 ml-auto bg-accent" />
            <Skeleton className="h-3 w-10 ml-auto bg-accent" />
          </div>
        </div>

        {/* Price & CTA */}

        <div className="space-y-2 lg:text-right">
          <Skeleton className="h-7 w-20 bg-accent" />
          <Skeleton className="h-3 w-14 bg-accent" />
        </div>
      </div>
    </div>
  );
}
