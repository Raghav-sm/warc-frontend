import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";

import { cn } from "@/utils/classnames";

import { type FieldProps, hasOnClearSet } from "./types";

const COLOR_OPTIONS = [
  { value: "#3B82F6", label: "Blue" },
  { value: "#10B981", label: "Green" },
  { value: "#F59E0B", label: "Amber" },
  { value: "#EF4444", label: "Red" },
  { value: "#8B5CF6", label: "Purple" },
  { value: "#EC4899", label: "Pink" },
  { value: "#06B6D4", label: "Cyan" },
  { value: "#84CC16", label: "Lime" },
];

type ColorHexValue = string | null;

type ColorHexProps<TClearSet extends ColorHexValue = never> = FieldProps<ColorHexValue, TClearSet> & {
  options?: {
    value: string;
    label: string;
  }[];
};

export default function ColorHex<TClearSet extends ColorHexValue = never>(props: ColorHexProps<TClearSet>) {
  const handleColorClick = (colorValue: string) => {
    if (!props.onChange) return;

    const isSelected = props.value?.toUpperCase() === colorValue.toUpperCase();

    if (hasOnClearSet(props)) {
      props.onChange(isSelected ? props.onClearSet : colorValue);
      return;
    }

    if (!isSelected) {
      props.onChange(colorValue);
    }
  };

  return (
    <Field data-invalid={props.isInvalid === true}>
      {props.label && <FieldLabel>{props.label}</FieldLabel>}
      <div className="flex flex-wrap items-center gap-2">
        {(props.options || COLOR_OPTIONS).map((color) => (
          <Button
            key={color.value}
            type="button"
            variant="outline"
            disabled={props.readOnly}
            aria-label={color.label}
            aria-pressed={props.value?.toUpperCase() === color.value.toUpperCase()}
            className={cn(
              "h-8 w-8 rounded-full border-2 p-0",
              props.value?.toUpperCase() === color.value.toUpperCase() ? "border-gray-950" : "border-gray-200",
            )}
            style={{ backgroundColor: color.value }}
            onClick={() => handleColorClick(color.value)}
          />
        ))}
      </div>
      {props.helperText && <FieldDescription>{props.helperText}</FieldDescription>}
      {props.error && <FieldError>{props.error}</FieldError>}
    </Field>
  );
}
