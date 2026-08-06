import { ChevronRight, FolderKanban, Home, ListTodo, LogOut, PersonStanding, Search, Settings, Trash2 } from "lucide-react";
import type { ReactNode } from "react";
import { NavLink, useLocation } from "react-router";

import { useAuth } from "@/components/AuthProvider";
import { BrandLogo } from "@/components/BrandLogo";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";

import { useLogout } from "@/hooks/useLogout";

interface SidebarLinkItem {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  url: string;
  activePatterns?: RegExp[];
}

interface SidebarGroupItem {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  items: SidebarLinkItem[];
}

type SidebarItem = SidebarLinkItem | SidebarGroupItem;

const ITEMS: SidebarItem[] = [
  {
    title: "Search",
    url: "/search",
    icon: <Search className="h-4 w-4" />,
  },
  {
    title: "Dashboard",
    url: "/",
    icon: <Home className="h-4 w-4" />,
  },
  {
    title: "Projects",
    url: "/projects",
    icon: <FolderKanban className="h-4 w-4" />,
    activePatterns: [/^\/projects(\/|$)/],
  },
  {
    title: "My Tasks",
    url: "/my-tasks",
    icon: <ListTodo className="h-4 w-4" />,
  },
  {
    title: "Trash",
    url: "/trash",
    icon: <Trash2 className="h-4 w-4" />,
  },
  {
    title: "User Management",
    icon: <PersonStanding className="h-4 w-4" />,
    items: [
      {
        title: "Users",
        url: "/user-management/members",
      },
      {
        title: "Roles",
        url: "/user-management/roles",
      },
    ],
  },
  {
    title: "Settings",
    url: "/settings",
    icon: <Settings className="h-4 w-4" />,
  },
];

function hasChildSidebarPath(navUrl: string): boolean {
  if (navUrl === "/") return false;
  const prefix = navUrl.endsWith("/") ? navUrl : `${navUrl}/`;
  for (const entry of ITEMS) {
    if ("items" in entry) {
      for (const sub of entry.items) {
        if (sub.url !== navUrl && sub.url.startsWith(prefix)) return true;
      }
    } else if ("url" in entry && entry.url !== navUrl && entry.url.startsWith(prefix)) {
      return true;
    }
  }
  return false;
}

function isSidebarPathActive(pathname: string, url: string, activePatterns?: RegExp[]): boolean {
  const normalizedPathname = pathname.replace(/\/$/, "") || "/";
  const normalizedNavUrl = url.replace(/\/$/, "") || "/";

  if (normalizedPathname === normalizedNavUrl) return true;
  if (activePatterns?.some((pattern) => pattern.test(normalizedPathname))) return true;
  if (url === "/" || hasChildSidebarPath(url)) return false;

  const prefix = url.endsWith("/") ? url : `${url}/`;
  return pathname.startsWith(prefix);
}

function navLinkEnd(navUrl: string): boolean {
  return navUrl === "/" || hasChildSidebarPath(navUrl);
}

export function AppSidebar() {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const { handleLogout } = useLogout();

  const isGroup = (item: SidebarItem): item is SidebarGroupItem => "items" in item && Array.isArray(item.items);
  const isActive = (url: string, pattern?: RegExp[]) => isSidebarPathActive(pathname, url, pattern);

  const hasActiveItem = (item: SidebarGroupItem) =>
    item.items.some((subItem) => isActive(subItem.url, subItem.activePatterns));

  const renderSubMenuItem = (item: SidebarLinkItem) => (
    <SidebarMenuSubItem key={item.title}>
      <SidebarMenuSubButton asChild isActive={isActive(item.url, item.activePatterns)}>
        <NavLink to={item.url} end={navLinkEnd(item.url)}>
          <span>{item.title}</span>
        </NavLink>
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  );

  const renderMenuItem = (item: SidebarLinkItem) => (
    <SidebarMenuItem key={item.title}>
      <SidebarMenuButton asChild isActive={isActive(item.url, item.activePatterns)} tooltip={item.title}>
        <NavLink
          to={item.url}
          end={navLinkEnd(item.url)}
          className="flex items-center gap-2 w-full group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:justify-center"
        >
          {item.icon && <span className="shrink-0">{item.icon}</span>}
          <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );

  const renderNavItem = (item: SidebarItem) => {
    if (isGroup(item)) {
      return (
        <Collapsible key={item.title} asChild defaultOpen={hasActiveItem(item)} className="group/collapsible">
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton
                tooltip={item.title}
                className="group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:justify-center"
              >
                {item.icon && <span className="shrink-0">{item.icon}</span>}
                <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 group-data-[collapsible=icon]:hidden" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>{item.items.map(renderSubMenuItem)}</SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      );
    }
    return renderMenuItem(item);
  };

  const userInitial = (user?.firstName?.[0] ?? user?.email?.[0] ?? "?").toUpperCase();
  const displayName = user?.fullName ?? user?.email ?? "User";

  return (
    <Sidebar className="bg-background border-r border-border" collapsible="icon">
      <SidebarHeader>
        <NavLink to="/" className="flex flex-col p-2 hover:bg-muted/50 transition-colors rounded-lg">
          <BrandLogo variant="full" />
          <span className="truncate text-xs text-muted-foreground mt-1 pl-12 group-data-[collapsible=icon]:hidden">
            Admin
          </span>
        </NavLink>
      </SidebarHeader>

      <SidebarContent className="flex flex-col gap-0">
        <SidebarGroup>
          <SidebarMenu className="gap-1.5">{ITEMS.map(renderNavItem)}</SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-2">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary shrink-0 font-semibold text-sm">
            {userInitial}
          </div>
          <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="text-sm font-medium truncate">{displayName}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => void handleLogout()}
          className="flex items-center gap-2 w-full px-2 py-2 rounded-lg text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors mt-1 group-data-[collapsible=icon]:justify-center"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span className="group-data-[collapsible=icon]:hidden">Logout</span>
        </button>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
