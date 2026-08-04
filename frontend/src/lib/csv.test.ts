import { describe, expect, it } from "vitest";
import { type Expense } from "@/api/client";
import { expensesToCsv } from "@/lib/csv";
// added with the post-review guard below, as a separate line so the proven lines above stay untouched
import { csvFileName } from "@/lib/csv";

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

/**
 * B-3: a note carrying a comma, a double quote, or a line break is quoted per RFC 4180 so the
 * row keeps its four columns and the note round-trips byte-identically. Fields that need no
 * quoting stay unquoted.
 */
describe("B-3: expensesToCsv RFC 4180 quoting", () => {
  function withNote(id: number, note: string): Expense {
    return {
      id,
      amount: 100,
      category: "Food",
      date: "2026-07-05",
      note,
      created_at: "2026-07-05T08:00:00Z",
    };
  }

  it("quotes notes containing a comma, a quote, or a newline and doubles embedded quotes", () => {
    const csv = expensesToCsv([
      withNote(1, "lunch, with tea"),
      withNote(2, 'he said "hi"'),
      withNote(3, "line one\nline two"),
    ]);

    expect(csv).toBe(
      "date,category,amount,note\r\n" +
        '2026-07-05,Food,100,"lunch, with tea"\r\n' +
        '2026-07-05,Food,100,"he said ""hi"""\r\n' +
        '2026-07-05,Food,100,"line one\nline two"\r\n',
    );
  });

  it("leaves a note that needs no quoting unquoted", () => {
    const csv = expensesToCsv([withNote(4, "plain note")]);

    expect(csv.split("\r\n")[1]).toBe("2026-07-05,Food,100,plain note");
  });
});

/**
 * B-4: an empty list still yields the header row alone. The serializer never decides
 * *whether* an export should happen — that judgement belongs to the export action.
 */
describe("B-4: expensesToCsv on an empty list", () => {
  it("returns the header row and nothing else", () => {
    expect(expensesToCsv([])).toBe("date,category,amount,note\r\n");
  });
});

/**
 * B-6: the quoting rule is a property of a FIELD, not of the note column. Today's UI cannot put a
 * comma in a category, but the serializer must not depend on that — a comma arriving from the API
 * would otherwise silently produce a five-column row.
 */
describe("B-6: expensesToCsv quotes every field that needs it", () => {
  it("quotes a comma or quote in the date or category, keeping four columns", () => {
    const hostile = {
      id: 1,
      amount: 100,
      // deliberately not Category/date-shaped: the serializer must not trust its input
      category: 'Food, "fancy"',
      date: "2026-07-05, evening",
      note: "plain",
      created_at: "2026-07-05T08:00:00Z",
    } as unknown as Expense;

    const row = expensesToCsv([hostile]).split("\r\n")[1];

    expect(row).toBe('"2026-07-05, evening","Food, ""fancy""",100,plain');
  });
});

/** Guard added after review: the filename builder had no unit test of its own. */
describe("csvFileName guard: zero-padded local calendar day", () => {
  it("pads single-digit months and days and uses the LOCAL date", () => {
    // local construction, so this asserts the calendar day the user is in, not UTC's
    expect(csvFileName(new Date(2026, 0, 9, 23, 30))).toBe("expenses-2026-01-09.csv");
    expect(csvFileName(new Date(2026, 11, 31, 0, 5))).toBe("expenses-2026-12-31.csv");
  });
});
