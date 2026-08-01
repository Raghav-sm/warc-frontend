import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Switch as SwitchUI } from "@/components/ui/switch";

import type { FieldProps } from "./types";

export type SwitchValue = boolean | null;

type SwitchProps<TClearSet extends SwitchValue = never> = FieldProps<SwitchValue, TClearSet>;

export default function Switch<TClearSet extends SwitchValue = never>(props: SwitchProps<TClearSet>) {
  return (
    <Field data-invalid={props.isInvalid === true}>
      <div className="flex items-center gap-2">
        {props.label && <FieldLabel>{props.label}</FieldLabel>}
        <SwitchUI
          id={props.id}
          checked={props.value === true}
          onCheckedChange={props.onChange}
          disabled={props.readOnly}
          aria-invalid={props.isInvalid === true}
          className={props.className}
        />
      </div>
      {props.helperText && <FieldDescription>{props.helperText}</FieldDescription>}
      {props.error && <FieldError>{props.error}</FieldError>}
    </Field>
  );
}
