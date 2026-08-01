import type { ComponentProps } from "react";
import { cn } from "@/utils/classnames";

function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none placeholder:text-neutral-500 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:border-neutral-800 dark:placeholder:text-neutral-400",
        "focus-visible:border-neutral-950 focus-visible:ring-1 focus-visible:ring-neutral-950/50 dark:focus-visible:border-neutral-300 dark:focus-visible:ring-neutral-300/50",
        "aria-invalid:border-red-500 aria-invalid:ring-red-500/20 dark:aria-invalid:border-red-900 dark:aria-invalid:ring-red-900/20",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
