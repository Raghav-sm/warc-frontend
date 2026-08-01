import type { JSX, PropsWithChildren } from "react";
import { Navigate } from "react-router";

import { useAuth } from "./AuthProvider";

type ProtectedRouteProps = PropsWithChildren<{
  redirectTo?: string;
}>;

export default function ProtectedRoute({ children, redirectTo = "/login" }: ProtectedRouteProps): JSX.Element {
  const { isAuthenticated, initializing } = useAuth();
  if (!isAuthenticated) return <Navigate to={redirectTo} replace />;
  if (initializing) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="size-6 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
      </div>
    );
  }
  return <>{children}</>;
}
