import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";

import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

import { DashboardChartCard } from "./DashboardChartCard";

const CHART_PALETTE = [
  "var(--primary)",
  "var(--chart-1)",
  "var(--chart-3)",
  "var(--chart-5)",
  "oklch(0.55 0.18 280)",
  "oklch(0.62 0.2 25)",
  "oklch(0.58 0.16 200)",
  "oklch(0.5 0.14 160)",
] as const;

const chartConfig = {
  openTaskCount: { label: "Open tasks", color: "var(--primary)" },
} satisfies ChartConfig;

const axisStyle = {
  axisLine: { stroke: "var(--border)" },
  tickLine: { stroke: "var(--border)" },
};

type WorkloadItem = {
  userId: string;
  userName: string;
  openTaskCount: number;
};

type TeamWorkloadChartProps = {
  items: WorkloadItem[];
};

export function TeamWorkloadChart({ items }: TeamWorkloadChartProps) {
  if (items.length === 0) {
    return (
      <DashboardChartCard title="Team workload">
        <p className="text-sm text-muted-foreground py-8 text-center">No open tasks on your projects.</p>
      </DashboardChartCard>
    );
  }

  const chartHeight = Math.max(220, items.length * 48);
  const data = items.map((item, index) => ({
    ...item,
    name: item.userName.length > 20 ? `${item.userName.slice(0, 18)}…` : item.userName,
    fill: CHART_PALETTE[index % CHART_PALETTE.length],
  }));

  return (
    <DashboardChartCard title="Team workload (open tasks)">
      <ChartContainer config={chartConfig} className="aspect-auto w-full min-w-0" style={{ height: chartHeight }}>
        <BarChart data={data} layout="vertical" margin={{ top: 8, right: 16, bottom: 8, left: 8 }} barCategoryGap="18%">
          <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis
            type="number"
            allowDecimals={false}
            tick={{ fontSize: 11 }}
            label={{
              value: "Open tasks",
              position: "insideBottom",
              offset: -4,
              fontSize: 11,
              fill: "var(--muted-foreground)",
            }}
            {...axisStyle}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={100}
            tick={{ fontSize: 12, fontWeight: 500 }}
            label={{
              value: "Assignee",
              angle: -90,
              position: "insideLeft",
              offset: 10,
              fontSize: 11,
              fill: "var(--muted-foreground)",
            }}
            {...axisStyle}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="openTaskCount" radius={[0, 6, 6, 0]} maxBarSize={28}>
            {data.map((entry) => (
              <Cell key={entry.userId} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
    </DashboardChartCard>
  );
}
