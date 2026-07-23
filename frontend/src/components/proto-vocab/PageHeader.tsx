interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

/** Mirrors App.tsx's header block (h1 + muted subtitle). */
export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
      {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
    </div>
  );
}
