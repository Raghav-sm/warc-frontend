import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from "react";

export type PageLayoutState = {
  title?: ReactNode;
  subtitle?: ReactNode;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  onBack?: () => void;
  headerActions?: ReactNode;
  contentClassName?: string;
};

type PageLayoutContextValue = {
  layout: PageLayoutState;
  setLayout: (layout: PageLayoutState) => void;
  clearLayout: () => void;
};

const PageLayoutContext = createContext<PageLayoutContextValue | null>(null);

const EMPTY_LAYOUT: PageLayoutState = {};

export function PageLayoutProvider({ children }: { children: ReactNode }) {
  const [layout, setLayoutState] = useState<PageLayoutState>(EMPTY_LAYOUT);

  const setLayout = useCallback((next: PageLayoutState) => {
    setLayoutState(next);
  }, []);

  const clearLayout = useCallback(() => {
    setLayoutState(EMPTY_LAYOUT);
  }, []);

  const value = useMemo(() => ({ layout, setLayout, clearLayout }), [layout, setLayout, clearLayout]);

  return <PageLayoutContext.Provider value={value}>{children}</PageLayoutContext.Provider>;
}

export function usePageLayout() {
  const context = useContext(PageLayoutContext);
  if (!context) {
    throw new Error("usePageLayout must be used within PageLayoutProvider");
  }
  return context;
}
