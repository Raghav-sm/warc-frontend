import dayjs from "dayjs";
import { useNavigate } from "react-router";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/utils/classnames";

const cardClasses = "border border-neutral-200 bg-white shadow-xs p-0 rounded-md overflow-hidden";

type ActivityItem = {
  id: string;
  type: string;
  message: string;
  entityType: string;
  entityId: string;
  isRead: boolean;
  createdAt: string;
  projectId?: string | null;
  projectName?: string | null;
};

type RecentActivityListProps = {
  items: ActivityItem[];
};

export function RecentActivityList({ items }: RecentActivityListProps) {
  const navigate = useNavigate();

  const handleClick = (item: ActivityItem) => {
    if (item.entityType === "TASK" && item.projectId) {
      navigate(`/projects/${item.projectId}/tasks/${item.entityId}`);
    }
  };

  if (items.length === 0) {
    return (
      <Card className={cardClasses}>
        <CardContent className="px-4 py-3">
          <p className="text-sm text-muted-foreground py-4 text-center">No recent activity yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cardClasses}>
      <CardContent className="px-4 py-3 min-w-0 divide-y divide-border">
        {items.map((item) => {
          const clickable = item.entityType === "TASK" && item.projectId;

          return (
            <button
              key={item.id}
              type="button"
              disabled={!clickable}
              onClick={() => handleClick(item)}
              className={cn(
                "flex w-full items-start justify-between gap-3 py-2.5 text-left first:pt-0 last:pb-0",
                clickable && "hover:opacity-80 cursor-pointer",
                !clickable && "cursor-default",
              )}
            >
              <span className="min-w-0 flex-1">
                <span
                  className={cn(
                    "block text-sm truncate",
                    item.isRead ? "text-muted-foreground" : "font-medium text-foreground",
                  )}
                >
                  {item.message}
                </span>
                {item.projectName ? (
                  <span className="block text-xs text-muted-foreground truncate">{item.projectName}</span>
                ) : null}
              </span>
              <span className="text-xs text-muted-foreground shrink-0 tabular-nums">
                {dayjs(item.createdAt).format("MMM D, h:mm A")}
              </span>
            </button>
          );
        })}
      </CardContent>
    </Card>
  );
}
