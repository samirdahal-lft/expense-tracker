import { ExpenseList } from "@/features/expenses/ExpenseList";
import { useExpenses } from "@/hooks/useExpenses";
import { cn } from "@/lib/utils";

/**
 * Application shell. The add-expense form, delete, and category summary mount
 * here in later tasks; the theme toggle arrives with T-006. This task renders
 * the expense list (with loading + empty states).
 */
export default function App() {
  const { expenses, loading, error } = useExpenses();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container max-w-5xl py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">Expense Tracker</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track what you spend, in NPR.
          </p>
        </header>
        <main className={cn("rounded-lg border bg-card p-6 shadow-sm", "text-card-foreground")}>
          <h2 className="mb-2 text-lg font-medium">Expenses</h2>
          <ExpenseList expenses={expenses} loading={loading} error={error} />
        </main>
      </div>
    </div>
  );
}
