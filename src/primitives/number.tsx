import type { ChangeEvent } from "react";

import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { type FieldProps, hasOnClearSet } from "./types";

export type NumberValue = number | undefined | null;

export type NumberProps<TClearSet extends NumberValue = never> = FieldProps<NumberValue, TClearSet> & {
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
};

export default function Number_<TClearSet extends NumberValue = never>(props: NumberProps<TClearSet>) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!props.onChange) return;
    const raw = e.target.value;

    if (raw === "") {
      if (hasOnClearSet(props)) props.onChange(props.onClearSet);
      else props.onChange(Number.NaN);
      return;
    }

    const num = Number(raw);
    props.onChange(Number.isNaN(num) ? Number.NaN : num);
  };

  const displayValue = props.value == null || Number.isNaN(props.value) ? "" : props.value.toString();

  return (
    <Field data-invalid={props.isInvalid === true}>
      {props.label && <FieldLabel htmlFor={props.id}>{props.label}</FieldLabel>}
      <Input
        id={props.id}
        name={props.id}
        type="number"
        inputMode="decimal"
        placeholder={props.placeholder}
        value={displayValue}
        min={props.min}
        max={props.max}
        step={props.step}
        onChange={handleChange}
        disabled={props.readOnly}
        aria-invalid={props.isInvalid === true}
        className={props.className}
      />
      {props.helperText && <FieldDescription>{props.helperText}</FieldDescription>}
      {props.error && <FieldError>{props.error}</FieldError>}
    </Field>
  );
}
