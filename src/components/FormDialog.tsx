import type { ApolloError } from "@apollo/client";
import type { ReactNode } from "react";
import { useRef } from "react";
import type { DefaultValues, FieldValues } from "react-hook-form";
import type z from "zod";

import { DEFAULT_FORM_REF_VALUE, FormPanel, type FormPanelProps, type FormPanelRefType } from "@/components/Form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type FormDialogProps<
  TFieldValues extends FieldValues = FieldValues,
  TContext = unknown,
  TTransformedValues = TFieldValues,
> = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger?: ReactNode;
  title: string;
  description?: string;
  schema: z.ZodType<TTransformedValues, TFieldValues>;
  onSubmit: FormPanelProps<TFieldValues, TContext, TTransformedValues>["onSubmit"];
  onCancel?: () => void;
  loading?: boolean;
  error?: ApolloError;
  submitLabel: string;
  contentClassName?: string;
  defaultValues?: DefaultValues<TFieldValues>;
  children: FormPanelProps<TFieldValues, TContext, TTransformedValues>["children"];
};

export function FormDialog<
  TFieldValues extends FieldValues = FieldValues,
  TContext = unknown,
  TTransformedValues = TFieldValues,
>({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  schema,
  onSubmit,
  onCancel,
  loading = false,
  error,
  submitLabel,
  contentClassName,
  defaultValues,
  children,
}: FormDialogProps<TFieldValues, TContext, TTransformedValues>) {
  const buttonRef = useRef<FormPanelRefType>(DEFAULT_FORM_REF_VALUE);

  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent className={contentClassName ?? "max-w-lg max-h-[90vh] flex flex-col"}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? <DialogDescription>{description}</DialogDescription> : null}
        </DialogHeader>
        <FormPanel
          schema={schema}
          onSubmit={onSubmit}
          onCancel={handleCancel}
          loading={loading}
          error={error}
          buttonRef={buttonRef}
          defaultValues={defaultValues}
        >
          {children}
        </FormPanel>
        <DialogFooter>
          <Button loading={loading} onClick={() => buttonRef.current.submit()}>
            {submitLabel}
          </Button>
          <Button variant="ghost" onClick={() => buttonRef.current.cancel()}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
