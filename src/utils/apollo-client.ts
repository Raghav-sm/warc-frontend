import { ApolloClient, ApolloLink, InMemoryCache, type NormalizedCacheObject, Observable } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import type { ServerError } from "@apollo/client/link/utils";
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";
import { print } from "graphql";
import { gql } from "@/__generated__";

import paginationHelper from "./pagination-helper";

const GRAPHQL_URL = import.meta.env.VITE_GRAPHQL_BACKEND_URL;

// ─── Types ────────────────────────────────────────────────────────────────────

interface RefreshTokenPayload {
  refreshToken: {
    accessToken: string;
    refreshToken: string;
  };
}

interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

type PendingCallback = () => void;

// ─── Token Storage ───────────────────────────────────────────────────────────
// Centralised token helpers — swap to httpOnly cookie logic server-side if needed

export const tokenStorage = {
  getAccessToken: (): string | null => localStorage.getItem("accessToken"),
  getRefreshToken: (): string | null => localStorage.getItem("refreshToken"),

  setTokens: (accessToken: string, refreshToken?: string | null): void => {
    localStorage.setItem("accessToken", accessToken);
    if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
  },

  clearTokens: (): void => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },
} as const;

// ─── Refresh Token Logic ──────────────────────────────────────────────────────
// We queue pending operations while a refresh is in flight so we don't
// fire multiple simultaneous refresh requests.

let isRefreshing = false;
let pendingRequests: PendingCallback[] = [];

const resolvePendingRequests = (): void => {
  pendingRequests.forEach((cb) => {
    cb();
  });
  pendingRequests = [];
};

const rejectPendingRequests = (): void => {
  pendingRequests = [];
};

function isServerError(err: Error | ServerError | null | undefined): err is ServerError {
  return err != null && "statusCode" in err;
}

// We intentionally use a raw fetch here instead of the Apollo client instance.
// The Apollo client is what triggered the 401, so using it to fire the refresh
// mutation would create a circular dependency and risk an infinite error loop.
const REFRESH_TOKEN_MUTATION = gql(`
  mutation RefreshToken($refreshToken: String!) {
    refreshToken(refreshToken: $refreshToken) {
      accessToken
      refreshToken
    }
  }
`);

/**
 * Fires the refreshToken mutation via a raw fetch to the GraphQL endpoint
 * and stores the new tokens. Returns the new access token on success,
 * or throws on failure.
 */
async function refreshAccessToken(): Promise<string> {
  const refreshToken = tokenStorage.getRefreshToken();
  if (!refreshToken) throw new Error("No refresh token available.");

  const response = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apollo-require-preflight": "true",
    },
    body: JSON.stringify({
      query: print(REFRESH_TOKEN_MUTATION),
      variables: { refreshToken },
    }),
  });

  if (!response.ok) {
    throw new Error(`Network error during token refresh: ${response.status}`);
  }

  const json = (await response.json()) as GraphQLResponse<RefreshTokenPayload>;

  if (json.errors?.length) {
    throw new Error(json.errors[0]?.message ?? "Token refresh failed.");
  }

  if (!json.data) {
    throw new Error("Token refresh returned no data.");
  }

  const { accessToken, refreshToken: newRefreshToken } = json.data.refreshToken;

  tokenStorage.setTokens(accessToken, newRefreshToken);
  return accessToken;
}

// ─── Links ────────────────────────────────────────────────────────────────────

/**
 * Attaches the Authorization header to every request.
 */
const authLink = new ApolloLink((operation, forward) => {
  const token = tokenStorage.getAccessToken();
  operation.setContext(({ headers = {} }: Record<string, unknown>) => ({
    headers: {
      ...(headers as Record<string, string>),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  }));
  return forward(operation);
});

/**
 * Intercepts 401 Unauthorized responses, attempts a token refresh,
 * re-queues any in-flight operations, and retries them with the new token.
 * Calls `onLogout` if the refresh itself fails.
 */
/** Auth mutations that legitimately return UNAUTHENTICATED (e.g. wrong password). */
const SKIP_TOKEN_REFRESH_OPERATIONS = new Set(["Login", "SignUp"]);

function buildErrorLink(onLogout: () => void): ApolloLink {
  return onError(({ graphQLErrors, networkError, operation, forward }) => {
    const is401 =
      (isServerError(networkError) && networkError.statusCode === 401) ||
      graphQLErrors?.some((e) => e.extensions?.code === "UNAUTHENTICATED");

    if (!is401) return;

    // Let login/signup errors reach the mutation's onError handler instead of
    // attempting a token refresh and redirecting to /login.
    if (SKIP_TOKEN_REFRESH_OPERATIONS.has(operation.operationName)) return;

    // No stored session to refresh — propagate the error to the caller.
    if (!tokenStorage.getRefreshToken()) return;

    // Return an Observable so Apollo waits for the async refresh before retrying.
    return new Observable((observer) => {
      if (isRefreshing) {
        // Another refresh is already running — queue this operation.
        pendingRequests.push(() => {
          const token = tokenStorage.getAccessToken();
          operation.setContext(({ headers = {} }: Record<string, unknown>) => ({
            headers: {
              ...(headers as Record<string, string>),
              Authorization: `Bearer ${token}`,
            },
          }));
          forward(operation).subscribe(observer);
        });
        return;
      }

      isRefreshing = true;

      refreshAccessToken()
        .then((newToken) => {
          isRefreshing = false;
          operation.setContext(({ headers = {} }: Record<string, unknown>) => ({
            headers: {
              ...(headers as Record<string, string>),
              Authorization: `Bearer ${newToken}`,
            },
          }));
          resolvePendingRequests();
          forward(operation).subscribe(observer);
        })
        .catch((err: unknown) => {
          isRefreshing = false;
          rejectPendingRequests();
          tokenStorage.clearTokens();
          onLogout();
          observer.error(err);
        });
    });
  });
}

const httpLink = createUploadLink({
  uri: GRAPHQL_URL,
  headers: {
    "apollo-require-preflight": "true",
  },
});

// ─── Client Factory ───────────────────────────────────────────────────────────

/**
 * Creates and returns an ApolloClient instance.
 *
 * @param onLogout  Called when the refresh token is expired/invalid.
 *                  Use this to clear auth state and redirect the user.
 */
export function createApolloClient(onLogout: () => void): ApolloClient<NormalizedCacheObject> {
  const errorLink = buildErrorLink(onLogout);

  return new ApolloClient({
    // Link chain: error handling → auth header injection → HTTP transport
    link: ApolloLink.from([errorLink, authLink, httpLink]),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            getUsers: paginationHelper(["filters"]),
            getRoles: paginationHelper(["filters"]),
            getAuditLogs: paginationHelper(["filters"]),
          },
        },
      },
    }),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: "cache-and-network",
      },
      query: {
        fetchPolicy: "cache-first",
      },
    },
  });
}
