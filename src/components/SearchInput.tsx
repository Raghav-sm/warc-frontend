import { SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";
import { cn } from "@/utils/classnames";

import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";

interface SearchInputProps {
  placeholder?: string;
  onSearch: (value: string) => void;
  debounceMs?: number;
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export function SearchInput({
  placeholder = "Search...",
  onSearch,
  debounceMs = 300,
  value: controlledValue,
  onValueChange,
  disabled = false,
  className,
}: SearchInputProps) {
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState("");
  const [draft, setDraft] = useState(controlledValue ?? "");

  useEffect(() => {
    if (isControlled) {
      setDraft(controlledValue ?? "");
    }
  }, [controlledValue, isControlled]);

  const debouncedSearch = useDebouncedCallback(onSearch, debounceMs);
  const displayValue = isControlled ? draft : internalValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (isControlled) {
      setDraft(value);
    } else {
      setInternalValue(value);
    }

    onValueChange?.(value);
    debouncedSearch(value);
  };

  return (
    <div className={cn("relative w-48", className)}>
      <InputGroup>
        <InputGroupInput
          id="inline-start-input"
          placeholder={placeholder}
          value={displayValue}
          onChange={handleChange}
          disabled={disabled}
        />
        <InputGroupAddon align="inline-start">
          <SearchIcon className="text-muted-foreground" />
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
