import { describe, expect, it } from "vitest";
import { type Expense } from "@/api/client";
import { expensesToCsv } from "@/lib/csv";

/**
 * B-1: the serializer emits the header row plus one CRLF-terminated row per expense,
 * in the order it was given (the caller passes display order — newest first).
 */
const NEWEST_FIRST: Expense[] = [
  { id: 2, amount: 2500, category: "Transport", date: "2026-07-02", note: "taxi", created_at: "2026-07-02T09:00:00Z" },
  { id: 1, amount: 1000, category: "Food", date: "2026-07-01", note: "lunch", created_at: "2026-07-01T10:00:00Z" },
];

describe("B-1: expensesToCsv row structure", () => {
  it("emits the header row then one row per expense, in the given order, CRLF-terminated", () => {
    expect(expensesToCsv(NEWEST_FIRST)).toBe(
      "date,category,amount,note\r\n" +
        "2026-07-02,Transport,2500,taxi\r\n" +
        "2026-07-01,Food,1000,lunch\r\n",
    );
  });
});

/**
 * B-2: every field is canonical — a bare integer amount, the date and category verbatim,
 * and an absent note as an empty field (never the text `undefined`).
 */
describe("B-2: expensesToCsv field canonicalization", () => {
  it("writes the amount as a bare integer and an absent note as an empty field", () => {
    const noNote: Expense = {
      id: 3,
      amount: 2500,
      category: "Bills",
      date: "2026-07-03",
      created_at: "2026-07-03T08:00:00Z",
    };
    const emptyNote: Expense = {
      id: 4,
      amount: 7,
      category: "Other",
      date: "2026-07-04",
      note: "",
      created_at: "2026-07-04T08:00:00Z",
    };

    const rows = expensesToCsv([noNote, emptyNote]).split("\r\n");

    // no "Rs", no thousands separator, no decimal point — and an empty trailing note field
    expect(rows[1]).toBe("2026-07-03,Bills,2500,");
    expect(rows[2]).toBe("2026-07-04,Other,7,");
    expect(rows[1]).not.toContain("undefined");
  });
});
