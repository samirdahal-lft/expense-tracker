import { deleteExpense } from "@/api/client";
import { AddExpenseForm } from "@/features/expenses/AddExpenseForm";
import { ExpenseList } from "@/features/expenses/ExpenseList";
import { CategorySummary } from "@/features/summary/CategorySummary";
import { ThemeToggle } from "@/features/theme/ThemeToggle";
import { useExpenses } from "@/hooks/useExpenses";
import { useSummary } from "@/hooks/useSummary";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import { Button } from "@/proto-vocab";

interface DashboardProps {
  /** Ends the session and returns to the unauthenticated view. */
  onLogout?: () => void | Promise<void>;
}

/**
 * The authenticated dashboard: add form, category summary (donut), expense list,
 * a light/dark theme toggle, and a sign-out affordance. Mounted only when a
 * session exists, so its data hooks (which hit the session-gated API) never run
 * unauthenticated.
 */
export function Dashboard({ onLogout }: DashboardProps) {
  const { expenses, loading, error, reload } = useExpenses();
  const { summary, loading: summaryLoading, error: summaryError, reload: reloadSummary } = useSummary();
  const { theme, toggle } = useTheme();

  function refreshAll() {
    reload();
    reloadSummary();
  }

  async function handleDelete(id: number) {
    await deleteExpense(id);
    refreshAll();
  }

  return (
    <>
      <header className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Expense Tracker</h1>
          <p className="mt-1 text-sm text-muted-foreground">Track what you spend, in NPR.</p>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle theme={theme} onToggle={toggle} />
          {onLogout ? (
            <Button type="button" variant="ghost" onClick={() => void onLogout()}>
              Sign out
            </Button>
          ) : null}
        </div>
      </header>

      <section className={cn("mb-6 rounded-lg border bg-card p-6 shadow-sm text-card-foreground")}>
        <h2 className="mb-4 text-lg font-medium">Add an expense</h2>
        <AddExpenseForm onCreated={refreshAll} />
      </section>

      <div className="mb-6">
        <CategorySummary summary={summary} loading={summaryLoading} error={summaryError} />
      </div>

      <main className={cn("rounded-lg border bg-card p-6 shadow-sm text-card-foreground")}>
        <h2 className="mb-2 text-lg font-medium">Expenses</h2>
        <ExpenseList expenses={expenses} loading={loading} error={error} onDelete={handleDelete} />
      </main>
    </>
  );
}
