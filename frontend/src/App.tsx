import { deleteExpense } from "@/api/client";
import { AddExpenseForm } from "@/features/expenses/AddExpenseForm";
import { ExpenseList } from "@/features/expenses/ExpenseList";
import { CategorySummary } from "@/features/summary/CategorySummary";
import { useExpenses } from "@/hooks/useExpenses";
import { useSummary } from "@/hooks/useSummary";
import { cn } from "@/lib/utils";

/**
 * Application shell. The theme toggle mounts here in T-006. This task adds the
 * category summary; add/delete refresh both the list and the summary without a
 * page reload.
 */
export default function App() {
  const { expenses, loading, error, reload } = useExpenses();
  const { summary, loading: summaryLoading, error: summaryError, reload: reloadSummary } = useSummary();

  function refreshAll() {
    reload();
    reloadSummary();
  }

  async function handleDelete(id: number) {
    await deleteExpense(id);
    refreshAll();
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container max-w-5xl py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">Expense Tracker</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track what you spend, in NPR.
          </p>
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
      </div>
    </div>
  );
}
