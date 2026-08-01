import { CheckIcon, ChevronDownIcon, XIcon } from "lucide-react";
import { type MouseEvent, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { cn } from "@/utils/classnames";

import type { FieldProps, SelectOption } from "./types";

export type MultiSelectValue = string[] | null;

export type MultiSelectProps<TClearSet extends MultiSelectValue = never> = FieldProps<MultiSelectValue, TClearSet> & {
  placeholder?: string;
  searchPlaceholder?: string;
  options: SelectOption[];
};

const commandFilter = (itemValue: string, search: string, keywords?: string[]) => {
  if (!search.trim()) return 1;
  const q = search.toLowerCase();
  const hay = [itemValue, ...(keywords ?? [])].join(" ").toLowerCase();
  return hay.includes(q) ? 1 : 0;
};

const optionKeywords = (option: SelectOption): string[] => [
  option.label,
  option.value,
  ...option.label.split(/[\s—\-_./]+/),
];

export default function MultiSelect<TClearSet extends MultiSelectValue = never>(props: MultiSelectProps<TClearSet>) {
  const [open, setOpen] = useState(false);
  const selectedValues = props.value == null ? [] : props.value;
  const optionById = new Map(props.options.map((o) => [o.value, o]));
  const selectedOptions = selectedValues.map((v) => optionById.get(v) ?? { value: v, label: v });

  const handleSelect = (optionValue: string) => {
    if (props.readOnly) return;
    const newValues = selectedValues.includes(optionValue)
      ? selectedValues.filter((v) => v !== optionValue)
      : [...selectedValues, optionValue];
    props.onChange?.(newValues);
  };

  const handleRemove = (e: MouseEvent<HTMLSpanElement>, optionValue: string) => {
    e.stopPropagation();
    if (props.readOnly) return;
    props.onChange?.(selectedValues.filter((v) => v !== optionValue));
  };

  return (
    <Field data-invalid={props.isInvalid === true}>
      {props.label && <FieldLabel>{props.label}</FieldLabel>}
      <Popover open={open} onOpenChange={setOpen} modal={true}>
        <PopoverTrigger asChild>
          <Button
            id={props.id}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={props.readOnly}
            aria-invalid={props.isInvalid === true}
            className={cn("justify-between min-w-56 w-56", props.className)}
          >
            <div className="flex min-w-0 flex-1 gap-1 overflow-x-auto overflow-y-hidden items-center [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
              {selectedOptions.length > 0 ? (
                selectedOptions.map((opt) => (
                  <Badge
                    key={opt.value}
                    variant="secondary"
                    className="gap-0.5 pr-1 font-normal"
                    onClick={(e) => handleRemove(e, opt.value)}
                  >
                    {opt.label}
                    {!props.readOnly && <XIcon className="h-3 w-3" />}
                  </Badge>
                ))
              ) : (
                <span className={cn("truncate", !props.value?.length && "text-muted-foreground")}>{props.placeholder}</span>
              )}
            </div>
            <ChevronDownIcon className="size-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
          <Command filter={commandFilter}>
            <CommandInput placeholder={props.searchPlaceholder} />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {props.options.map((option) => {
                  const isSelected = selectedValues.includes(option.value);
                  return (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      keywords={optionKeywords(option)}
                      onSelect={() => handleSelect(option.value)}
                    >
                      <div className="flex w-full items-center justify-between px-1">
                        {option.label}
                        <CheckIcon className={cn("h-4 w-4", isSelected ? "opacity-100" : "opacity-0")} />
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {props.helperText && <FieldDescription>{props.helperText}</FieldDescription>}
      {props.error && <FieldError>{props.error}</FieldError>}
    </Field>
  );
}
