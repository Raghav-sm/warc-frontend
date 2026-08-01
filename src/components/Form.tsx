import type { ApolloError } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createContext,
  type ReactNode,
  type RefObject,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  type Control,
  Controller,
  type ControllerFieldState,
  type ControllerRenderProps,
  type CriteriaMode,
  type DeepPartialSkipArrayKey,
  type DefaultValues,
  type FieldArrayPath,
  type FieldPath,
  type FieldPathValue,
  type FieldValues,
  FormProvider,
  get,
  type Mode,
  type RegisterOptions,
  type Resolver,
  type SubmitErrorHandler,
  type SubmitHandler,
  set,
  type UseFieldArrayReturn,
  type UseFormReset,
  useFieldArray,
  useForm,
  useFormContext,
  useWatch,
  type ValidateForm,
} from "react-hook-form";
import type z from "zod";
import Checkbox, { type CheckboxValue } from "@/primitives/checkbox";
import CheckboxGroup, { type CheckboxGroupValue } from "@/primitives/checkbox-group";
import Currency, { type CurrencyValue } from "@/primitives/currency";
import DatePicker, { type DateValue } from "@/primitives/date";
import DateRangePicker, { type DateRangeValue } from "@/primitives/date-range";
import MultiSelect, { type MultiSelectValue } from "@/primitives/multi-select";
import NumberField, { type NumberValue } from "@/primitives/number";
import Password, { type PasswordValue } from "@/primitives/password";
import PhoneNumberInput, { type PhoneNumberValue } from "@/primitives/phone-number";
import RadioGroup, { type RadioGroupValue } from "@/primitives/radio-group";
import Select, { type SingleSelectValue } from "@/primitives/select";
import Switch, { type SwitchValue } from "@/primitives/switch";
import Text, { type TextValue } from "@/primitives/text";
import Textarea, { type TextareaValue } from "@/primitives/textarea";
import UploadInput, { type UploadValue } from "@/primitives/upload";
import { cn } from "@/utils/classnames";
import { compareValues } from "@/utils/compare-values";
import { getGraphQLErrorMessage } from "@/utils/graphql-errors";
import { ErrorAlert } from "./ErrorAlert";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";

export type FormPanelRefType = {
  submit: () => void;
  cancel: () => void;
  reset?: () => void;
};

export const DEFAULT_FORM_REF_VALUE: FormPanelRefType = {
  submit: () => {},
  cancel: () => {},
  reset: () => {},
};

/** Tracks which fields are currently required-while-visible, and which are hidden. */
export type FieldVisibilityRegistry = {
  setRequired: (fieldName: string, isRequired: boolean) => void;
  setHidden: (fieldName: string, isHidden: boolean) => void;
};

const FieldVisibilityContext = createContext<FieldVisibilityRegistry | null>(null);

function isEmptyFormValue(value: unknown): boolean {
  if (value === undefined || value === null || value === "") return true;
  if (typeof value === "number" && Number.isNaN(value)) return true;
  if (Array.isArray(value) && value.length === 0) return true;
  return false;
}

function unsetPath(target: Record<string, unknown>, path: string) {
  const segments = path.split(".");
  if (segments.length === 1) {
    delete target[path];
    return;
  }

  let current: unknown = target;
  for (let index = 0; index < segments.length - 1; index += 1) {
    if (current == null || typeof current !== "object") return;
    const segment = segments[index];
    if (segment === undefined) return;
    current = (current as Record<string, unknown>)[segment];
  }

  if (current != null && typeof current === "object") {
    const lastSegment = segments[segments.length - 1];
    if (lastSegment === undefined) return;
    delete (current as Record<string, unknown>)[lastSegment];
  }
}

/**
 * Wraps zodResolver so conditional fields work correctly:
 * - Zod errors for currently-hidden fields are ignored
 * - FormInput `required` is enforced only while the field is visible
 * - All other Zod errors pass through unchanged
 */
