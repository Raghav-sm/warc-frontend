import { type ReactNode, useLayoutEffect } from "react";

import { usePageLayout } from "@/components/PageLayoutContext";

export default function Layout({
  children,
  title,
  subtitle,
  breadcrumbs,
  onBack,
  headerActions,
  contentClassName,
}: {
  children: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  onBack?: () => void;
  headerActions?: ReactNode;
  contentClassName?: string;
}) {
  const { setLayout, clearLayout } = usePageLayout();

  useLayoutEffect(() => {
    setLayout({ title, subtitle, breadcrumbs, onBack, headerActions, contentClassName });
    return () => clearLayout();
  }, [title, subtitle, breadcrumbs, onBack, headerActions, contentClassName, setLayout, clearLayout]);

  return children;
}
