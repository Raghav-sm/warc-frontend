import { UserRound } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { cn } from "@/utils/classnames";

export type UserAvatarInfo = {
  fullName?: string | null;
  avatar?: string | null;
};

export function getUserDisplayName(user?: UserAvatarInfo | null): string {
  return user?.fullName ?? "—";
}

type UserAvatarProps = {
  user?: UserAvatarInfo | null;
  subtitle?: string | null;
  size?: "sm" | "md";
  muted?: boolean;
};

export default function UserAvatar({ user, subtitle, size = "md", muted = false }: UserAvatarProps) {
  const name = getUserDisplayName(user);
  const avatarSize = size === "sm" ? "size-6" : "size-8";
  const iconSize = size === "sm" ? "size-3.5" : "size-4";

  return (
    <div className="flex min-w-0 items-center gap-2">
      <Avatar className={avatarSize}>
        {user?.avatar ? <AvatarImage src={user.avatar} alt={name} /> : null}
        <AvatarFallback className="bg-neutral-100 text-neutral-500">
          <UserRound className={iconSize} />
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <div className={cn("truncate text-sm font-medium", muted && "text-muted-foreground")}>{name}</div>
        {subtitle && <div className="truncate text-xs text-muted-foreground">{subtitle}</div>}
      </div>
    </div>
  );
}
