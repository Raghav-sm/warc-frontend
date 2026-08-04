import type { DraggableProvidedDragHandleProps } from "@hello-pangea/dnd";
import { GripVertical } from "lucide-react";

import { type AssigneeInfo, AssigneeStack } from "@/components/AssigneeStack";
import { PriorityBadge } from "@/components/PriorityBadge";
import { ProgressWithLabel } from "@/components/ProgressWithLabel";
import { cn } from "@/utils/classnames";

type KanbanTaskCardProps = {
  title: string;
  priority: string;
  progress: number;
  weight?: number;
  assignees: AssigneeInfo[];
  isBlocked?: boolean;
  onClick?: () => void;
  dragHandleProps?: DraggableProvidedDragHandleProps | null;
  isDragging?: boolean;
  className?: string;
};

export function KanbanTaskCard({
  title,
  priority,
  progress,
  weight,
  assignees,
  isBlocked,
  onClick,
  dragHandleProps,
  isDragging,
  className,
}: KanbanTaskCardProps) {
  const interactive = Boolean(onClick);

  return (
    <article
      className={cn(
        "group overflow-hidden rounded-md border border-neutral-200 bg-white shadow-xs transition-[box-shadow,border-color,transform]",
        dragHandleProps ? "flex" : "block",
        interactive && "cursor-pointer hover:border-neutral-300 hover:shadow-sm",
        isDragging && "border-primary/30 shadow-md ring-2 ring-primary/15 rotate-[0.5deg]",
        className,
      )}
      onClick={onClick}
      onKeyDown={
        interactive
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
    >
      {dragHandleProps ? (
        <div
          {...dragHandleProps}
          className="flex shrink-0 touch-none items-start justify-center border-r border-neutral-100 bg-neutral-50/80 px-1 py-3 text-muted-foreground/50 transition-colors cursor-grab active:cursor-grabbing hover:bg-neutral-100 hover:text-muted-foreground"
          onClick={(event) => event.stopPropagation()}
        >
          <GripVertical className="size-4" aria-hidden />
        </div>
      ) : null}

      <div className={cn("min-w-0 flex-1 space-y-2.5", dragHandleProps ? "px-3 py-2.5" : "p-3 space-y-2.5")}>
        <div className="space-y-1.5">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-medium leading-snug text-foreground line-clamp-2">{title}</h4>
            <div className="flex shrink-0 flex-col items-end gap-1">
              <PriorityBadge priority={priority} className="text-[10px] px-1.5 py-0" />
              {isBlocked ? (
                <span className="rounded border border-primary/20 bg-primary/5 px-1.5 py-0 text-[10px] font-medium text-primary">
                  Blocked
                </span>
              ) : null}
            </div>
          </div>
          <ProgressWithLabel value={progress} />
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-neutral-100 pt-2">
          <AssigneeStack assignees={assignees} max={2} />
          {weight != null ? <span className="text-[11px] tabular-nums text-muted-foreground">{weight}% weight</span> : null}
        </div>
      </div>
    </article>
  );
}
