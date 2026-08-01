import { isApolloError } from "@apollo/client";

function getMessageFromUnknown(value: unknown): string | undefined {
  if (typeof value === "string" && value.trim().length > 0) return value;
  if (!value || typeof value !== "object") return undefined;

  const message = (value as { message?: unknown }).message;
  if (typeof message === "string" && message.trim().length > 0) return message;

  return undefined;
}

/** Backend puts Zod `fieldErrors` (and optional `formErrors`) on `extensions.meta`. */
function getValidationMessageFromExtensionsMeta(meta: unknown): string | undefined {
  const single = getFirstFieldValidationMessageFromMeta(meta);
  if (single) return single;

  if (meta && typeof meta === "object" && !Array.isArray(meta)) {
    const nested = (meta as { fieldErrors?: unknown }).fieldErrors;
    return getFirstFieldValidationMessageFromMeta(nested);
  }

  return undefined;
}

/** First per-field message only (stable key order); ignores further fields when several have errors. */
function getFirstFieldValidationMessageFromMeta(meta: unknown): string | undefined {
  if (!meta || typeof meta !== "object" || Array.isArray(meta)) return undefined;

  const record = meta as Record<string, unknown>;

  for (const [fieldKey, value] of Object.entries(record)) {
    if (fieldKey === "formErrors") continue;
    if (!Array.isArray(value)) continue;
    for (const item of value) {
      if (typeof item === "string" && item.trim().length > 0) {
        return `${fieldKey.charAt(0).toUpperCase() + fieldKey.slice(1)}: ${item.trim()}`;
      }
    }
  }

  const formErrors = record.formErrors;
  if (Array.isArray(formErrors)) {
    for (const item of formErrors) {
      if (typeof item === "string" && item.trim().length > 0) return item.trim();
    }
  }

  return undefined;
}

function getMessageFromGraphQLErrorPayload(value: unknown): string | undefined {
  if (!value || typeof value !== "object") return undefined;

  const extensions = (value as { extensions?: unknown }).extensions;
  const ext =
    extensions && typeof extensions === "object" && !Array.isArray(extensions)
      ? (extensions as { meta?: unknown })
      : undefined;
  const metaMessage = ext?.meta !== undefined ? getValidationMessageFromExtensionsMeta(ext.meta) : undefined;
  if (metaMessage) return metaMessage;

  const original = (value as { originalError?: unknown }).originalError;
  if (original && typeof original === "object") {
    const fromOriginal = getMessageFromGraphQLErrorPayload(original);
    if (fromOriginal) return fromOriginal;
  }

  return getMessageFromUnknown(value);
}

function getNetworkErrorGraphQlPayloads(networkError: unknown): unknown[] {
  if (!networkError || typeof networkError !== "object") return [];
  const result = (networkError as { result?: unknown }).result;
  if (!result || typeof result !== "object") return [];
  const errors = (result as { errors?: unknown }).errors;
  return Array.isArray(errors) ? errors : [];
}

export function getGraphQLErrorMessage(error: Error | null | undefined): string | undefined {
  if (!error) return undefined;

  if (isApolloError(error)) {
    const graphQLErrorMessage = error.graphQLErrors
      .map((gqlErr) => getMessageFromGraphQLErrorPayload(gqlErr))
      .find((msg): msg is string => typeof msg === "string" && msg.trim().length > 0);
    if (graphQLErrorMessage) return graphQLErrorMessage;

    const fromNetwork = getNetworkErrorGraphQlPayloads(error.networkError)
      .map(getMessageFromGraphQLErrorPayload)
      .find((msg): msg is string => typeof msg === "string" && msg.trim().length > 0);
    if (fromNetwork) return fromNetwork;

    const causePayload = error.cause;
    if (causePayload) {
      const fromCause = getMessageFromGraphQLErrorPayload(causePayload);
      if (fromCause) return fromCause;
    }
  }

  const gqlErrors = (error as { graphQLErrors?: unknown }).graphQLErrors;
  if (Array.isArray(gqlErrors) && gqlErrors.length > 0) {
    const graphQLErrorMessage = gqlErrors
      .map((gqlErr) => getMessageFromGraphQLErrorPayload(gqlErr))
      .find((msg): msg is string => typeof msg === "string" && msg.trim().length > 0);
    if (graphQLErrorMessage) return graphQLErrorMessage;
  }

  const cause = (error as { cause?: unknown }).cause;
  if (cause && typeof cause === "object") {
    const causeResult = (cause as { result?: { errors?: unknown[] } }).result;
    const firstResultError = causeResult?.errors?.[0];
    const resultErrorMessage = getMessageFromGraphQLErrorPayload(firstResultError);
    if (resultErrorMessage) return resultErrorMessage;

    const causeMessage = getMessageFromUnknown(cause);
    if (causeMessage) return causeMessage;
  }

  return getMessageFromUnknown(error);
}
