import type { ChangeEvent } from "react";

import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Textarea as TextareaUI } from "@/components/ui/textarea";

import { type FieldProps, hasOnClearSet } from "./types";

export type TextareaValue = string | undefined | null;

export type TextareaProps<TClearSet extends TextareaValue = never> = FieldProps<TextareaValue, TClearSet> & {
  placeholder?: string;
  rows?: number;
};

export default function Textarea<TClearSet extends TextareaValue = never>(props: TextareaProps<TClearSet>) {
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
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
      <TextareaUI
        id={props.id}
        name={props.id}
        placeholder={props.placeholder}
        value={props.value ?? undefined}
        onChange={handleChange}
        disabled={props.readOnly}
        rows={props.rows}
        aria-invalid={props.isInvalid === true}
        className={props.className}
      />
      {props.helperText && <FieldDescription>{props.helperText}</FieldDescription>}
      {props.error && <FieldError>{props.error}</FieldError>}
    </Field>
  );
}
