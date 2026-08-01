import type { ChangeEvent } from "react";

import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { type FieldProps, hasOnClearSet } from "./types";

export type TextValue = string | undefined | null;

export type TextProps<TClearSet extends TextValue = never> = FieldProps<TextValue, TClearSet> & {
  type?: "text" | "email";
  placeholder?: string;
};

export default function Text<TClearSet extends TextValue = never>(props: TextProps<TClearSet>) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!props.onChange) return;
    const next = e.target.value;

    if (next === "" && hasOnClearSet(props)) {
      props.onChange(props.onClearSet);
      return;
    }
    props.onChange(next);
  };

  return (
    <Field data-invalid={props.isInvalid === true}>
      {props.label && <FieldLabel htmlFor={props.id}>{props.label}</FieldLabel>}
      <Input
        id={props.id}
        name={props.id}
        type={props.type}
        placeholder={props.placeholder}
        value={props.value ?? undefined}
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
