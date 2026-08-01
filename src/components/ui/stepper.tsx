import { Check } from "lucide-react";
import { Fragment } from "react";
import { cn } from "@/utils/classnames";

export interface StepperStep {
  label: string;
  description?: string;
}

export interface StepperProps {
  steps: StepperStep[];
  currentStep: number;
  className?: string;
}

export function Stepper({ steps, currentStep, className }: StepperProps) {
  return (
    <div className={cn("w-full max-w-2xl mx-auto", className)}>
      <div className="flex items-center">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          const isLast = index === steps.length - 1;

          return (
            <Fragment key={step.label}>
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors",
                    isCompleted
                      ? "bg-primary border-primary text-primary-foreground"
                      : isActive
                        ? "border-primary bg-background text-primary"
                        : "border-muted bg-background text-muted-foreground",
                  )}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : <span className="text-xs font-medium">{index + 1}</span>}
                </div>
                <div className="mt-2 text-center">
                  <div
                    className={cn(
                      "text-xs font-medium",
                      isActive ? "text-foreground" : isCompleted ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {step.label}
                  </div>
                  {step.description && <div className="text-xs text-muted-foreground mt-0.5">{step.description}</div>}
                </div>
              </div>
              {!isLast && (
                <div className={cn("h-0.5 flex-1 mx-3 transition-colors", isCompleted ? "bg-primary" : "bg-muted")} />
              )}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