function createVisibilityAwareResolver<TFieldValues extends FieldValues, TContext, TTransformedValues>(
  schema: z.ZodType<TTransformedValues, TFieldValues>,
  requiredVisibleFieldsRef: RefObject<Set<string>>,
  hiddenFieldsRef: RefObject<Set<string>>,
): Resolver<TFieldValues, TContext, TTransformedValues> {
  const baseResolver = zodResolver(schema);

  return (async (values, context, options) => {
    const result = await baseResolver(values, context, options);
    const hiddenFields = hiddenFieldsRef.current ?? new Set<string>();
    const requiredVisibleFields = requiredVisibleFieldsRef.current ?? new Set<string>();

    if (hiddenFields.size === 0 && requiredVisibleFields.size === 0) {
      return result;
    }

    const errors: Record<string, unknown> = {
      ...((result.errors ?? {}) as Record<string, unknown>),
    };
    let changed = false;

    for (const fieldName of hiddenFields) {
      if (get(errors, fieldName) == null) continue;
      unsetPath(errors, fieldName);
      changed = true;
    }

    for (const fieldName of requiredVisibleFields) {
      // Nested paths (e.g. taxDependents.0.name) must use get(), not values[fieldName]
      if (!isEmptyFormValue(get(values, fieldName))) continue;
      if (get(errors, fieldName) != null) continue;
      set(errors, fieldName, { type: "required", message: "Required" });
      changed = true;
    }

    if (!changed) {
      return result;
    }

    if (Object.keys(errors).length > 0) {
      return { values: {}, errors };
    }

    // Zod only failed on hidden fields — re-validate without them so schema
    // transforms still run on the visible values.
    const visibleValues = { ...values };
    for (const fieldName of hiddenFields) {
      unsetPath(visibleValues as Record<string, unknown>, fieldName);
    }
    const retryResult = await baseResolver(visibleValues as TFieldValues, context, options);
    if (Object.keys(retryResult.errors ?? {}).length === 0) {
      return retryResult;
    }

    // Hidden fields are required by the schema itself — fall back to raw values.
    return { values, errors: {} };
  }) as Resolver<TFieldValues, TContext, TTransformedValues>;
}

interface FormPanelBaseProps<
  TFieldValues extends FieldValues = FieldValues,
  TContext = unknown,
  TTransformedValues = TFieldValues,
> {
  schema: z.ZodType<TTransformedValues, TFieldValues>;
  children?: (props: {
    FormInput: <TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>(
      props: FormInputProps<TFieldValues, TName>,
    ) => ReactNode;
    FormArrayInput: <
      TFieldArrayName extends FieldArrayPath<TFieldValues> = FieldArrayPath<TFieldValues>,
      TKeyName extends string = "id",
    >(
      props: FormArrayInputProps<TFieldValues, TFieldArrayName, TKeyName, TTransformedValues>,
    ) => ReactNode;
    formValues: DeepPartialSkipArrayKey<TFieldValues>;
  }) => ReactNode;
  onSubmit: SubmitHandler<TTransformedValues>;
  onError?: SubmitErrorHandler<TFieldValues>;
  loading: boolean;
  error?: ApolloError;
  cancelButtonLabel?: string;
  submitButtonLabel?: string;
  buttonRef?: RefObject<FormPanelRefType>;
  className?: string;
  mode?: Mode;
  disabled?: boolean;
  reValidateMode?: Exclude<Mode, "onTouched" | "all">;
  defaultValues?: DefaultValues<TFieldValues> | ((payload?: unknown) => Promise<TFieldValues>);
  values?: TFieldValues;
  resetOptions?: Parameters<UseFormReset<TFieldValues>>[1];
  context?: TContext;
  shouldFocusError?: boolean;
  shouldUnregister?: boolean;
  shouldUseNativeValidation?: boolean;
  progressive?: boolean;
  criteriaMode?: CriteriaMode;
  delayError?: number;
  validate?: ValidateForm<TFieldValues>;
}

export interface FormPanelWithReadModeProps<
  TFieldValues extends FieldValues = FieldValues,
  TContext = unknown,
  TTransformedValues = TFieldValues,
