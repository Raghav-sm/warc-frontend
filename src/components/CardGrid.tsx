import type { ReactNode } from "react";

import { Skeleton } from "@/components/ui/skeleton";

type CardGridProps = {
  loading?: boolean;
  empty?: boolean;
  skeletonCount?: number;
  children?: ReactNode;
};

export function CardGrid({ loading, empty, skeletonCount = 4, children }: CardGridProps) {
  if (!loading && empty) return null;

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {loading
        ? Array.from({ length: skeletonCount }, (_, index) => (
            <Skeleton key={`card-skeleton-${index}`} className="h-28 rounded-md border border-neutral-200 shadow-xs" />
          ))
        : children}
    </div>
  );
}

export function CardGridSkeleton({ count = 4 }: { count?: number }) {
  return <CardGrid loading skeletonCount={count} />;
}
