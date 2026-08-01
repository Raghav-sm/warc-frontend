import type { ReactNode } from "react";

type PageSectionProps = {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function PageSection({ title, action, children, className }: PageSectionProps) {
  return (
    <section className={className}>
      <div className="flex items-center justify-between gap-2 mb-3">
        <h2 className="text-lg font-semibold">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}
