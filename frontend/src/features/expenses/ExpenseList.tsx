import { type Expense } from "@/api/client";
import { formatNpr } from "@/lib/format";

interface ExpenseListProps {
  expenses: Expense[];
  loading: boolean;
  error: string | null;
}

/** Renders the expense list with deliberate loading and empty states. */
export function ExpenseList({ expenses, loading, error }: ExpenseListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground">
        <span>Loading expenses…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 text-center text-destructive">
        <p>Couldn’t load expenses. {error}</p>
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="py-16 text-center text-muted-foreground">
        <p className="text-lg font-medium">No expenses yet</p>
        <p className="mt-1 text-sm">Add your first expense to see it here.</p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-border">
      {expenses.map((e) => (
        <li key={e.id} className="flex items-center justify-between gap-4 py-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
                {e.category}
              </span>
              <span className="text-sm text-muted-foreground">{e.date}</span>
            </div>
            {e.note ? <p className="mt-1 truncate text-sm text-foreground/80">{e.note}</p> : null}
          </div>
          <span className="shrink-0 font-semibold tabular-nums">{formatNpr(e.amount)}</span>
        </li>
      ))}
    </ul>
  );
}
