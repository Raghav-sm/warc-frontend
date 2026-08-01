import { SearchIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import debounce from "@/utils/debounce";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";

interface SearchInputProps {
  placeholder?: string;
  onSearch: (value: string) => void;
  debounceMs?: number;
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
}

export function SearchInput({
  placeholder = "Search...",
  onSearch,
  debounceMs = 300,
  value: controlledValue,
  onValueChange,
  disabled = false,
}: SearchInputProps) {
  const [internalValue, setInternalValue] = useState("");
  const isControlled = controlledValue !== undefined;
  const searchValue = isControlled ? controlledValue : internalValue;

  // Use ref to store the latest onSearch callback
  const onSearchRef = useRef(onSearch);
  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  // Create debounced function once and keep it stable
  const debouncedSearchRef = useRef(
    debounce((value: string) => {
      onSearchRef.current(value);
    }, debounceMs),
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!isControlled) {
      setInternalValue(value);
    }
    if (onValueChange) {
      onValueChange(value);
    }
    debouncedSearchRef.current(value);
  };

  return (
    <div className="relative w-48">
      <InputGroup>
        <InputGroupInput
          id="inline-start-input"
          placeholder={placeholder}
          value={searchValue}
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
