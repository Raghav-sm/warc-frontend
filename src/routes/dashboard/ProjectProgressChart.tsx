import { useNavigate } from "react-router";
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
] as const;

const chartConfig = {
  progressPercent: { label: "Progress", color: "var(--primary)" },
} satisfies ChartConfig;

const axisStyle = {
  axisLine: { stroke: "var(--border)" },
  tickLine: { stroke: "var(--border)" },
};

type ProjectCard = {
  id: string;
  name: string;
  progressPercent: number;
};

type ProjectProgressChartProps = {
  projects: ProjectCard[];
  className?: string;
};

export function ProjectProgressChart({ projects, className }: ProjectProgressChartProps) {
  const navigate = useNavigate();

  if (projects.length === 0) {
    return (
      <DashboardChartCard title="Project progress" className={className}>
        <p className="text-sm text-muted-foreground py-8 text-center">You are not on any projects yet.</p>
      </DashboardChartCard>
    );
  }

  const chartHeight = Math.max(240, projects.length * 68);
  const data = projects.map((project, index) => ({
    id: project.id,
    name: project.name.length > 28 ? `${project.name.slice(0, 26)}…` : project.name,
    fullName: project.name,
    progressPercent: project.progressPercent,
    fill: CHART_PALETTE[index % CHART_PALETTE.length],
  }));

  return (
    <DashboardChartCard title="Project progress" className={className}>
      <ChartContainer config={chartConfig} className="aspect-auto w-full min-w-0" style={{ height: chartHeight }}>
        <BarChart data={data} layout="vertical" margin={{ top: 8, right: 16, bottom: 8, left: 8 }} barCategoryGap="18%">
          <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis
            type="number"
            domain={[0, 100]}
            tick={{ fontSize: 11 }}
            tickFormatter={(value) => `${value}%`}
            ticks={[0, 25, 50, 75, 100]}
            label={{
              value: "Progress",
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
              value: "Project",
              angle: -90,
              position: "insideLeft",
              offset: 10,
              fontSize: 11,
              fill: "var(--muted-foreground)",
            }}
            {...axisStyle}
          />
          <ChartTooltip
            cursor={{ fill: "var(--muted)", opacity: 0.35 }}
            content={
              <ChartTooltipContent
                formatter={(value, _name, item) => {
                  const label = (item.payload as { fullName?: string }).fullName ?? item.name;
                  return [`${value}%`, label];
                }}
              />
            }
          />
          <Bar
            dataKey="progressPercent"
            radius={[0, 6, 6, 0]}
            maxBarSize={36}
            className="cursor-pointer"
            onClick={(bar) => {
              const payload = bar.payload as { id?: string };
              if (payload.id) navigate(`/projects/${payload.id}`);
            }}
          >
            {data.map((entry) => (
              <Cell key={entry.id} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
    </DashboardChartCard>
  );
}
