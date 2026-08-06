import { useNavigate } from "react-router";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/utils/classnames";

const cardClasses = "border border-neutral-200 bg-white shadow-xs p-0 rounded-md overflow-hidden";

type ProjectHealth = {
  projectId: string;
  projectName: string;
  openTaskCount: number;
  overdueCount: number;
  blockedCount: number;
  healthStatus: string;
};

const STATUS_LABEL: Record<string, { label: string; className: string }> = {
  ON_TRACK: { label: "On track", className: "text-emerald-600" },
  AT_RISK: { label: "At risk", className: "text-rose-600" },
  STALE: { label: "Stale", className: "text-amber-600" },
};

type ProjectHealthListProps = {
  items: ProjectHealth[];
};

export function ProjectHealthList({ items }: ProjectHealthListProps) {
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <Card className={cardClasses}>
        <CardContent className="px-4 py-3">
          <p className="text-sm text-muted-foreground py-4 text-center">No projects yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cardClasses}>
      <CardContent className="px-4 py-3 min-w-0">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-3">Project health</p>
        <ul className="space-y-2">
          {items.map((item) => {
            const status = STATUS_LABEL[item.healthStatus] ?? STATUS_LABEL.ON_TRACK;

            return (
              <li key={item.projectId}>
                <button
                  type="button"
                  onClick={() => navigate(`/projects/${item.projectId}`)}
                  className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left hover:bg-muted/60 transition-colors"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium truncate">{item.projectName}</span>
                    <span className="block text-xs text-muted-foreground">
                      {item.openTaskCount} open
                      {item.overdueCount > 0 ? ` · ${item.overdueCount} overdue` : ""}
                      {item.blockedCount > 0 ? ` · ${item.blockedCount} blocked` : ""}
                    </span>
                  </span>
                  <span className={cn("text-xs font-medium shrink-0", status.className)}>{status.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
