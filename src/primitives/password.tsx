import { EyeIcon, EyeOffIcon } from "lucide-react";
import { type ChangeEvent, useState } from "react";

import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";

import { type FieldProps, hasOnClearSet } from "./types";

export type PasswordValue = string | undefined | null;

export type PasswordProps<TClearSet extends PasswordValue = never> = FieldProps<PasswordValue, TClearSet> & {
  placeholder?: string;
};

export default function Password<TClearSet extends PasswordValue = never>(props: PasswordProps<TClearSet>) {
  const [visible, setVisible] = useState(false);

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
      <InputGroup>
        <InputGroupInput
          id={props.id}
          name={props.id}
          type={visible ? "text" : "password"}
          placeholder={props.placeholder}
          value={props.value ?? undefined}
          onChange={handleChange}
          disabled={props.readOnly}
          aria-invalid={props.isInvalid === true}
          className={props.className}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            size="icon-xs"
            tabIndex={-1}
            disabled={props.readOnly}
            aria-label={visible ? "Hide password" : "Show password"}
            title={visible ? "Hide password" : "Show password"}
            onClick={() => setVisible((v) => !v)}
          >
            {visible ? <EyeOffIcon /> : <EyeIcon />}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      {props.helperText && <FieldDescription>{props.helperText}</FieldDescription>}
      {props.error && <FieldError>{props.error}</FieldError>}
    </Field>
  );
}
