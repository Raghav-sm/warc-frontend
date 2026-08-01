import { Draggable, type DraggableProvidedDragHandleProps, Droppable } from "@hello-pangea/dnd";
import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/classnames";

export type KanbanColumnConfig = {
  id: string;
  title: string;
};

type KanbanColumnProps<TItem extends { id: string }> = {
  column: KanbanColumnConfig;
  items: TItem[];
  renderCard: (
    item: TItem,
    index: number,
    dragHandleProps: DraggableProvidedDragHandleProps | null | undefined,
    isDragging: boolean,
  ) => ReactNode;
  className?: string;
};

export function KanbanColumn<TItem extends { id: string }>({
  column,
  items,
  renderCard,
  className,
}: KanbanColumnProps<TItem>) {
  return (
    <section
      className={cn(
        "flex min-h-[24rem] min-w-0 flex-col overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50/50 shadow-xs",
        className,
      )}
    >
      <header className="flex items-center justify-between gap-2 border-b border-neutral-200 bg-white px-4 py-3">
        <h3 className="truncate text-sm font-medium text-foreground">{column.title}</h3>
        <Badge variant="secondary" className="h-5 min-w-5 justify-center px-1.5 tabular-nums font-normal">
          {items.length}
        </Badge>
      </header>

      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              "flex min-h-[20rem] flex-1 flex-col gap-3 p-3 transition-colors",
              snapshot.isDraggingOver && "bg-primary/[0.03]",
            )}
          >
            {items.length === 0 && !snapshot.isDraggingOver ? (
              <div className="flex flex-1 items-center justify-center rounded-md border border-dashed border-neutral-200/80 bg-white/60 px-3 py-10">
                <p className="text-xs text-muted-foreground">No tasks in this column</p>
              </div>
            ) : null}

            {items.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(dragProvided, dragSnapshot) => (
                  <div
                    ref={dragProvided.innerRef}
                    {...dragProvided.draggableProps}
                    className={cn(dragSnapshot.isDragging && "z-10")}
                  >
                    {renderCard(item, index, dragProvided.dragHandleProps, dragSnapshot.isDragging)}
                  </div>
                )}
              </Draggable>
            ))}

            {snapshot.isDraggingOver && items.length === 0 ? (
              <div className="flex flex-1 items-center justify-center rounded-md border border-dashed border-primary/30 bg-primary/[0.04] px-3 py-10">
                <p className="text-xs text-primary/70">Drop here</p>
              </div>
            ) : null}

            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </section>
  );
}
