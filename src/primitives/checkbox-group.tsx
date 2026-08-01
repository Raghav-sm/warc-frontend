import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";

import { cn } from "@/utils/classnames";

import { type FieldProps, hasOnClearSet } from "./types";

export type CheckboxGroupValue = string[] | null;

type CheckboxGroupProps<TClearSet extends CheckboxGroupValue = never> = FieldProps<CheckboxGroupValue, TClearSet> & {
  displayCompact?: boolean;
  options: {
    label: string;
    value: string;
  }[];
};

export default function CheckboxGroup<TClearSet extends CheckboxGroupValue = never>(props: CheckboxGroupProps<TClearSet>) {
  const handleCheckboxChange = (checked: boolean, optionValue: string) => {
    if (!props.onChange) return;

    if (checked) {
      props.onChange([...(props.value || []), optionValue]);
      return;
    }

    const next = (props.value || []).filter((v) => v !== optionValue);
    if (next.length === 0 && hasOnClearSet(props)) {
      props.onChange(props.onClearSet);
      return;
    }
    props.onChange(next);
  };

  return (
    <Field data-invalid={props.isInvalid === true}>
      {props.label && <FieldLabel>{props.label}</FieldLabel>}
      <div className={cn("flex gap-2", props.displayCompact ? "flex-row flex-wrap" : "flex-col", props.className)}>
        {props.options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <Checkbox
              id={`${props.id}${option.value}`}
              checked={props.value?.includes(option.value) === true}
              onCheckedChange={(checked) => handleCheckboxChange(checked === true, option.value)}
              disabled={props.readOnly}
              aria-invalid={props.isInvalid === true}
            />
            <label htmlFor={`${props.id}${option.value}`} className="text-sm">
              {option.label}
            </label>
          </div>
        ))}
      </div>
      {props.helperText && <FieldDescription>{props.helperText}</FieldDescription>}
      {props.error && <FieldError>{props.error}</FieldError>}
    </Field>
  );
}
