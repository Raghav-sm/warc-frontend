export type SelectOption = {
  label: string;
  value: string;
};

export type FieldProps<TValue, TClearSet = never> = {
  id?: string;
  label?: string;
  value?: TValue;
  error?: string;
  isInvalid?: boolean;
  helperText?: string;
  readOnly?: boolean;
  className?: string;
} & ([TClearSet] extends [never]
  ? {
      onClearSet?: never;
      onChange?: (value: NonNullable<TValue>) => void;
    }
  : {
      onClearSet: TClearSet;
      onChange?: (value: NonNullable<TValue> | null | undefined) => void;
    });

/** Narrows FieldProps to the clearable branch so onChange accepts null | undefined. */
export function hasOnClearSet<TValue, TClearSet>(
  props: FieldProps<TValue, TClearSet>,
): props is FieldProps<TValue, TClearSet> & {
  onClearSet: TClearSet;
  onChange?: (value: NonNullable<TValue> | null | undefined) => void;
} {
  return "onClearSet" in props;
}
