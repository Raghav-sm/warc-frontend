import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";
import type { ChartConfig } from "@/components/ui/chart";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";

import { DashboardChartCard } from "./DashboardChartCard";

const CHART_PALETTE = [
  "var(--chart-1)",
  "var(--primary)",
  "var(--chart-3)",
  "var(--chart-5)",
  "oklch(0.55 0.18 280)",
  "oklch(0.62 0.2 25)",
  "oklch(0.58 0.16 200)",
] as const;

const chartConfig = {
  count: { label: "Tasks due", color: "var(--chart-1)" },
} satisfies ChartConfig;

type DueTask = {
  id: string;
  title: string;
  projectId: string;
  projectName: string;
};

type TasksDueDay = {
  date: string;
  label: string;
  count: number;
  tasks: DueTask[];
};

type TasksDueChartProps = {
  days: TasksDueDay[];
  className?: string;
};

const axisStyle = {
  axisLine: { stroke: "var(--border)" },
  tickLine: { stroke: "var(--border)" },
};

function TasksDueTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: TasksDueDay & { fill?: string } }>;
}) {
  if (!active || !payload?.length) return null;

  const day = payload[0].payload;

  return (
    <div className="grid min-w-48 gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-2 text-xs shadow-xl">
      <p className="font-medium">
        {day.label} · {day.count} task{day.count === 1 ? "" : "s"}
      </p>
      {day.tasks.length === 0 ? (
        <p className="text-muted-foreground">No tasks due</p>
      ) : (
        <ul className="grid gap-1.5">
          {day.tasks.map((task) => (
            <li key={task.id} className="leading-snug">
              <span className="font-medium text-foreground">{task.title}</span>
              <span className="text-muted-foreground"> · {task.projectName}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function TasksDueChart({ days, className }: TasksDueChartProps) {
  const data = days.map((day, index) => ({
    ...day,
    fill: CHART_PALETTE[index % CHART_PALETTE.length],
  }));

  return (
    <DashboardChartCard title="Tasks due (next 7 days)" className={className}>
      <ChartContainer config={chartConfig} className="aspect-auto h-[240px] w-full min-w-0">
        <BarChart data={data} margin={{ top: 8, right: 12, bottom: 8, left: 4 }} barCategoryGap="22%">
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11 }}
            label={{ value: "Day", position: "insideBottom", offset: -4, fontSize: 11, fill: "var(--muted-foreground)" }}
            {...axisStyle}
          />
          <YAxis
            allowDecimals={false}
            width={32}
            tick={{ fontSize: 11 }}
            label={{
              value: "Tasks",
              angle: -90,
              position: "insideLeft",
              offset: 10,
              fontSize: 11,
              fill: "var(--muted-foreground)",
            }}
            {...axisStyle}
          />
          <ChartTooltip content={<TasksDueTooltip />} />
          <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={40}>
            {data.map((entry) => (
              <Cell key={entry.date} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
    </DashboardChartCard>
  );
}
