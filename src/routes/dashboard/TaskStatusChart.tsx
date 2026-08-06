import { Cell, Label, Pie, PieChart } from "recharts";

import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

import { DashboardChartCard } from "./DashboardChartCard";

const chartConfig = {
  TODO: { label: "To do", color: "var(--chart-3)" },
  IN_PROGRESS: { label: "In progress", color: "var(--primary)" },
  DONE: { label: "Done", color: "var(--chart-1)" },
} satisfies ChartConfig;

type StatusBreakdown = {
  status: string;
  count: number;
};

type TaskStatusChartProps = {
  breakdown: StatusBreakdown[];
  className?: string;
};

export function TaskStatusChart({ breakdown, className }: TaskStatusChartProps) {
  const data = breakdown.filter((item) => item.count > 0);
  const total = breakdown.reduce((sum, item) => sum + item.count, 0);

  if (total === 0) {
    return (
      <DashboardChartCard title="My task status" className={className}>
        <p className="text-sm text-muted-foreground py-8 text-center">No assigned tasks yet.</p>
      </DashboardChartCard>
    );
  }

  return (
    <DashboardChartCard title="My task status" className={className}>
      <ChartContainer config={chartConfig} className="mx-auto aspect-square h-[200px] w-full max-w-[200px] min-w-0">
        <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          <Pie
            data={data}
            dataKey="count"
            nameKey="status"
            innerRadius={52}
            outerRadius={76}
            strokeWidth={2}
            paddingAngle={3}
          >
            {data.map((entry) => (
              <Cell key={entry.status} fill={`var(--color-${entry.status})`} stroke="var(--background)" />
            ))}
            <Label
              content={({ viewBox }) => {
                if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox)) return null;
                const cx = viewBox.cx as number;
                const cy = viewBox.cy as number;

                return (
                  <>
                    <text
                      x={cx}
                      y={cy - 4}
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="fill-foreground text-2xl font-semibold"
                    >
                      {total}
                    </text>
                    <text
                      x={cx}
                      y={cy + 14}
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="fill-muted-foreground text-[11px]"
                    >
                      tasks
                    </text>
                  </>
                );
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
    </DashboardChartCard>
  );
}
