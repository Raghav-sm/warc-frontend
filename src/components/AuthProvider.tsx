import { type ApolloClient, ApolloProvider, type NormalizedCacheObject } from "@apollo/client";
import React, { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { gql } from "@/__generated__";
import { createApolloClient, tokenStorage } from "@/utils/apollo-client";

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  roleId?: string;
  roleCode?: string;
  roleName?: string;
  isActive?: boolean;
  permissions?: string[];
  createdAt: string;
  updatedAt: string;
}

interface ClearSessionOptions {
  redirect?: boolean;
}

interface AuthContextValue {
  isAuthenticated: boolean;
  user: AuthUser | null;
  initializing: boolean;
  permissions: Set<string>;
  hasAllPermissions: (...codes: string[]) => boolean;
  applyTokens: (accessToken: string, refreshToken: string) => Promise<AuthUser | null>;
  refreshUser: () => Promise<AuthUser | null>;
  clearSession: (opts?: ClearSessionOptions) => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const ME_QUERY = gql(`
  query AuthBootMe {
    me {
      id
      email
      firstName
      lastName
      fullName
      roleId
      roleCode
      roleName
      isActive
      permissions
      createdAt
      updatedAt
    }
  }
`);

function mapMeUser(user: {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  roleId?: string | null;
  roleCode?: string | null;
  roleName?: string | null;
  isActive?: boolean | null;
  permissions?: (string | null)[] | null;
  createdAt: string;
  updatedAt: string;
}): AuthUser {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    fullName: user.fullName,
    roleId: user.roleId ?? undefined,
    roleCode: user.roleCode ?? undefined,
    roleName: user.roleName ?? undefined,
    isActive: user.isActive ?? undefined,
    permissions: (user.permissions ?? []).filter((p): p is string => Boolean(p)),
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: AuthProviderProps): React.JSX.Element {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => Boolean(tokenStorage.getAccessToken()));
  const [user, setUser] = useState<AuthUser | null>(null);
  const [initializing, setInitializing] = useState<boolean>(() => Boolean(tokenStorage.getAccessToken()));

  const apolloClientRef = useRef<ApolloClient<NormalizedCacheObject> | null>(null);

  const clearSession = useCallback(async (opts: ClearSessionOptions = {}): Promise<void> => {
    tokenStorage.clearTokens();
    setUser(null);
    setIsAuthenticated(false);
    setInitializing(false);

    if (apolloClientRef.current) {
      await apolloClientRef.current.clearStore();
    }

    if (opts.redirect !== false) {
      window.location.href = "/login";
    }
  }, []);

  const apolloClient = useMemo<ApolloClient<NormalizedCacheObject>>(() => {
    const client = createApolloClient(() => clearSession({ redirect: true }));
    apolloClientRef.current = client;
    return client;
  }, [clearSession]);

  const hydrateUser = useCallback(async (): Promise<AuthUser | null> => {
    const data = await apolloClient.query({
      query: ME_QUERY,
      fetchPolicy: "network-only",
    });
    const me = data.data?.me ? mapMeUser(data.data.me) : null;
    setUser(me);
    return me;
  }, [apolloClient]);

  const applyTokens = useCallback(
    async (accessToken: string, refreshToken: string): Promise<AuthUser | null> => {
      tokenStorage.setTokens(accessToken, refreshToken);
      setIsAuthenticated(true);
      setInitializing(true);
      try {
        return await hydrateUser();
      } finally {
        setInitializing(false);
      }
    },
    [hydrateUser],
  );

  const refreshUser = useCallback((): Promise<AuthUser | null> => hydrateUser(), [hydrateUser]);

  const didBoot = useRef(false);
  useEffect(() => {
    if (didBoot.current) return;
    didBoot.current = true;
    if (!tokenStorage.getAccessToken()) {
      setInitializing(false);
      return;
    }
    setInitializing(true);
    hydrateUser()
      .catch(() => {})
      .finally(() => setInitializing(false));
  }, [hydrateUser]);

  const permissions = useMemo<Set<string>>(() => new Set(user?.permissions ?? []), [user]);
  const hasAllPermissions = useCallback(
    (...codes: string[]): boolean => codes.every((code) => permissions.has(code)),
    [permissions],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated,
      user,
      initializing,
      permissions,
      hasAllPermissions,
      applyTokens,
      refreshUser,
      clearSession,
    }),
    [isAuthenticated, user, initializing, permissions, hasAllPermissions, applyTokens, refreshUser, clearSession],
  );

  return (
    <AuthContext.Provider value={value}>
      <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}
