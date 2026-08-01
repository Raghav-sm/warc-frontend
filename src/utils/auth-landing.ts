import type { AuthUser } from "@/components/AuthProvider";

export function resolveAuthLanding(user: AuthUser | null, redirectTo?: string | null): string {
  if (!user) return "/login";
  return redirectTo || "/";
}
