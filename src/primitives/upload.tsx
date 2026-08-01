import { FileText, SearchIcon, Upload, XIcon } from "lucide-react";
import { type ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { cn } from "@/utils/classnames";

import { type FieldProps, hasOnClearSet } from "./types";

export type UploadValue = File | string | (File | string)[] | null;

type UploadProps<TClearSet extends UploadValue = never> = FieldProps<UploadValue, TClearSet> & {
  accept?: string;
  minFileSize?: number;
  maxFileSize?: number;
  multiple?: boolean;
};

const IMAGE_EXTENSIONS = new Set(["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp", "ico", "avif"]);

function isImageFile(value: File | string | null): boolean {
  if (!value) return false;

  if (value instanceof File) {
    return value.type.startsWith("image/");
  }

  if (typeof value === "string" && value.length > 0) {
    try {
      const pathname = new URL(value).pathname;
      const ext = pathname.split(".").pop()?.toLowerCase() ?? "";
      return IMAGE_EXTENSIONS.has(ext);
    } catch {
      const ext = value.split(".").pop()?.toLowerCase() ?? "";
      return IMAGE_EXTENSIONS.has(ext);
    }
  }

  return false;
}

function isImageAccept(accept: string | undefined): boolean {
  if (!accept) return false;
  return accept.split(",").every((t) => t.trim().startsWith("image/") || IMAGE_EXTENSIONS.has(t.trim().replace(".", "")));
}

export default function UploadInput<TClearSet extends UploadValue = never>(props: UploadProps<TClearSet>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [objectUrl, setObjectUrl] = useState<string | undefined>(undefined);

  // FieldProps carries a single value; in `multiple` mode it's an array, so the
  // preview works off the first entry.
  const primaryValue = Array.isArray(props.value) ? (props.value[0] ?? null) : (props.value ?? null);

  const isImage = useMemo(() => isImageFile(primaryValue) || isImageAccept(props.accept), [primaryValue, props.accept]);

  const previewUrl = useMemo(() => {
    if (!isImage) return undefined;
    if (primaryValue instanceof File) return objectUrl;
    if (typeof primaryValue === "string" && primaryValue.length > 0) return primaryValue;
    return undefined;
  }, [isImage, objectUrl, primaryValue]);

  useEffect(() => {
    if (!(primaryValue instanceof File)) return;
    if (!isImage) return;
    const url = URL.createObjectURL(primaryValue);
    setObjectUrl(url);
    return () => {
      URL.revokeObjectURL(url);
      setObjectUrl(undefined);
    };
  }, [primaryValue, isImage]);

  const handleClick = () => {
    if (!props.readOnly && inputRef.current) {
      inputRef.current.click();
    }
  };

  const validateFile = (file: File): string | null => {
    if (props.maxFileSize && file.size > props.maxFileSize * 1024 * 1024) {
      return `File size must be less than ${props.maxFileSize}MB`;
    }

    if (props.minFileSize && file.size < props.minFileSize * 1024 * 1024) {
      return `File size must be at least ${props.minFileSize}MB`;
    }

    if (props.accept) {
      const acceptedTypes = props.accept.split(",").map((t) => t.trim());
      const fileExt = `.${file.name.split(".").pop()?.toLowerCase()}`;
      const matches = acceptedTypes.some((t) => {
        if (t.startsWith(".")) return fileExt === t.toLowerCase();
        if (t.endsWith("/*")) return file.type.startsWith(t.replace("/*", "/"));
        return file.type === t;
      });
      if (!matches) {
        return `File type not accepted. Accepted: ${props.accept}`;
      }
    }

    return null;
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length || !props.onChange) return;

    for (const file of files) {
      const validationError = validateFile(file);
      if (validationError) {
        if (inputRef.current) {
          inputRef.current.value = "";
        }
        alert(validationError);
        return;
      }
    }

    props.onChange(props.multiple ? files : files[0]);
  };

  const handleClear = () => {
    if (props.readOnly) return;
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    if (hasOnClearSet(props)) props.onChange?.(props.onClearSet);
  };

  const hasFile = primaryValue instanceof File || (typeof primaryValue === "string" && primaryValue.length > 0);
  const clearable = hasOnClearSet(props);

  const placeholderText = props.accept ? `Upload ${props.accept.includes("image") ? "image" : "file"}` : "Upload file";

  const hiddenInput = (
    <input
      ref={inputRef}
      type="file"
      accept={props.accept}
      multiple={props.multiple}
      onChange={handleFileChange}
      disabled={props.readOnly}
      className="hidden"
      id={props.id}
    />
  );

  const renderContent = () => {
    // Has file: show preview box + upload / clear buttons
    if (hasFile) {
      return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          {hiddenInput}
          <div className="h-20 w-20 rounded-md border border-input bg-muted flex items-center justify-center overflow-hidden">
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
            ) : (
              <FileText className="h-8 w-8 text-muted-foreground" />
            )}
          </div>
          {!props.readOnly && (
            <div className="flex items-center gap-2">
              <Button type="button" size="icon" variant="outline" onClick={handleClick} aria-label="Upload">
                <Upload className="h-4 w-4" />
              </Button>
              {clearable && (
                <Button type="button" size="icon" variant="outline" onClick={handleClear} aria-label="Remove">
                  <XIcon className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      );
    }

    // No file yet: show upload input field
    return (
      <>
        {hiddenInput}
        <InputGroup>
          <InputGroupInput
            id={props.id}
            readOnly={props.readOnly}
            placeholder={placeholderText}
            value=""
            onChange={handleFileChange}
            onClick={handleClick}
            aria-invalid={props.isInvalid === true}
            className={cn("cursor-pointer", props.className)}
          />
          <InputGroupAddon align="inline-start">
            <SearchIcon className="text-muted-foreground" />
          </InputGroupAddon>
        </InputGroup>
      </>
    );
  };

  return (
    <Field data-invalid={props.isInvalid === true}>
      {props.label && <FieldLabel htmlFor={props.id}>{props.label}</FieldLabel>}
      <div className="relative">{renderContent()}</div>
      {props.helperText && <FieldDescription>{props.helperText}</FieldDescription>}
      {props.error && <FieldError>{props.error}</FieldError>}
    </Field>
  );
}
