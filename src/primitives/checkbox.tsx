import { Checkbox as CheckboxUI } from "@/components/ui/checkbox";
import { Field, FieldContent, FieldDescription, FieldLabel } from "@/components/ui/field";

import { type FieldProps, hasOnClearSet } from "./types";

export type CheckboxValue = boolean | null;

type CheckboxProps<TClearSet extends CheckboxValue = never> = FieldProps<CheckboxValue, TClearSet>;

export default function Checkbox<TClearSet extends CheckboxValue = never>(props: CheckboxProps<TClearSet>) {
  const handleCheckedChange = () => {
    if (hasOnClearSet(props)) {
      if (props.value === true) props.onChange?.(false);
      else if (props.value === false) props.onChange?.(props.onClearSet);
      else props.onChange?.(true);
      return;
    }

    props.onChange?.(props.value !== true);
  };

  return (
    <Field orientation="horizontal" data-invalid={props.isInvalid === true}>
      <CheckboxUI
        id={props.id}
        name={props.id}
        checked={props.value === true}
        onCheckedChange={handleCheckedChange}
        disabled={props.readOnly}
        className={props.className}
        aria-invalid={props.isInvalid === true}
      />
      <FieldContent>
        {props.label && <FieldLabel htmlFor={props.id}>{props.label}</FieldLabel>}
        {props.error || (props.helperText && <FieldDescription>{props.error || props.helperText}</FieldDescription>)}
      </FieldContent>
    </Field>
  );
}
