import { DragDropContext, type DraggableProvidedDragHandleProps, type DropResult } from "@hello-pangea/dnd";
import type { ReactNode } from "react";

import { KanbanColumn, type KanbanColumnConfig } from "@/components/KanbanColumn";
import { cn } from "@/utils/classnames";

type KanbanBoardProps<TItem extends { id: string; status: string }> = {
  columns: KanbanColumnConfig[];
  items: TItem[];
  onDragEnd: (result: DropResult, item: TItem | undefined) => void;
  renderCard: (
    item: TItem,
    dragHandleProps: DraggableProvidedDragHandleProps | null | undefined,
    isDragging: boolean,
  ) => ReactNode;
  className?: string;
};

export function KanbanBoard<TItem extends { id: string; status: string }>({
  columns,
  items,
  onDragEnd,
  renderCard,
  className,
}: KanbanBoardProps<TItem>) {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const item = items.find((entry) => entry.id === result.draggableId);
    onDragEnd(result, item);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className={cn("w-full", className)}>
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              items={items.filter((item) => item.status === column.id)}
              renderCard={(item, _index, dragHandleProps, isDragging) => renderCard(item, dragHandleProps, isDragging)}
            />
          ))}
        </div>
      </div>
    </DragDropContext>
  );
}

export const KANBAN_COLUMNS: KanbanColumnConfig[] = [
  { id: "TODO", title: "To do" },
  { id: "IN_PROGRESS", title: "In progress" },
  { id: "DONE", title: "Done" },
];
