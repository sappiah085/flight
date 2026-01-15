import React from "react";
import { Skeleton } from "../ui/skeleton";

function FilterSkeleton() {
  return (
    <div className="space-y-2.5">
      {new Array(5).fill(0).map((_, index) => (
        <div key={index} className="flex gap-5 items-center">
          <Skeleton className="h-5 w-5 shrink-0 rounded-full bg-primary/20" />
          <Skeleton className="h-6 w-full bg-muted" />
        </div>
      ))}
    </div>
  );
}

export default FilterSkeleton;
