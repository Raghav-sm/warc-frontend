import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/classnames";

export type TaskStatusValue = "TODO" | "IN_PROGRESS" | "DONE" | string;

const STATUS_STYLES: Record<string, string> = {
  TODO: "bg-neutral-100 text-neutral-700",
  IN_PROGRESS: "bg-blue-50 text-blue-700",
  DONE: "bg-emerald-50 text-emerald-700",
};

const STATUS_LABELS: Record<string, string> = {
  TODO: "To do",
  IN_PROGRESS: "In progress",
  DONE: "Done",
};

type StatusBadgeProps = {
  status: TaskStatusValue;
  className?: string;
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const key = (status ?? "").toUpperCase();
  return (
    <Badge variant="secondary" className={cn("font-normal border-0", STATUS_STYLES[key], className)}>
      {STATUS_LABELS[key] ?? key}
    </Badge>
  );
}
