import type { LucideIcon } from "lucide-react";
import { AlertCircle, Bell, Calendar, Link2, Zap } from "lucide-react";
import { useNavigate } from "react-router";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/utils/classnames";

const cardClasses = "h-full w-full border border-neutral-200 bg-white shadow-xs p-0 rounded-md overflow-hidden";

type AttentionItem = {
  id: string;
  kind: string;
  title: string;
  subtitle: string;
  taskId?: string | null;
  projectId?: string | null;
  notificationId?: string | null;
};

const KIND_META: Record<string, { icon: LucideIcon; className: string }> = {
  OVERDUE: { icon: AlertCircle, className: "text-rose-600" },
  DUE_TODAY: { icon: Calendar, className: "text-amber-600" },
  BLOCKED: { icon: Link2, className: "text-violet-600" },
  URGENT: { icon: Zap, className: "text-orange-600" },
  NOTIFICATION: { icon: Bell, className: "text-primary" },
};

type AttentionListProps = {
  items: AttentionItem[];
  className?: string;
};

export function AttentionList({ items, className }: AttentionListProps) {
  const navigate = useNavigate();

  const handleClick = (item: AttentionItem) => {
    if (item.taskId && item.projectId) {
      navigate(`/projects/${item.projectId}/tasks/${item.taskId}`);
    }
  };

  return (
    <Card className={cn(cardClasses, "h-full", className)}>
      <CardContent className="px-4 py-3 min-w-0 h-full flex flex-col">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-3">Needs your attention</p>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center flex-1">Nothing urgent right now.</p>
        ) : (
          <ul className="space-y-2 flex-1 min-h-0 max-h-[240px] overflow-y-auto">
            {items.map((item) => {
              const meta = KIND_META[item.kind] ?? KIND_META.NOTIFICATION;
              const Icon = meta.icon;
              const clickable = Boolean(item.taskId && item.projectId);

              return (
                <li key={item.id}>
                  <button
                    type="button"
                    disabled={!clickable}
                    onClick={() => handleClick(item)}
                    className={cn(
                      "flex w-full items-start gap-2.5 rounded-md px-2 py-2 text-left transition-colors",
                      clickable && "hover:bg-muted/60 cursor-pointer",
                      !clickable && "cursor-default",
                    )}
                  >
                    <Icon className={cn("size-4 shrink-0 mt-0.5", meta.className)} />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium truncate">{item.title}</span>
                      <span className="block text-xs text-muted-foreground truncate">{item.subtitle}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
