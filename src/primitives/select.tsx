import { ChevronDownIcon, XIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/utils/classnames";
import { type FieldProps, hasOnClearSet, type SelectOption } from "./types";

export type SingleSelectValue = string | null;

export type SingleSelectProps<TClearSet extends SingleSelectValue = never> = FieldProps<SingleSelectValue, TClearSet> & {
  placeholder?: string;
  searchPlaceholder?: string;
  options: SelectOption[];
  clearable?: boolean;
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

export default function Select<TClearSet extends SingleSelectValue = never>(props: SingleSelectProps<TClearSet>) {
  const [open, setOpen] = useState(false);
  const selectedOption = props.options.find((option) => option.value === props.value);

  return (
    <Field data-invalid={props.isInvalid === true} className="w-auto">
      {props.label && <FieldLabel>{props.label}</FieldLabel>}
      <Popover open={open} onOpenChange={setOpen} modal={true}>
        <PopoverTrigger asChild>
          <Button
            id={props.id}
            variant="outline"
            disabled={props.readOnly}
            aria-invalid={props.isInvalid === true}
            className={cn("justify-between min-w-56 w-56", props.className)}
          >
            <span className={cn("truncate", !selectedOption?.label && "text-muted-foreground")}>
              {selectedOption?.label ?? props.placeholder}
            </span>
            <ChevronDownIcon className="size-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
          <Command filter={commandFilter}>
            <CommandInput placeholder={props.searchPlaceholder} />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {props.clearable && hasOnClearSet(props) && props.value != null && props.value !== undefined && (
                  <CommandItem
                    value="__clear__"
                    keywords={["clear", "selection", "reset"]}
                    onSelect={() => {
                      props.onChange?.(props.onClearSet);
                      setOpen(false);
                    }}
                  >
                    <XIcon className="mr-2 size-4" />
                    Clear selection
                  </CommandItem>
                )}
                {props.options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    keywords={optionKeywords(option)}
                    onSelect={() => {
                      props.onChange?.(option.value);
                      setOpen(false);
                    }}
                  >
                    <span className="truncate">{option.label}</span>
                  </CommandItem>
                ))}
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