> extends FormPanelBaseProps<TFieldValues, TContext, TTransformedValues> {
  isInReadOnlyMode?: (arg0: boolean) => void;
  disableEdit?: boolean;
  title?: string;
  subTitle?: string;
  extraActions?: ReactNode;
}

export function FormPanelWithReadMode<
  TFieldValues extends FieldValues = FieldValues,
  TContext = unknown,
  TTransformedValues = TFieldValues,
>({
  schema,
  children,
  onSubmit,
  onError,
  loading,
  error,
  cancelButtonLabel,
  submitButtonLabel,
  className,
  isInReadOnlyMode,
  disableEdit,
  title,
  subTitle,
  extraActions,
  ...formConfig
}: FormPanelWithReadModeProps<TFieldValues, TContext, TTransformedValues>) {
  const [readOnlyMode, toggleReadOnlyMode] = useState(true);
  const requiredVisibleFieldsRef = useRef<Set<string>>(new Set());
  const hiddenFieldsRef = useRef<Set<string>>(new Set());
  const resolver = useMemo(
    () =>
      createVisibilityAwareResolver<TFieldValues, TContext, TTransformedValues>(
        schema,
        requiredVisibleFieldsRef,
        hiddenFieldsRef,
      ),
    [schema],
  );
  const form = useForm<TFieldValues, TContext, TTransformedValues>({
    ...formConfig,
    resolver,
  });
  const formValues = useWatch({ control: form.control });
  const FormInput = useMemo(
    () => createFieldComponent<TFieldValues, TContext, TTransformedValues>(form.control, readOnlyMode),
    [form.control, readOnlyMode],
  );
  const FormArrayInput = useMemo(
    () => createFieldArrayComponent<TFieldValues, TContext, TTransformedValues>(form.control, readOnlyMode),
    [form.control, readOnlyMode],
  );
  const fieldVisibility = useMemo<FieldVisibilityRegistry>(
    () => ({
      setRequired: (fieldName, isRequired) => {
        if (isRequired) requiredVisibleFieldsRef.current.add(fieldName);
        else requiredVisibleFieldsRef.current.delete(fieldName);
      },
      setHidden: (fieldName, isHidden) => {
        if (isHidden) hiddenFieldsRef.current.add(fieldName);
        else hiddenFieldsRef.current.delete(fieldName);
      },
    }),
    [],
  );

  const handleCancel = useCallback(() => {
    form.reset();
    toggleReadOnlyMode(true);
    isInReadOnlyMode?.(true);
  }, [form, isInReadOnlyMode]);

  const handleSubmit = useCallback<SubmitHandler<TTransformedValues>>(
    async (data, event) => {
      await onSubmit(data, event);
      toggleReadOnlyMode(true);
      isInReadOnlyMode?.(true);
    },
    [onSubmit, isInReadOnlyMode],
  );

  return (
    <FieldVisibilityContext.Provider value={fieldVisibility}>
      <FormProvider {...form}>
        <Card
          className={cn("[--card-spacing:--spacing(3)]", {
            "ring-2 ring-neutral-200": !readOnlyMode,
          })}
        >
          {(title || subTitle) && (
            <CardHeader className="border-b">
              {title && <CardTitle className="font-semibold">{title}</CardTitle>}
              {subTitle && <CardDescription>{subTitle}</CardDescription>}
            </CardHeader>
          )}
          <CardContent className={cn("grid grid-cols-1 gap-3 sm:grid-cols-6", className)}>
            {children?.({ FormInput, FormArrayInput, formValues })}
            {error && (
              <div className="col-span-full">
                <ErrorAlert error={getGraphQLErrorMessage(error)} />
              </div>
            )}
          </CardContent>
          {!disableEdit && (
            <CardFooter className={cn(readOnlyMode ? "justify-between" : "justify-end", "gap-2")}>
              {readOnlyMode ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      toggleReadOnlyMode(false);
                      isInReadOnlyMode?.(false);
                    }}
                  >
                    Make Changes
                  </Button>
                  {extraActions ?? null}
                </>
              ) : (
                <>
                  <Button type="button" onClick={form.handleSubmit(handleSubmit, onError)} loading={loading}>
                    {submitButtonLabel ?? "Submit"}
                  </Button>
                  <Button type="button" variant="secondary" onClick={handleCancel} disabled={loading}>
                    {cancelButtonLabel ?? "Cancel"}
                  </Button>
                </>
              )}
            </CardFooter>
          )}
        </Card>
      </FormProvider>
    </FieldVisibilityContext.Provider>
  );
}

