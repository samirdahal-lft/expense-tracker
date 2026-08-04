import { deleteExpense, type Expense, type ExpenseInput, updateExpense } from "@/api/client";
import { AddExpenseForm } from "@/features/expenses/AddExpenseForm";
import { EditExpenseForm } from "@/features/expenses/EditExpenseForm";
import { ExportCsvButton } from "@/features/expenses/ExportCsvButton";
import { ExpenseList } from "@/features/expenses/ExpenseList";
import { CategorySummary } from "@/features/summary/CategorySummary";
import { ThemeToggle } from "@/features/theme/ThemeToggle";
import { useExpenses } from "@/hooks/useExpenses";
import { useSummary } from "@/hooks/useSummary";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import { useState } from "react";

/**
 * Application shell: add form, category summary (donut), expense list, and a
 * light/dark theme toggle. Add/delete refresh both the list and the summary
 * without a page reload.
 */
export default function App() {
  const { expenses, loading, error, reload } = useExpenses();
  const { summary, loading: summaryLoading, error: summaryError, reload: reloadSummary } = useSummary();
  const { theme, toggle } = useTheme();
  const [editing, setEditing] = useState<Expense | null>(null);

  function refreshAll() {
    reload();
    reloadSummary();
  }

  async function handleSaveEdit(input: ExpenseInput) {
    if (!editing) return;
    await updateExpense(editing.id, input);
    setEditing(null);
    refreshAll(); // an edit can move an amount between categories — the summary must re-reflect it
  }

  async function handleDelete(id: number) {
    await deleteExpense(id);
    refreshAll();
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container max-w-5xl py-10">
        <header className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Expense Tracker</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Track what you spend, in NPR.
            </p>
          </div>
          <ThemeToggle theme={theme} onToggle={toggle} />
        </header>

        <section className={cn("mb-6 rounded-lg border bg-card p-6 shadow-sm text-card-foreground")}>
          <h2 className="mb-4 text-lg font-medium">Add an expense</h2>
          <AddExpenseForm onCreated={refreshAll} />
        </section>

        {editing ? (
          <section className={cn("mb-6 rounded-lg border bg-card p-6 shadow-sm text-card-foreground")}>
            <h2 className="mb-4 text-lg font-medium">Edit expense</h2>
            <EditExpenseForm key={editing.id} expense={editing} onSave={handleSaveEdit} onCancel={() => setEditing(null)} />
          </section>
        ) : null}

        <div className="mb-6">
          <CategorySummary summary={summary} loading={summaryLoading} error={summaryError} />
        </div>

        <main className={cn("rounded-lg border bg-card p-6 shadow-sm text-card-foreground")}>
          <div className="mb-2 flex items-start justify-between gap-4">
            <h2 className="text-lg font-medium">Expenses</h2>
            {/* read-only: exports the loaded list, refreshes nothing */}
            <ExportCsvButton expenses={expenses} />
          </div>
          <ExpenseList expenses={expenses} loading={loading} error={error} onDelete={handleDelete} onEdit={setEditing} />
        </main>
      </div>
    </div>
  );
}
