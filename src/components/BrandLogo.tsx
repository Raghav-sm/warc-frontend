import { cn } from "@/utils/classnames";

type BrandLogoProps = {
  variant?: "mark" | "full";
  size?: "default" | "lg";
  className?: string;
  markClassName?: string;
};

function BrandMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <rect width="48" height="48" rx="12" fill="#db2777" />
      <rect x="9" y="28" width="5" height="10" rx="2.5" fill="#111111" />
      <rect x="16" y="22" width="5" height="16" rx="2.5" fill="#ffffff" />
      <rect x="23" y="16" width="5" height="22" rx="2.5" fill="#111111" />
      <rect x="30" y="20" width="5" height="18" rx="2.5" fill="#ffffff" />
    </svg>
  );
}

function BrandWordmark({ size }: { size: "default" | "lg" }) {
  return (
    <div className="leading-none group-data-[collapsible=icon]:hidden">
      <span
        className={cn("block font-bold tracking-tight text-foreground lowercase", size === "lg" ? "text-3xl" : "text-lg")}
      >
        warc
      </span>
      <span
        className={cn(
          "block font-semibold uppercase text-[#db2777]",
          size === "lg" ? "text-sm tracking-[0.25em]" : "text-[10px] tracking-[0.2em]",
        )}
      >
        Analytics
      </span>
    </div>
  );
}

export function BrandLogo({ variant = "mark", size = "default", className, markClassName }: BrandLogoProps) {
  const markSize = size === "lg" ? "h-14 w-14" : "h-10 w-10";

  if (variant === "full") {
    return (
      <div className={cn("flex items-center gap-2.5", className)}>
        <BrandMark className={cn(markSize, "shrink-0", markClassName)} />
        <BrandWordmark size={size} />
      </div>
    );
  }

  return <BrandMark className={cn(markSize, "shrink-0", markClassName, className)} />;
}