export interface FormPanelProps<
  TFieldValues extends FieldValues = FieldValues,
  TContext = unknown,
  TTransformedValues = TFieldValues,
> extends FormPanelBaseProps<TFieldValues, TContext, TTransformedValues> {
  onCancel?: () => void;
  onReset?: () => void;
}

export function FormPanel<
  TFieldValues extends FieldValues = FieldValues,
  TContext = unknown,
  TTransformedValues = TFieldValues,
>({
  schema,
  children,
  onSubmit,
  onError,
  onCancel,
  onReset,
  loading,
  error,
  cancelButtonLabel,
  submitButtonLabel,
  className,
  buttonRef,
  ...formConfig
}: FormPanelProps<TFieldValues, TContext, TTransformedValues>) {
  const requiredVisibleFieldsRef = useRef<Set<string>>(new Set());
  const hiddenFieldsRef = useRef<Set<string>>(new Set());
  const resolver = useMemo(
    () =>
      createVisibilityAwareResolver<TFieldValues, TContext, TTransformedValues>(
        schema,
        requiredVisibleFieldsRef,
        hiddenFieldsRef,
      ),
    [schema],
  );
  const form = useForm<TFieldValues, TContext, TTransformedValues>({
    ...formConfig,
    resolver,
  });
  const formValues = useWatch({ control: form.control });
  const FormInput = useMemo(
    () => createFieldComponent<TFieldValues, TContext, TTransformedValues>(form.control),
    [form.control],
  );
  const FormArrayInput = useMemo(
    () => createFieldArrayComponent<TFieldValues, TContext, TTransformedValues>(form.control),
    [form.control],
  );
  const fieldVisibility = useMemo<FieldVisibilityRegistry>(
    () => ({
      setRequired: (fieldName, isRequired) => {
        if (isRequired) requiredVisibleFieldsRef.current.add(fieldName);
        else requiredVisibleFieldsRef.current.delete(fieldName);
      },
      setHidden: (fieldName, isHidden) => {
        if (isHidden) hiddenFieldsRef.current.add(fieldName);
        else hiddenFieldsRef.current.delete(fieldName);
      },
    }),
    [],
  );

  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = useCallback(() => {
    void formRef.current?.requestSubmit();
  }, []);

  const handleCancel = useCallback(() => {
    form.reset();
    onCancel?.();
  }, [form, onCancel]);

  const handleReset = useCallback(() => {
    form.reset();
    onReset?.();
  }, [form, onReset]);

  useImperativeHandle(buttonRef, () => ({
    submit: handleSubmit,
    cancel: handleCancel,
    reset: handleReset,
  }));

  return (
    <FieldVisibilityContext.Provider value={fieldVisibility}>
      <FormProvider {...form}>
        <form
          ref={formRef}
          onSubmit={form.handleSubmit(onSubmit, onError)}
          className={cn("grid grid-cols-1 gap-5 sm:grid-cols-6", className)}
        >
          {children?.({ FormInput, FormArrayInput, formValues })}
          {error && (
            <div className="col-span-full">
              <ErrorAlert error={getGraphQLErrorMessage(error)} />
            </div>
          )}
          {!buttonRef && (
            <div className="col-span-full flex gap-2">
              <Button type="submit" loading={loading}>
                {submitButtonLabel ?? "Submit"}
              </Button>
              {onCancel && (
                <Button type="button" variant="secondary" onClick={handleCancel}>
                  {cancelButtonLabel ?? "Cancel"}
                </Button>
              )}
              {onReset && <Button onClick={handleReset}>Reset</Button>}
            </div>
          )}
        </form>
      </FormProvider>
    </FieldVisibilityContext.Provider>
  );
}

