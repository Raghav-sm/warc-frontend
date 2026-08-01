import UserAvatar, { type UserAvatarInfo } from "@/components/UserAvatar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/utils/classnames";

export type AssigneeInfo = UserAvatarInfo & {
  id?: string;
};

type AssigneeStackProps = {
  assignees: AssigneeInfo[];
  max?: number;
  size?: "sm" | "md";
  className?: string;
};

export function AssigneeStack({ assignees, max = 3, size = "sm", className }: AssigneeStackProps) {
  if (assignees.length === 0) {
    return <span className="text-xs text-muted-foreground">Unassigned</span>;
  }

  if (assignees.length === 1) {
    return <UserAvatar user={assignees[0]} size={size} />;
  }

  const visible = assignees.slice(0, max);
  const overflow = assignees.length - visible.length;
  const avatarSize = size === "sm" ? "size-6" : "size-8";

  return (
    <div className={cn("flex items-center -space-x-2", className)}>
      {visible.map((assignee, index) => (
        <Avatar key={assignee.id ?? `${assignee.fullName}-${index}`} className={cn(avatarSize, "border-2 border-white")}>
          {assignee.avatar ? <AvatarImage src={assignee.avatar} alt={assignee.fullName ?? ""} /> : null}
          <AvatarFallback className="bg-neutral-100 text-[10px] text-neutral-600">
            {(assignee.fullName ?? "?").slice(0, 1).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      ))}
      {overflow > 0 ? <span className="pl-3 text-xs text-muted-foreground">+{overflow}</span> : null}
    </div>
  );
}
