import { CheckIcon, ChevronDownIcon, XIcon } from "lucide-react";
import { type MouseEvent, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { cn } from "@/utils/classnames";

export type SelectOption = {
  label: string;
  value: string;
};

type BaseSelectProps = {
  id?: string;
  label?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  className?: string;
  options: SelectOption[];
};

/** Controlled value may be absent, null, or undefined depending on your state type. */
export type SingleSelectValue = string | null | undefined;

export type MultiSelectValue = string[] | null | undefined;

export type SingleSelectProps = BaseSelectProps & {
  multiple?: false;
  /** When true (default), an explicit “Clear selection” row appears while a value is set. */
  clearable?: boolean;
  value?: SingleSelectValue;
  onChange?: (value: SingleSelectValue) => void;
};

export type MultiSelectProps = BaseSelectProps & {
  multiple: true;
  value?: MultiSelectValue;
  onChange?: (value: string[]) => void;
};

export type SelectProps = SingleSelectProps | MultiSelectProps;

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

function SelectFooter({ error, helperText }: { error?: string; helperText?: string }) {
  if (!error && !helperText) return null;
  return (
    <p className={cn("text-sm mt-0.5", error ? "text-red-500 dark:text-red-400" : "text-neutral-500 dark:text-neutral-400")}>
      {error || helperText}
    </p>
  );
}

function SelectLabel({ id, label }: { id?: string; label?: string }) {
  if (!label) return null;
  return (
    <label htmlFor={id} className="text-sm font-medium text-primary">
      {label}
    </label>
  );
}

function SelectMulti(props: MultiSelectProps) {
  const {
    id,
    placeholder = "Select...",
    searchPlaceholder = "Search...",
    error,
    disabled = false,
    className,
    options,
    value = [],
    onChange,
  } = props;

  const [open, setOpen] = useState(false);
  const selectedValues = value == null ? [] : value;
  const optionById = new Map(options.map((o) => [o.value, o]));
  const selectedOptions = selectedValues.map((v) => optionById.get(v) ?? { value: v, label: v });

  const handleSelect = (optionValue: string) => {
    if (disabled) return;
    const newValues = selectedValues.includes(optionValue)
      ? selectedValues.filter((v) => v !== optionValue)
      : [...selectedValues, optionValue];
    onChange?.(newValues);
  };

  const handleRemove = (e: MouseEvent, optionValue: string) => {
    e.stopPropagation();
    if (disabled) return;
    onChange?.(selectedValues.filter((v) => v !== optionValue));
  };

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "h-9 w-full justify-between py-2 hover:bg-white",
            error && "border-red-500 dark:border-red-900",
            className,
          )}
        >
          <div className="flex min-w-0 flex-1 gap-1 overflow-x-auto overflow-y-hidden items-center [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {selectedOptions.length > 0 ? (
              selectedOptions.map((opt) => (
                <Badge
                  key={opt.value}
                  variant="secondary"
                  className="gap-0.5 pr-1 font-normal"
                  onClick={(e) => handleRemove(e, opt.value)}
                >
                  {opt.label}
                  {!disabled && <XIcon className="h-3 w-3" />}
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
        <Command filter={commandFilter}>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
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
  );
}

function SelectSingle(props: SingleSelectProps) {
  const {
    id,
    placeholder = "Select...",
    searchPlaceholder = "Search...",
    error,
    disabled = false,
    className,
    options,
    value,
    onChange,
    clearable = false,
  } = props;

  const [open, setOpen] = useState(false);
  const selectedOption = options.find((option) => option.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "h-9 w-full justify-between font-normal hover:bg-white text-base",
            error && "border-red-500 dark:border-red-900",
            className,
          )}
        >
          <span className={cn("truncate", !selectedOption && "text-muted-foreground")}>
            {selectedOption?.label ?? placeholder}
          </span>
          <ChevronDownIcon className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
        <Command filter={commandFilter}>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {clearable && value != null && value !== "" ? (
                <CommandItem
                  value="__clear__"
                  keywords={["clear", "selection", "reset"]}
                  onSelect={() => {
                    onChange?.(undefined);
                    setOpen(false);
                  }}
                >
                  <XIcon className="mr-2 size-4" />
                  Clear selection
                </CommandItem>
              ) : null}
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  keywords={optionKeywords(option)}
                  onSelect={() => {
                    onChange?.(option.value);
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
  );
}

export default function Select(props: SelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <SelectLabel id={props.id} label={props.label} />

      {props.multiple === true ? <SelectMulti {...props} /> : <SelectSingle {...props} />}

      <SelectFooter error={props.error} helperText={props.helperText} />
    </div>
  );
}
