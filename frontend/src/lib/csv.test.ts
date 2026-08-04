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
