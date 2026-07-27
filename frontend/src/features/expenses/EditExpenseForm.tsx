import { useState } from "react";
import { CATEGORIES, type Category, type Expense } from "@/api/client";

interface EditExpenseFormProps {
  /** The expense being corrected. Its current values seed every field. */
  expense: Expense;
}

const inputClass =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-sm " +
  "focus:outline-none focus:ring-2 focus:ring-ring";

/**
 * Form to correct an existing expense. Every field is seeded from the expense's
 * current values so the user edits what is there rather than retyping the entry;
 * an absent note seeds an empty field.
 */
export function EditExpenseForm({ expense }: EditExpenseFormProps) {
  const [amount, setAmount] = useState(String(expense.amount));
  const [category, setCategory] = useState<Category>(expense.category);
  const [date, setDate] = useState(expense.date);
  const [note, setNote] = useState(expense.note ?? "");

  return (
    <form
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
        className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        Save changes
      </button>
    </form>
  );
}
