import type { ReactNode } from "react";

import { cn } from "@/utils/classnames";

import { Label } from "./ui/label";
import { Skeleton } from "./ui/skeleton";

export const NameDetailsSkeleton = () => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
    {["First Name", "Last Name"].map((label) => (
      <div key={label} className="grid gap-2">
        <Label className="text-muted-foreground">{label}</Label>
        <Skeleton className="h-9 w-full" />
      </div>
    ))}
  </div>
);

export const CompanyDetailsSkeleton = () => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
    {["Registration Number *", "Currency *", "Financial Year Start *", "Pay Frequency *"].map((label) => (
      <div key={label} className="grid gap-2">
        <Label className="text-muted-foreground">{label}</Label>
        <Skeleton className="h-9 w-full" />
      </div>
    ))}
  </div>
);

const FormFieldSkeleton = ({ label }: { label: string }) => (
  <div className="col-span-full space-y-2">
    <Label className="text-muted-foreground">{label}</Label>
    <Skeleton className="h-9 w-full" />
  </div>
);

const FormFieldSkeletonLarge = ({ label }: { label: string }) => (
  <div className="col-span-full space-y-2">
    <Label className="text-muted-foreground">{label}</Label>
    <Skeleton className="h-24 w-full" />
  </div>
);

const FormSwitchSkeleton = ({ label }: { label: string }) => (
  <div className="col-span-full flex items-center gap-2">
    <Skeleton className="h-5 w-5 shrink-0" />
    <Label className="text-muted-foreground">{label}</Label>
  </div>
);

type DetailFormSkeletonField =
  | string
  | { label: string; large?: boolean; switch?: boolean }
  | { custom: ReactNode; id: string };

type DetailFormSkeletonProps = {
  title?: string;
  subTitle?: string;
  className?: string;
  fields: DetailFormSkeletonField[];
};

/**
 * Renders a form-panel-shaped skeleton matching FormPanelWithReadMode layout.
 * Use when loading detail pages to show the form structure while data loads.
 */
export function DetailFormSkeleton({ title, subTitle, className, fields }: DetailFormSkeletonProps) {
  return (
    <div className={cn("min-w-96 shadow-sm ring-1 ring-gray-200 rounded-md sm:rounded-lg md:col-span-2", className)}>
      {(title || subTitle) && (
        <div className="border-b border-gray-200 px-4 py-2">
          {title && (
            <h2 className="text-lg font-semibold leading-7 text-gray-900 sm:truncate sm:text-lg sm:tracking-tight">
              {title}
            </h2>
          )}
          {subTitle && <div className="flex items-center text-sm text-gray-600">{subTitle}</div>}
        </div>
      )}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-6 px-4 py-3">
        {fields.map((field) => {
          if (typeof field === "object" && "custom" in field) {
            return (
              <div key={field.id} className="col-span-full">
                {field.custom}
              </div>
            );
          }
          const config = typeof field === "string" ? { label: field } : field;
          if ("switch" in config && config.switch) {
            return <FormSwitchSkeleton key={config.label} label={config.label} />;
          }
          if ("large" in config && config.large) {
            return <FormFieldSkeletonLarge key={config.label} label={config.label} />;
          }
          return <FormFieldSkeleton key={config.label} label={config.label} />;
        })}
      </div>
    </div>
  );
}
