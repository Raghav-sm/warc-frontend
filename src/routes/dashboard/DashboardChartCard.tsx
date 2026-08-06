import type { ReactNode } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/utils/classnames";

const cardClasses = "h-full w-full border border-neutral-200 bg-white shadow-xs p-0 rounded-md overflow-hidden";

type DashboardChartCardProps = {
  title: string;
  children: ReactNode;
  className?: string;
};

export function DashboardChartCard({ title, children, className }: DashboardChartCardProps) {
  return (
    <Card className={cn(cardClasses, className)}>
      <CardContent className="px-4 py-3 min-w-0">
        <h3 className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-3">{title}</h3>
        <div className="min-w-0 overflow-hidden">{children}</div>
      </CardContent>
    </Card>
  );
}
