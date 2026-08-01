import { format } from "date-fns";
import { CalendarIcon, XIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { cn } from "@/utils/classnames";

import { type FieldProps, hasOnClearSet } from "./types";

export type DateValue = Date | null;

export type DateProps<TClearSet extends DateValue = never> = FieldProps<DateValue, TClearSet> & {
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
};

export default function DatePicker<TClearSet extends DateValue = never>(props: DateProps<TClearSet>) {
  const [open, setOpen] = useState(false);

  const handleSelect = (date: Date | undefined) => {
    if (!props.onChange) return;

    if (!date) {
      if (hasOnClearSet(props)) props.onChange(props.onClearSet);
      return;
    }

    props.onChange(date);
    setOpen(false);
  };

  return (
    <Field data-invalid={props.isInvalid === true}>
      {props.label && <FieldLabel htmlFor={props.id}>{props.label}</FieldLabel>}
      <Popover open={open} onOpenChange={setOpen} modal={true}>
        <PopoverTrigger asChild>
          <Button
            id={props.id}
            variant="outline"
            disabled={props.readOnly}
            aria-invalid={props.isInvalid === true}
            className={cn("justify-start min-w-56 w-56", props.className)}
          >
            <CalendarIcon className="size-4" />
            <span className={cn("truncate", !props.value && "text-muted-foreground")}>
              {props.value ? format(props.value, "PPP") : (props.placeholder ?? "Pick a date")}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            autoFocus
            selected={props.value ?? undefined}
            onSelect={handleSelect}
            defaultMonth={props.value ?? undefined}
            disabled={(date) =>
              (props.minDate ? date < props.minDate : false) || (props.maxDate ? date > props.maxDate : false)
            }
          />
          {hasOnClearSet(props) && props.value && (
            <div className="border-t p-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => handleSelect(undefined)}
              >
                <XIcon className="mr-2 size-4" />
                Clear
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
      {props.helperText && <FieldDescription>{props.helperText}</FieldDescription>}
      {props.error && <FieldError>{props.error}</FieldError>}
    </Field>
  );
}
