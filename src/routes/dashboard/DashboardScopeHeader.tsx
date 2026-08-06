type DashboardScopeHeaderProps = {
  label: string;
  description?: string;
};

export function DashboardScopeHeader({ label, description }: DashboardScopeHeaderProps) {
  return (
    <div className="space-y-0.5">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
    </div>
  );
}
