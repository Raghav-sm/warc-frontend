import { type LucideIcon, Users } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const cardClasses = "h-full w-full border border-neutral-200 bg-white shadow-xs p-0 rounded-md";

export type KpiTone = "blue" | "emerald" | "amber" | "violet" | "orange" | "indigo" | "rose";

const TONE_ICON_WRAP: Record<KpiTone, string> = {
  blue: "text-primary",
  emerald: "text-emerald-600",
  amber: "text-amber-600",
  violet: "text-violet-600",
  orange: "text-orange-600",
  indigo: "text-indigo-600",
  rose: "text-primary",
};

const KPI_ICONS: Record<string, LucideIcon> = {
  "users-total": Users,
  "users-active": Users,
  "roles-total": Users,
  "users-inactive": Users,
};

export type KpiData = {
  key: string;
  title: string;
  subtitle?: string | null;
  value: string;
  tone: string;
};

export function KpiCard({ kpi }: { kpi: KpiData }) {
  const tone = (kpi.tone in TONE_ICON_WRAP ? kpi.tone : "rose") as KpiTone;
  const Icon = KPI_ICONS[kpi.key] ?? Users;

  return (
    <Card className={cardClasses}>
      <CardContent className="px-4 py-3">
        <div className="flex items-center gap-2 mb-2">
          <div className={TONE_ICON_WRAP[tone]}>
            <Icon className="size-4" />
          </div>
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{kpi.title}</span>
        </div>
        <div className="text-2xl font-semibold tracking-tight">{kpi.value}</div>
        <div className="text-xs text-muted-foreground mt-0.5">{kpi.subtitle}</div>
      </CardContent>
    </Card>
  );
}

type KpiGridProps = {
  loading: boolean;
  kpis?: KpiData[];
};

export function KpiGrid({ loading, kpis = [] }: KpiGridProps) {
  if (!loading && kpis.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {loading
        ? (["kpi1", "kpi2", "kpi3", "kpi4"] as const).map((id) => (
            <Skeleton key={id} className="h-25 rounded-md border border-neutral-200 shadow-xs" />
          ))
        : kpis.map((kpi) => <KpiCard key={kpi.key} kpi={kpi} />)}
    </div>
  );
}
