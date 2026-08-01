import type { ComponentType, ReactNode } from "react";
import { createBrowserRouter, RouterProvider } from "react-router";

import NotFound from "@/components/NotFound";
import ProtectedRoute from "@/components/ProtectedRoute";

type LazyLoadedRouteProps = {
  src: string;
  isProtected?: boolean;
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

function LazyLoadedRoute({ src, isProtected = false }: LazyLoadedRouteProps): ReactNode {
  const Component = resolveRouteComponent(src);
  const routeElement = <Component />;

  if (isProtected) return <ProtectedRoute>{routeElement}</ProtectedRoute>;
  return routeElement;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <LazyLoadedRoute src="./dashboard" isProtected />,
  },
  {
    path: "/login",
    element: <LazyLoadedRoute src="./auth/login" />,
  },
  {
    path: "/signup",
    element: <LazyLoadedRoute src="./auth/signup" />,
  },
  {
    path: "/user-management",
    children: [
      {
        path: "members",
        element: <LazyLoadedRoute src="./users-management/users" isProtected />,
      },
      {
        path: "roles",
        children: [
          {
            index: true,
            element: <LazyLoadedRoute src="./users-management/roles" isProtected />,
          },
          {
            path: ":id",
            element: <LazyLoadedRoute src="./users-management/roles/[id]" isProtected />,
          },
        ],
      },
    ],
  },
  {
    path: "/projects",
    children: [
      {
        index: true,
        element: <LazyLoadedRoute src="./projects" isProtected />,
      },
      {
        path: ":id",
        element: <LazyLoadedRoute src="./projects/[id]" isProtected />,
      },
    ],
  },
  {
    path: "/settings",
    element: <LazyLoadedRoute src="./settings" isProtected />,
  },
  {
    path: "*",
    element: <LazyLoadedRoute src="@/components/NotFound" />,
  },
]);

export default function AppRoutes() {
  return <RouterProvider router={router} />;
}
