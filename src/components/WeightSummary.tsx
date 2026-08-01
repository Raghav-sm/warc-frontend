import { cn } from "@/utils/classnames";

export function remainingWeightPercent(weights: number[]): number {
  return 100 - weights.reduce((sum, weight) => sum + weight, 0);
}

type WeightSummaryProps = {
  weights: number[];
  label?: string;
  className?: string;
};

export function WeightSummary({ weights, label = "Remaining weight", className }: WeightSummaryProps) {
  const remaining = remainingWeightPercent(weights);
  const tone = remaining === 0 ? "text-emerald-600" : remaining < 0 ? "text-destructive" : "text-muted-foreground";

  return (
    <p className={cn("text-sm", tone, className)}>
      {label}: <span className="font-medium tabular-nums">{remaining}%</span>
    </p>
  );
}
