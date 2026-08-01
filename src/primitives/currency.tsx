import type { ChangeEvent } from "react";

import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

import { type FieldProps, hasOnClearSet } from "./types";

export type CurrencyValue = number | undefined | null;

export type CurrencyProps<TClearSet extends CurrencyValue = never> = FieldProps<CurrencyValue, TClearSet> & {
  placeholder?: string;
  symbol?: string;
  min?: number;
  max?: number;
};

export default function Currency<TClearSet extends CurrencyValue = never>(props: CurrencyProps<TClearSet>) {
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
      <InputGroup>
        <InputGroupInput
          id={props.id}
          name={props.id}
          type="number"
          inputMode="decimal"
          placeholder={props.placeholder}
          value={displayValue}
          min={props.min}
          max={props.max}
          onChange={handleChange}
          disabled={props.readOnly}
          aria-invalid={props.isInvalid === true}
          className={props.className}
        />
        <InputGroupAddon>
          <span className="text-sm">{props.symbol ?? "$"}</span>
        </InputGroupAddon>
      </InputGroup>
      {props.helperText && <FieldDescription>{props.helperText}</FieldDescription>}
      {props.error && <FieldError>{props.error}</FieldError>}
    </Field>
  );
}
