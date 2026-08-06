import { ApolloLink, Observable } from "@apollo/client";
import { print } from "graphql";

function getGraphqlStreamUrl(): string {
  const graphqlUrl = import.meta.env.VITE_GRAPHQL_BACKEND_URL as string;
  if (!graphqlUrl) {
    throw new Error("VITE_GRAPHQL_BACKEND_URL is not configured");
  }
  return graphqlUrl.replace(/\/graphql\/?$/, "/graphql/stream");
}

export function createSubscriptionLink(): ApolloLink {
  return new ApolloLink((operation) => {
    return new Observable((observer) => {
      const controller = new AbortController();
      const token = localStorage.getItem("accessToken");

      void (async () => {
        try {
          const response = await fetch(getGraphqlStreamUrl(), {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "text/event-stream",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({
              query: print(operation.query),
              variables: operation.variables,
              operationName: operation.operationName,
            }),
            signal: controller.signal,
          });

          if (!response.ok) {
            throw new Error(`Subscription request failed (${response.status})`);
          }

          if (!response.body) {
            throw new Error("Subscription response has no body");
          }

          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let buffer = "";

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const chunks = buffer.split("\n\n");
            buffer = chunks.pop() ?? "";

            for (const chunk of chunks) {
              const dataLine = chunk
                .split("\n")
                .find((line) => line.startsWith("data:"))
                ?.slice(5)
                .trim();

              if (!dataLine || dataLine === "[DONE]") continue;

              const payload = JSON.parse(dataLine) as {
                errors?: Array<{ message: string }>;
                data?: Record<string, unknown>;
              };

              if (payload.errors?.length) {
                observer.error(new Error(payload.errors[0]?.message ?? "Subscription error"));
                return;
              }

              observer.next(payload);
            }
          }

          observer.complete();
        } catch (error) {
          if ((error as Error).name !== "AbortError") {
            observer.error(error);
          }
        }
      })();

      return () => controller.abort();
    });
  });
}