export type FieldType =
  | "text"
  | "email"
  | "password"
  | "textarea"
  | "phone-number"
  | "currency"
  | "number"
  | "date"
  | "date-range"
  | "switch"
  | "checkbox"
  | "checkbox-group"
  | "radio-group"
  | "select"
  | "multi-select"
  | "upload"
  | "avatar"
  | "custom";

export type ColSpan = 1 | 2 | 3 | 4 | 5 | 6 | "full";

export type FormSelectOption = {
  label: string;
  value: string;
  color?: string;
};

export interface FormInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  fieldName: TName;
  shouldUnregister?: boolean;
  defaultValue?: FieldPathValue<TFieldValues, TName>;
  exact?: boolean;
  label: string;
  type:
    | "text"
    | "email"
    | "password"
    | "textarea"
    | "phone-number"
    | "currency"
    | "number"
    | "date"
    | "date-range"
    | "switch"
    | "checkbox"
    | "checkbox-group"
    | "radio-group"
    | "select"
    | "multi-select"
    | "upload"
    | "avatar"
    | "custom";
  required?: boolean;
  helperText?: string;
  editable?: boolean;
  /** Static list or derived from whole form row (country → province → city). */
  options?: FormSelectOption[] | ((formData: TFieldValues) => FormSelectOption[]);
  /** When this field changes, cleared to empty string in order listed. */
  cascadeClears?: readonly FieldPath<TFieldValues>[];
  placeholder?: string;
  /** Accepted file types, e.g. "image/*", ".pdf", ".pdf,.docx" */
  accept?: string;
  /** Allow selecting multiple files */
  multiple?: boolean;
  rules?: Omit<RegisterOptions<TFieldValues, TName>, "required" | "disabled">;
  conditionsToShow?: {
    matches: {
      field: FieldPath<TFieldValues>;
      condition: "===" | "!==" | ">" | "<" | ">=" | "<=";
      value: unknown;
    }[];
    type?: "every" | "some";
  };
  hidden?: boolean;
  customInput?: React.ElementType;
  onChange?: (value: FieldPathValue<TFieldValues, TName>) => void;
  onClearSet?: FieldPathValue<TFieldValues, TName> | undefined | null;
  className?: string;
  colSpan?:
    | ColSpan
    | {
        default?: ColSpan;
        sm?: ColSpan;
        md?: ColSpan;
      };
  compact?: boolean;
}

function createFieldComponent<
  TFieldValues extends FieldValues = FieldValues,
  TContext = unknown,
  TTransformedValues = TFieldValues,
