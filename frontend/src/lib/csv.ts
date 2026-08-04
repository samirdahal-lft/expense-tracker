import { type Expense } from "@/api/client";

/** The exported columns, in order. `id` and `created_at` are deliberately not exported. */
const HEADER = "date,category,amount,note";

/** CSV rows are CRLF-terminated (RFC 4180), including the last one. */
const ROW_END = "\r\n";

/**
 * Quote one field per RFC 4180: wrap in double quotes only when the value carries a comma, a
 * double quote, CR, or LF, and double any embedded quote. Anything else is written as-is, so a
 * plain note stays readable in the file.
 */
function quoteField(value: string): string {
  if (!/[",\r\n]/.test(value)) {
    return value;
  }
  return `"${value.replace(/"/g, '""')}"`;
}

/**
 * Serialize expenses to CSV text, one row per expense in the order given — the caller
 * passes display order (newest first), so the file matches what the user sees.
 *
 * Pure: no DOM, no clock. That is what lets the file format be asserted directly.
 */
export function expensesToCsv(expenses: Expense[]): string {
  const rows = expenses.map((e) =>
    [
      e.date,
      e.category,
      // whole NPR as a bare integer — the "Rs 2,500" formatting belongs to the screen, not the file
      String(e.amount),
      // an absent note is an empty field, never the text "undefined"
      quoteField(e.note ?? ""),
    ].join(","),
  );
  return [HEADER, ...rows].map((row) => row + ROW_END).join("");
}
