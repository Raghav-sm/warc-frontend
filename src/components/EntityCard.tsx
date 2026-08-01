import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/utils/classnames";

export const entityCardClasses =
  "h-full w-full border border-neutral-200 bg-white shadow-xs p-0 rounded-md transition-colors hover:border-neutral-300 hover:shadow-sm";

type EntityCardProps = {
  title: string;
  subtitle?: string | null;
  icon?: LucideIcon;
  iconClassName?: string;
  footer?: ReactNode;
  onClick?: () => void;
  className?: string;
};

export function EntityCard({ title, subtitle, icon: Icon, iconClassName, footer, onClick, className }: EntityCardProps) {
  const interactive = Boolean(onClick);

  return (
    <Card
      className={cn(entityCardClasses, interactive && "cursor-pointer", className)}
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
      <CardContent className="px-4 py-3 flex flex-col gap-2 h-full">
        <div className="flex items-start gap-2">
          {Icon ? (
            <div className={cn("text-primary shrink-0 pt-0.5", iconClassName)}>
              <Icon className="size-4" />
            </div>
          ) : null}
          <div className="min-w-0 flex-1">
            <div className="font-medium truncate">{title}</div>
            {subtitle ? <div className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{subtitle}</div> : null}
          </div>
        </div>
        {footer ? <div className="mt-auto pt-1">{footer}</div> : null}
      </CardContent>
    </Card>
  );
}
