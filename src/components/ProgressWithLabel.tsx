import { Progress } from "@/components/ui/progress";
import { cn } from "@/utils/classnames";

type ProgressWithLabelProps = {
  value: number;
  className?: string;
  labelClassName?: string;
};

export function ProgressWithLabel({ value, className, labelClassName }: ProgressWithLabelProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Progress value={clamped} className="flex-1 h-1.5" />
      <span className={cn("text-xs tabular-nums text-muted-foreground shrink-0 w-9 text-right", labelClassName)}>
        {clamped}%
      </span>
    </div>
  );
}
