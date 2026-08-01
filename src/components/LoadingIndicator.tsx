import { LucideLoader } from "lucide-react";

import { cn } from "@/utils/classnames";

const Loader = () => {
  return <LucideLoader className="h-6 w-6 animate-spin" />;
};

interface LoadingIndicatorProps {
  variant?: "default" | "fullscreen";
  className?: string;
}
const LoadingIndicator = ({ variant = "default", className }: LoadingIndicatorProps) => {
  if (variant === "fullscreen") {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-background/80 backdrop-blur-sm z-50">
        <Loader />
      </div>
    );
  }
  return (
    <div className={cn("flex justify-center items-center", className)}>
      <Loader />
    </div>
  );
};

export { Loader, LoadingIndicator };
