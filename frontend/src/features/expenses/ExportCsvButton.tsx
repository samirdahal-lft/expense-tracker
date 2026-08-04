import { useState } from "react";
import { type Expense } from "@/api/client";
import { csvFileName, downloadCsv as realDownloadCsv, expensesToCsv } from "@/lib/csv";

interface ExportCsvButtonProps {
  /** The expenses to export, in display order — the file mirrors what the user sees. */
  expenses: Expense[];
  /**
   * The download boundary. Defaults to the real browser download; injectable so a caller
   * can observe what would have been downloaded without performing one.
   */
  downloadCsv?: (filename: string, csvText: string) => void;
}

/**
 * One message at a time: a successful export or nothing to export. Never both.
 *
 * `count` is captured at export time rather than read from live props: this message reports a
 * PAST action, so it must keep describing that export even after the list changes underneath it.
 */
type Status = { kind: "exported"; filename: string; count: number } | { kind: "empty" };

/**
 * Exports the expenses as a CSV file. Read-only: it issues no request and changes no
 * expense — it serializes the list it was handed.
 */
export function ExportCsvButton({ expenses, downloadCsv = realDownloadCsv }: ExportCsvButtonProps) {
  const [status, setStatus] = useState<Status | null>(null);

  function handleExport() {
    if (expenses.length === 0) {
      setStatus({ kind: "empty" });
      return;
    }
    const filename = csvFileName(new Date());
    downloadCsv(filename, expensesToCsv(expenses));
    setStatus({ kind: "exported", filename, count: expenses.length });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleExport}
        className="inline-flex h-10 items-center justify-center rounded-md border border-input px-4 text-sm font-medium transition-colors hover:bg-secondary"
      >
        Export CSV
      </button>
      {/* a live region, so the outcome is announced rather than conveyed by colour alone */}
      <p role="status" className="text-sm text-muted-foreground">
        {status?.kind === "exported"
          ? `Exported ${status.count} ${status.count === 1 ? "expense" : "expenses"} to ${status.filename}`
          : status?.kind === "empty"
            ? "Nothing to export — add an expense first."
            : null}
      </p>
    </div>
  );
}
