import type { ComponentType, ReactNode } from "react";
import { createBrowserRouter, RouterProvider } from "react-router";

import AppShell from "@/components/AppShell";
import NotFound from "@/components/NotFound";
import { PageLayoutProvider } from "@/components/PageLayoutContext";
import ProtectedRoute from "@/components/ProtectedRoute";

type LazyLoadedRouteProps = {
  src: string;
};

type RouteModule = {
  default: ComponentType;
};

function resolveRouteComponent(src: string): ComponentType {
  if (src === "@/components/NotFound") return NotFound;

  const modulePath = `${src}/index.tsx`;
  const routeModules = import.meta.glob<RouteModule>("./**/index.tsx", {
    eager: true,
  });
  const module = routeModules[modulePath];

  if (!module) {
    throw new Error(`Route module not found for src: ${src}`);
  }

  return module.default;
}

function LazyLoadedRoute({ src }: LazyLoadedRouteProps): ReactNode {
  const Component = resolveRouteComponent(src);
  return <Component />;
}

const protectedApp = (
  <ProtectedRoute>
    <PageLayoutProvider>
      <AppShell />
    </PageLayoutProvider>
  </ProtectedRoute>
);

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LazyLoadedRoute src="./auth/login" />,
  },
  {
    path: "/signup",
    element: <LazyLoadedRoute src="./auth/signup" />,
  },
  {
    element: protectedApp,
    children: [
      {
        index: true,
        element: <LazyLoadedRoute src="./dashboard" />,
      },
      {
        path: "user-management",
        children: [
          {
            path: "members",
            element: <LazyLoadedRoute src="./users-management/users" />,
          },
          {
            path: "roles",
            children: [
              {
                index: true,
                element: <LazyLoadedRoute src="./users-management/roles" />,
              },
              {
                path: ":id",
                element: <LazyLoadedRoute src="./users-management/roles/[id]" />,
              },
            ],
          },
        ],
      },
      {
        path: "projects",
        children: [
          {
            index: true,
            element: <LazyLoadedRoute src="./projects" />,
          },
          {
            path: ":id",
            children: [
              {
                index: true,
                element: <LazyLoadedRoute src="./projects/[id]" />,
              },
              {
                path: "tasks/:taskId",
                element: <LazyLoadedRoute src="./projects/[id]/tasks/[taskId]" />,
              },
            ],
          },
        ],
      },
      {
        path: "my-tasks",
        element: <LazyLoadedRoute src="./my-tasks" />,
      },
      {
        path: "search",
        element: <LazyLoadedRoute src="./search" />,
      },
      {
        path: "trash",
        element: <LazyLoadedRoute src="./trash" />,
      },
      {
        path: "settings",
        element: <LazyLoadedRoute src="./settings" />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

export default function AppRoutes() {
  return <RouterProvider router={router} />;
}