>(control: Control<TFieldValues, TContext, TTransformedValues>, readOnlyMode?: boolean) {
  return <TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>({
    fieldName,
    type,
    label,
    placeholder,
    options,
    cascadeClears,
    onChange,
    onClearSet,
    editable = true,
    helperText,
    className,
    colSpan = "full",
    conditionsToShow,
    hidden,
    customInput,
    accept,
    multiple,
    required,
    compact,
    ...controlConfig
  }: FormInputProps<TFieldValues, TName>) => {
    const form = useFormContext<TFieldValues, TContext, TTransformedValues>();

    const hasVisibilityConditions = Boolean(conditionsToShow?.matches.length);
    const watchedValues = useWatch({
      control,
      disabled: !hasVisibilityConditions,
    });

    const shouldHideFromConditions =
      hasVisibilityConditions &&
      (conditionsToShow?.type === "some"
        ? !conditionsToShow?.matches.some((c) => {
            const value = watchedValues?.[c.field] ?? form.getValues(c.field);
            return compareValues(value, c.condition, c.value);
          })
        : !conditionsToShow?.matches.every((c) => {
            const value = watchedValues?.[c.field] ?? form.getValues(c.field);
            return compareValues(value, c.condition, c.value);
          }));
    const shouldHide = hidden === true || shouldHideFromConditions;

    const isRequired = Boolean(required && !shouldHide);
    const displayLabel = isRequired ? `${label} *` : label;
    const fieldVisibility = useContext(FieldVisibilityContext);

    useEffect(() => {
      fieldVisibility?.setHidden(String(fieldName), shouldHide);
      return () => fieldVisibility?.setHidden(String(fieldName), false);
    }, [fieldName, shouldHide, fieldVisibility]);

    useEffect(() => {
      if (!required) return;
      fieldVisibility?.setRequired(String(fieldName), isRequired);
      return () => fieldVisibility?.setRequired(String(fieldName), false);
    }, [fieldName, isRequired, required, fieldVisibility]);

    useEffect(() => {
      if (shouldHide) form.clearErrors(fieldName);
    }, [shouldHide, fieldName, form]);

    const resolvedOptions = typeof options === "function" ? options(form.getValues()) : (options ?? []);

    const getColSpanClass = (span: ColSpan) => {
      switch (span) {
        case 1:
          return "col-span-1";
        case 2:
          return "col-span-2";
        case 3:
          return "col-span-3";
        case 4:
          return "col-span-4";
        case 5:
          return "col-span-5";
        case 6:
          return "col-span-6";
        case "full":
          return "col-span-full";
        default:
          return "col-span-full";
      }
    };

    const colSpanClasses =
      typeof colSpan === "object"
        ? cn(
            colSpan.default && getColSpanClass(colSpan.default),
            colSpan.sm && `sm:${getColSpanClass(colSpan.sm)}`,
            colSpan.md && `md:${getColSpanClass(colSpan.md)}`,
          )
        : getColSpanClass(colSpan);

    if (shouldHide) return null;

    function inputField({
      field,
      fieldState,
    }: {
      field: ControllerRenderProps<TFieldValues, TName>;
      fieldState: ControllerFieldState;
    }) {
      function handleChange(newValue: unknown) {
        const previousValue = field.value;
        field.onChange(newValue);
        if (cascadeClears?.length && previousValue !== newValue) {
          for (const clearedFieldName of cascadeClears) {
            form.resetField(clearedFieldName);
          }
        }
        onChange?.(newValue as FieldPathValue<TFieldValues, TName>);
      }

      switch (type) {
        case "text":
        case "email":
          return (
            <Text
              id={fieldName}
              type={type}
              label={displayLabel}
              placeholder={placeholder}
              value={field.value}
              onChange={handleChange}
              error={fieldState.error?.message}
              helperText={helperText}
              readOnly={readOnlyMode || !editable}
              onClearSet={onClearSet as TextValue}
              className={className}
              isInvalid={fieldState.invalid}
            />
          );
        case "number":
          return (
            <NumberField
              id={fieldName}
              label={displayLabel}
              placeholder={placeholder}
              value={field.value}
              onChange={handleChange}
              error={fieldState.error?.message}
              helperText={helperText}
              readOnly={readOnlyMode || !editable}
              onClearSet={onClearSet as NumberValue}
              className={className}
              isInvalid={fieldState.invalid}
            />
          );
        case "currency":
          return (
            <Currency
              id={fieldName}
              label={displayLabel}
              placeholder={placeholder}
              value={field.value}
              onChange={handleChange}
              error={fieldState.error?.message}
              helperText={helperText}
              readOnly={readOnlyMode || !editable}
              onClearSet={onClearSet as CurrencyValue}
              className={className}
              isInvalid={fieldState.invalid}
            />
          );
        case "password":
          return (
            <Password
              id={fieldName}
              label={displayLabel}
              placeholder={placeholder}
              value={field.value}
              onChange={handleChange}
              error={fieldState.error?.message}
              helperText={helperText}
              readOnly={readOnlyMode || !editable}
              onClearSet={onClearSet as PasswordValue}
              className={className}
              isInvalid={fieldState.invalid}
            />
          );
        case "phone-number":
          return (
            <PhoneNumberInput
              id={fieldName}
              label={displayLabel}
              placeholder={placeholder}
              value={field.value}
              onChange={handleChange}
              error={fieldState.error?.message}
              helperText={helperText}
              readOnly={readOnlyMode || !editable}
              onClearSet={onClearSet as PhoneNumberValue}
              className={className}
              isInvalid={fieldState.invalid}
            />
          );
        case "textarea":
          return (
            <Textarea
              id={fieldName}
              label={displayLabel}
              placeholder={placeholder}
              value={field.value}
              onChange={handleChange}
              error={fieldState.error?.message}
              helperText={helperText}
              readOnly={readOnlyMode || !editable}
              rows={3}
              onClearSet={onClearSet as TextareaValue}
              className={className}
              isInvalid={fieldState.invalid}
            />
          );
        case "select":
          return (
            <Select
              id={fieldName}
              label={displayLabel}
              placeholder={placeholder}
              value={field.value}
              onChange={handleChange}
              error={fieldState.error?.message}
              helperText={helperText}
              options={resolvedOptions}
              readOnly={readOnlyMode || !editable}
              onClearSet={onClearSet as SingleSelectValue}
              className={className}
              isInvalid={fieldState.invalid}
            />
          );
        case "radio-group":
          return (
            <RadioGroup
              id={fieldName}
              label={displayLabel}
              value={field.value}
              onChange={handleChange}
              error={fieldState.error?.message}
              helperText={helperText}
              options={resolvedOptions}
              readOnly={readOnlyMode || !editable}
              onClearSet={onClearSet as RadioGroupValue}
              className={className}
              isInvalid={fieldState.invalid}
            />
          );
        case "checkbox":
          return (
            <Checkbox
              id={fieldName}
              label={displayLabel}
              value={field.value}
              onChange={handleChange}
              error={fieldState.error?.message}
              helperText={helperText}
              readOnly={readOnlyMode || !editable}
              onClearSet={onClearSet as CheckboxValue}
              className={className}
              isInvalid={fieldState.invalid}
            />
          );
        case "checkbox-group":
          return (
            <CheckboxGroup
              id={fieldName}
              label={displayLabel}
              value={field.value}
              onChange={handleChange}
              error={fieldState.error?.message}
              helperText={helperText}
              options={resolvedOptions}
              readOnly={readOnlyMode || !editable}
              displayCompact={compact}
              onClearSet={onClearSet as CheckboxGroupValue}
              className={className}
              isInvalid={fieldState.invalid}
            />
          );
        case "multi-select":
          return (
            <MultiSelect
              id={fieldName}
              label={displayLabel}
              placeholder={placeholder}
              value={field.value}
              onChange={handleChange}
              error={fieldState.error?.message}
              helperText={helperText}
              readOnly={readOnlyMode || !editable}
              options={resolvedOptions}
              onClearSet={onClearSet as MultiSelectValue}
              className={className}
              isInvalid={fieldState.invalid}
            />
          );
        case "switch":
          return (
            <Switch
              id={fieldName}
              label={displayLabel}
              value={field.value}
              onChange={handleChange}
              error={fieldState.error?.message}
              helperText={helperText}
              readOnly={readOnlyMode || !editable}
              onClearSet={onClearSet as SwitchValue}
              className={className}
              isInvalid={fieldState.invalid}
            />
          );
        case "date":
          return (
            <DatePicker
              id={fieldName}
              label={displayLabel}
              value={field.value}
              onChange={handleChange}
              placeholder={placeholder}
              error={fieldState.error?.message}
              helperText={helperText}
              readOnly={readOnlyMode || !editable}
              onClearSet={onClearSet as DateValue}
              className={className}
              isInvalid={fieldState.invalid}
            />
          );
        case "date-range":
          return (
            <DateRangePicker
              id={fieldName}
              label={displayLabel}
              value={field.value}
              onChange={handleChange}
              placeholder={placeholder}
              error={fieldState.error?.message}
              helperText={helperText}
              readOnly={readOnlyMode || !editable}
              onClearSet={onClearSet as DateRangeValue}
              className={className}
              isInvalid={fieldState.invalid}
            />
          );
        case "upload":
        case "avatar": {
          const resolvedAccept = accept ?? (type === "avatar" ? "image/*" : undefined);
          return (
            <UploadInput
              id={fieldName}
              label={displayLabel}
              value={field.value}
              onChange={handleChange}
              error={fieldState.error?.message}
              helperText={helperText}
              readOnly={readOnlyMode || !editable}
              accept={resolvedAccept}
              multiple={multiple}
              onClearSet={onClearSet as UploadValue}
              className={className}
              isInvalid={fieldState.invalid}
            />
          );
        }
        case "custom": {
          const CustomInput = customInput ? customInput : () => <></>;
          return (
            <CustomInput
              id={fieldName}
              value={field.value}
              onChange={(newValue: unknown) => handleChange(newValue)}
              readOnly={readOnlyMode}
              label={displayLabel}
              error={fieldState.error?.message}
              helperText={helperText}
              options={resolvedOptions}
              editable={editable}
              className={className}
              isInvalid={fieldState.invalid}
            />
          );
        }
      }
    }

    return (
      <Controller
        control={control}
        name={fieldName}
        defaultValue={controlConfig.defaultValue}
        exact={controlConfig.exact}
        shouldUnregister={controlConfig.shouldUnregister ?? Boolean(conditionsToShow || hidden)}
        rules={{ ...controlConfig.rules, required: isRequired }}
        disabled={!editable}
        render={(renderProps) => <div className={cn(colSpanClasses, className)}>{inputField(renderProps)}</div>}
      />
    );
  };
}

