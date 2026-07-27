import { type Expense } from "@/api/client";
import { formatNpr } from "@/lib/format";

interface ExpenseListProps {
  expenses: Expense[];
  loading: boolean;
  error: string | null;
  onDelete: (id: number) => void;
  onEdit: (expense: Expense) => void;
}

/** Renders the expense list with deliberate loading and empty states. */
export function ExpenseList({ expenses, loading, error, onDelete, onEdit }: ExpenseListProps) {
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
          <div className="flex shrink-0 items-center gap-3">
            <span className="font-semibold tabular-nums">{formatNpr(e.amount)}</span>
            <button
              type="button"
              aria-label={`Edit ${e.category} expense of ${formatNpr(e.amount)}`}
              onClick={() => onEdit(e)}
              className="rounded-md px-2 py-1 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              Edit
            </button>
            <button
              type="button"
              aria-label={`Delete ${e.category} expense of ${formatNpr(e.amount)}`}
              onClick={() => onDelete(e.id)}
              className="rounded-md px-2 py-1 text-sm text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
