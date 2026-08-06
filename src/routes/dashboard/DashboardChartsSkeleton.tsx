import { Skeleton } from "@/components/ui/skeleton";

import { DashboardChartCard } from "./DashboardChartCard";

export function DashboardChartsSkeleton() {
  return (
    <>
      <div className="grid gap-3 lg:grid-cols-3">
        <DashboardChartCard title="My task status" className="lg:col-span-1">
          <Skeleton className="h-[168px] w-full rounded-md" />
        </DashboardChartCard>
        <DashboardChartCard title="Project progress" className="lg:col-span-2">
          <Skeleton className="h-[220px] w-full rounded-md" />
        </DashboardChartCard>
      </div>
      <div className="grid gap-3 lg:grid-cols-3">
        <DashboardChartCard title="Tasks due (next 7 days)" className="lg:col-span-2">
          <Skeleton className="h-[240px] w-full rounded-md" />
        </DashboardChartCard>
        <Skeleton className="h-[240px] w-full rounded-md border border-neutral-200 lg:col-span-1" />
      </div>
    </>
  );
}
