import { type FormEvent, useState } from "react";
import { CATEGORIES, type Category, type Expense, type ExpenseInput } from "@/api/client";

interface EditExpenseFormProps {
  /** The expense being corrected. Its current values seed every field. */
  expense: Expense;
  /** Called with the full replacement values when the user saves. */
  onSave: (input: ExpenseInput) => Promise<void>;
  /** Called when the user abandons the edit. Nothing is sent and the draft is dropped. */
  onCancel: () => void;
}

const inputClass =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-sm " +
  "focus:outline-none focus:ring-2 focus:ring-ring";

/**
 * Form to correct an existing expense. Every field is seeded from the expense's
 * current values so the user edits what is there rather than retyping the entry;
 * an absent note seeds an empty field.
 */
export function EditExpenseForm({ expense, onSave, onCancel }: EditExpenseFormProps) {
  const [amount, setAmount] = useState(String(expense.amount));
  const [category, setCategory] = useState<Category>(expense.category);
  const [date, setDate] = useState(expense.date);
  const [note, setNote] = useState(expense.note ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      // A full replacement: a blank note is sent as no note, exactly as the add
      // form treats a blank note at creation — so saving empty CLEARS the note.
      await onSave({
        amount: Number(amount),
        category,
        date,
        note: note.trim() || undefined,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save changes");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="Edit expense"
      className="grid gap-4 sm:grid-cols-[1fr_1fr_1fr_2fr_auto] sm:items-end"
    >
      <div className="grid gap-1.5">
        <label htmlFor="edit-amount" className="text-sm font-medium">Amount (NPR)</label>
        <input
          id="edit-amount"
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
        <label htmlFor="edit-category" className="text-sm font-medium">Category</label>
        <select
          id="edit-category"
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
        <label htmlFor="edit-date" className="text-sm font-medium">Date</label>
        <input
          id="edit-date"
          type="date"
          required
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className={inputClass}
        />
      </div>
      <div className="grid gap-1.5">
        <label htmlFor="edit-note" className="text-sm font-medium">Note (optional)</label>
        <input
          id="edit-note"
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
        {submitting ? "Saving…" : "Save changes"}
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="inline-flex h-10 items-center justify-center rounded-md border border-input px-4 text-sm font-medium transition-colors hover:bg-secondary"
      >
        Cancel
      </button>
      {error ? <p className="text-sm text-destructive sm:col-span-full">{error}</p> : null}
    </form>
  );
}