interface FormArrayInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TFieldArrayName extends FieldArrayPath<TFieldValues> = FieldArrayPath<TFieldValues>,
  TKeyName extends string = "id",
  TTransformedValues = TFieldValues,
> {
  fieldName: TFieldArrayName;
  children: (fieldArray: UseFieldArrayReturn<TFieldValues, TFieldArrayName, TKeyName>) => ReactNode;
  keyName?: TKeyName;
  control?: Control<TFieldValues, unknown, TTransformedValues>;
  rules?: Pick<RegisterOptions<TFieldValues>, "maxLength" | "minLength" | "required">;
  shouldUnregister?: boolean;
  disabled?: boolean;
  hidden?: boolean;
}

function createFieldArrayComponent<
  TFieldValues extends FieldValues = FieldValues,
  TContext = unknown,
  TTransformedValues = TFieldValues,
>(control: Control<TFieldValues, TContext, TTransformedValues>, readOnlyMode?: boolean) {
  return <
    TFieldArrayName extends FieldArrayPath<TFieldValues> = FieldArrayPath<TFieldValues>,
    TKeyName extends string = "id",
  >(
    props: FormArrayInputProps<TFieldValues, TFieldArrayName, TKeyName, TTransformedValues>,
  ) => {
    const form = useFormContext<TFieldValues, TContext, TTransformedValues>();
    const fieldVisibility = useContext(FieldVisibilityContext);
    const shouldHide = props.hidden === true;
    const hasRequiredRule = Boolean(props.rules?.required);
    const isRequired = Boolean(hasRequiredRule && !shouldHide);

    useEffect(() => {
      fieldVisibility?.setHidden(String(props.fieldName), shouldHide);
      return () => fieldVisibility?.setHidden(String(props.fieldName), false);
    }, [props.fieldName, shouldHide, fieldVisibility]);

    useEffect(() => {
      if (!hasRequiredRule) return;
      fieldVisibility?.setRequired(String(props.fieldName), isRequired);
      return () => fieldVisibility?.setRequired(String(props.fieldName), false);
    }, [props.fieldName, isRequired, hasRequiredRule, fieldVisibility]);

    useEffect(() => {
      if (shouldHide) form.clearErrors(props.fieldName as FieldPath<TFieldValues>);
    }, [shouldHide, props.fieldName, form]);

    const fieldArray = useFieldArray<TFieldValues, TFieldArrayName, TKeyName, TTransformedValues>({
      name: props.fieldName,
      keyName: props.keyName,
      rules: shouldHide ? { ...props.rules, required: undefined } : props.rules,
      shouldUnregister: props.shouldUnregister ?? shouldHide,
      control,
      disabled: readOnlyMode || props.disabled || shouldHide,
    });

    if (shouldHide) return null;

    return props.children(fieldArray);
  };
}
