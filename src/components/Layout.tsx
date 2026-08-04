import { ArrowLeftIcon, HomeIcon } from "lucide-react";
import { Fragment } from "react";

import { AppSidebar } from "@/components/AppSidebar";
import { NotificationBell } from "@/components/NotificationBell";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { Separator } from "./ui/separator";

export default function Layout({
  children,
  title,
  subtitle,
  breadcrumbs,
  onBack,
  headerActions,
  contentClassName,
}: {
  children: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  onBack?: () => void;
  headerActions?: React.ReactNode;
  contentClassName?: string;
}) {
  return (
    <SidebarProvider>
      <TooltipProvider delayDuration={0}>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 px-4">
            <SidebarTrigger className="" />
            {breadcrumbs && (
              <>
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink href="/">
                        <HomeIcon className="w-4 h-4" />
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    {breadcrumbs?.map((breadcrumb, index) => (
                      <Fragment key={breadcrumb.href ? `${breadcrumb.href}:${breadcrumb.label}` : breadcrumb.label}>
                        <BreadcrumbItem>
                          {breadcrumb.href ? (
                            <BreadcrumbLink href={breadcrumb.href}>{breadcrumb.label}</BreadcrumbLink>
                          ) : (
                            <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                          )}
                        </BreadcrumbItem>
                        {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                      </Fragment>
                    ))}
                  </BreadcrumbList>
                </Breadcrumb>
              </>
            )}
            <div className="ml-auto flex items-center gap-2">
              <NotificationBell />
            </div>
          </header>
          <div className={contentClassName ?? "p-4 px-8 w-full max-w-7xl md:mx-auto"}>
            {(title || subtitle || headerActions) && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div className="flex items-start gap-3 min-w-0">
                  {onBack && (
                    <button
                      type="button"
                      onClick={onBack}
                      className="p-1 rounded-full bg-muted hover:bg-muted-foreground hover:text-background transition-colors cursor-pointer shrink-0"
                      aria-label="Go back"
                    >
                      <ArrowLeftIcon className="w-6 h-6" />
                    </button>
                  )}
                  <div className="min-w-0">
                    {title && <h1 className="text-2xl font-bold truncate">{title}</h1>}
                    {subtitle && <p className="text-base font-light text-foreground">{subtitle}</p>}
                  </div>
                </div>
                {headerActions && <div className="shrink-0 flex items-center justify-end">{headerActions}</div>}
              </div>
            )}
            {children}
          </div>
        </SidebarInset>
      </TooltipProvider>
      <Toaster />
    </SidebarProvider>
  );
}
