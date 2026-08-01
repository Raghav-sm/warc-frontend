import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { RadioGroupItem, RadioGroup as RadioGroupUI } from "@/components/ui/radio-group";

import { cn } from "@/utils/classnames";

import { type FieldProps, hasOnClearSet } from "./types";

export type RadioGroupValue = string | null;

type RadioGroupProps<TClearSet extends RadioGroupValue = never> = FieldProps<RadioGroupValue, TClearSet> & {
  displayCompact?: boolean;
  options: {
    label: string;
    value: string;
  }[];
};

export default function RadioGroup<TClearSet extends RadioGroupValue = never>(props: RadioGroupProps<TClearSet>) {
  // Radix fires onValueChange only when the value changes, so re-clicking the
  // selected item is caught here to support clearing when a clear-set is given.
  const handleItemClick = (optionValue: string) => {
    if (props.readOnly) return;
    if (props.value === optionValue && hasOnClearSet(props)) {
      props.onChange?.(props.onClearSet);
    }
  };

  return (
    <Field data-invalid={props.isInvalid === true}>
      {props.label && <FieldLabel>{props.label}</FieldLabel>}
      <RadioGroupUI
        id={props.id}
        value={props.value ?? undefined}
        onValueChange={(value) => props.onChange?.(value)}
        disabled={props.readOnly}
        aria-invalid={props.isInvalid === true}
        className={cn("flex gap-2", props.displayCompact ? "flex-row flex-wrap" : "flex-col", props.className)}
      >
        {props.options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem
              id={`${props.id}-${option.value}`}
              value={option.value}
              aria-invalid={props.isInvalid === true}
              onClick={() => handleItemClick(option.value)}
            />
            <label htmlFor={`${props.id}-${option.value}`} className="text-sm">
              {option.label}
            </label>
          </div>
        ))}
      </RadioGroupUI>
      {props.helperText && <FieldDescription>{props.helperText}</FieldDescription>}
      {props.error && <FieldError>{props.error}</FieldError>}
    </Field>
  );
}
