import type { ApolloError } from "@apollo/client";
import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function ErrorAlert({ error }: { error?: ApolloError | string }) {
  const errorMessage = typeof error === "string" ? error : error?.message;

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{errorMessage || "An error occurred"}</AlertDescription>
    </Alert>
  );
}
