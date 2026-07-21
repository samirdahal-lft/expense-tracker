import { type FormEvent, useState } from "react";
import { CATEGORIES, type Category, createExpense } from "@/api/client";

interface AddExpenseFormProps {
  /** Called after a successful create so the caller can refresh the list. */
  onCreated: () => void;
}

const inputClass =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-sm " +
  "focus:outline-none focus:ring-2 focus:ring-ring";

/** Form to add an expense. On success it clears the amount/note and notifies the parent. */
export function AddExpenseForm({ onCreated }: AddExpenseFormProps) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<Category>(CATEGORIES[0]);
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await createExpense({
        amount: Number(amount),
        category,
        date,
        note: note.trim() || undefined,
      });
      setAmount("");
      setNote("");
      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add expense");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-[1fr_1fr_1fr_2fr_auto] sm:items-end">
      <div className="grid gap-1.5">
        <label htmlFor="amount" className="text-sm font-medium">Amount (NPR)</label>
        <input
          id="amount"
          type="number"
          min={1}
          step={1}
          required
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className={inputClass}
        />
      </div>
      <div className="grid gap-1.5">
        <label htmlFor="category" className="text-sm font-medium">Category</label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value as Category)}
          className={inputClass}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
      <div className="grid gap-1.5">
        <label htmlFor="date" className="text-sm font-medium">Date</label>
        <input
          id="date"
          type="date"
          required
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className={inputClass}
        />
      </div>
      <div className="grid gap-1.5">
        <label htmlFor="note" className="text-sm font-medium">Note (optional)</label>
        <input
          id="note"
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className={inputClass}
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {submitting ? "Adding…" : "Add expense"}
      </button>
      {error ? <p className="text-sm text-destructive sm:col-span-full">{error}</p> : null}
    </form>
  );
}
