import { cn } from "@/utils/classnames";

export type WorkSchedulePattern = {
  worksMonday?: boolean;
  worksTuesday?: boolean;
  worksWednesday?: boolean;
  worksThursday?: boolean;
  worksFriday?: boolean;
  worksSaturday?: boolean;
  worksSunday?: boolean;
};

type ScheduleInputProps = {
  id?: string;
  label?: string;
  value?: WorkSchedulePattern;
  onChange?: (value: WorkSchedulePattern) => void;
  error?: string;
  helperText?: string;
  readOnly?: boolean;
};

const WEEKDAYS: { label: string; field: keyof WorkSchedulePattern }[] = [
  { label: "Mon", field: "worksMonday" },
  { label: "Tue", field: "worksTuesday" },
  { label: "Wed", field: "worksWednesday" },
  { label: "Thu", field: "worksThursday" },
  { label: "Fri", field: "worksFriday" },
  { label: "Sat", field: "worksSaturday" },
  { label: "Sun", field: "worksSunday" },
];

export function WorkingDaysCell({
  schedule,
  onChange,
  readOnly,
}: {
  schedule?: WorkSchedulePattern;
  onChange?: (value: WorkSchedulePattern) => void;
  readOnly?: boolean;
}) {
  function handleDayToggle(day: keyof WorkSchedulePattern) {
    onChange?.({
      ...(schedule ?? {}),
      [day]: !(schedule?.[day] ?? false),
    });
  }

  return (
    <div className="flex flex-wrap gap-1">
      {WEEKDAYS.map((day) => {
        const isWorkingDay = schedule?.[day.field] ?? false;

        return (
          <button
            key={day.field}
            type="button"
            disabled={readOnly}
            className={cn(
              "cursor-pointer",
              isWorkingDay
                ? "rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
                : "rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground",
              readOnly && "opacity-50 cursor-default",
            )}
            onClick={() => !readOnly && handleDayToggle(day.field)}
          >
            {day.label}
          </button>
        );
      })}
    </div>
  );
}

export default function ScheduleInput({ id, label, value, onChange, error, helperText, readOnly }: ScheduleInputProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-primary">
          {label}
        </label>
      )}
      <WorkingDaysCell schedule={value} onChange={onChange} readOnly={readOnly} />
      {(error || helperText) && (
        <p
          className={cn(
            "text-sm mt-0.5",
            error ? "text-red-500 dark:text-red-400" : "text-neutral-500 dark:text-neutral-400",
          )}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
}
