import dayjs from "dayjs";
import { Calendar, CheckSquare, Clock, UserCheck, Users } from "lucide-react";

import { entityCardClasses } from "@/components/EntityCard";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/utils/classnames";

export type ProjectDisplayType = {
  id: string;
  name: string;
  description?: string | null;
  status: string;
  progressPercent: number;
  memberCount: number;
  taskCount: number;
  ownerName?: string | null;
  myRoleName?: string | null;
  myRoleCode?: string | null;
  createdAt: string;
  updatedAt: string;
};

type ProjectCardProps = {
  project: ProjectDisplayType;
  onClick: () => void;
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function getStatusBadgeStyle(status: string) {
  switch (status.toUpperCase()) {
    case "ACTIVE":
      return "bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/80";
    case "ON_HOLD":
      return "bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/80";
    case "COMPLETED":
      return "bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800/80";
    case "ARCHIVED":
      return "bg-neutral-100 text-neutral-600 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700";
    default:
      return "bg-neutral-100 text-neutral-700 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700";
  }
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const initials = getInitials(project.name);
  const statusStyle = getStatusBadgeStyle(project.status);

  return (
    <Card
      className={cn(entityCardClasses, "cursor-pointer group flex flex-col justify-between")}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      role="button"
      tabIndex={0}
    >
      <CardContent className="p-4 flex flex-col justify-between h-full gap-3">
        <div className="space-y-2.5">
          {/* Header Row: Initials Avatar + Badges (Spacious layout preventing text/badge collisions) */}
          <div className="flex items-center justify-between gap-2">
            <div className="h-8 w-8 shrink-0 rounded-md bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold text-xs">
              {initials}
            </div>

            <div className="flex items-center gap-1.5 flex-wrap justify-end">
              <span className={cn("px-2 py-0.5 rounded-md text-[11px] font-medium border capitalize", statusStyle)}>
                {project.status.toLowerCase().replace("_", " ")}
              </span>
              {project.myRoleName ? (
                <span className="px-2 py-0.5 rounded-md text-[11px] font-medium border bg-neutral-100 text-neutral-700 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700">
                  {project.myRoleName}
                </span>
              ) : null}
            </div>
          </div>

          {/* Project Title (Dedicated full-width row for long names) */}
          <div>
            <h3 className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 group-hover:text-primary transition-colors line-clamp-1">
              {project.name}
            </h3>
          </div>

          {/* Description */}
          {project.description ? (
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{project.description}</p>
          ) : (
            <p className="text-xs text-muted-foreground italic">No description provided</p>
          )}

          {/* Manager Info Row */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-neutral-50 dark:bg-neutral-800/60 px-2.5 py-1.5 rounded-md border border-neutral-100 dark:border-neutral-800">
            <UserCheck className="size-3.5 shrink-0 text-primary" />
            <span className="truncate">
              Manager: <strong className="font-medium text-foreground">{project.ownerName || "Unassigned"}</strong>
            </span>
          </div>

          {/* Progress Section */}
          <div className="space-y-1 pt-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground font-medium">Progress</span>
              <span className="font-semibold text-foreground">{project.progressPercent}%</span>
            </div>
            <div className="h-1.5 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300 rounded-full"
                style={{ width: `${Math.min(100, Math.max(0, project.progressPercent))}%` }}
              />
            </div>
          </div>

          {/* Metrics Row */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5 font-medium">
              <CheckSquare className="size-3.5 text-primary shrink-0" />
              <span>
                {project.taskCount} {project.taskCount === 1 ? "task" : "tasks"}
              </span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <Users className="size-3.5 text-primary shrink-0" />
              <span>
                {project.memberCount} {project.memberCount === 1 ? "member" : "members"}
              </span>
            </div>
          </div>
        </div>

        {/* Timestamps Footer */}
        <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="size-3 shrink-0" />
            <span>Created {dayjs(project.createdAt).format("MMM D, YYYY")}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="size-3 shrink-0" />
            <span>Updated {dayjs(project.updatedAt).format("MMM D, YYYY")}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
