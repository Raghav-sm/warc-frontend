import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/classnames";
import { formatStatus } from "@/utils/format-status";

export type TaskPriorityValue = "LOW" | "MEDIUM" | "HIGH" | "URGENT" | string;

const PRIORITY_STYLES: Record<string, string> = {
  LOW: "bg-neutral-100 text-neutral-600",
  MEDIUM: "bg-sky-50 text-sky-700",
  HIGH: "bg-amber-50 text-amber-800",
  URGENT: "bg-rose-50 text-rose-700",
};

type PriorityBadgeProps = {
  priority: TaskPriorityValue;
  className?: string;
};

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const key = priority?.toUpperCase?.() ?? priority;
  return (
    <Badge variant="outline" className={cn("font-normal", PRIORITY_STYLES[key], className)}>
      {formatStatus(key.toLowerCase())}
    </Badge>
  );
}
