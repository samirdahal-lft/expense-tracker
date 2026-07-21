import { render, screen, within } from "@testing-library/react";
import { fireEvent } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "@/App";

const FIXED = ["Food", "Transport", "Bills", "Other"] as const;

/** Stateful stub: /expenses GET+POST over an in-memory store; /summary computed from it. */
function statefulApi() {
  const store: Array<{ id: number; amount: number; category: string; date: string; note: string | null; created_at: string }> = [];
  return vi.fn((url: string, init?: RequestInit) => {
    const method = init?.method ?? "GET";
    if (url.endsWith("/expenses") && method === "POST") {
      const b = JSON.parse((init?.body as string) ?? "{}");
      store.unshift({ id: store.length + 1, created_at: "2026-07-06T10:00:00Z", note: null, ...b });
      return Promise.resolve({ ok: true, status: 201, json: () => Promise.resolve(store[0]) });
    }
    if (url.endsWith("/summary")) {
      const by = FIXED.map((c) => ({ category: c, total: store.filter((e) => e.category === c).reduce((s, e) => s + e.amount, 0) }));
      return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({ total: by.reduce((s, x) => s + x.total, 0), by_category: by }) });
    }
    return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve([...store]) });
  });
}

function stubFetch(summary: unknown, expenses: unknown = []) {
  vi.stubGlobal(
    "fetch",
    vi.fn((url: string) => {
      const body = url.endsWith("/summary") ? summary : expenses;
      return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(body) });
    }),
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("B-2: category summary in the running app", () => {
  it("shows per-category totals (NPR) alongside a donut chart region", async () => {
    stubFetch({
      total: 4000,
      by_category: [
        { category: "Food", total: 1500 },
        { category: "Transport", total: 2500 },
        { category: "Bills", total: 0 },
        { category: "Other", total: 0 },
      ],
    });
    render(<App />);

    const region = await screen.findByRole("region", { name: /spending by category/i });
    const summary = within(region);
    expect(await summary.findByText("Food")).toBeInTheDocument();
    expect(summary.getByText(/Rs\s?1,500/)).toBeInTheDocument();
    expect(summary.getByText("Transport")).toBeInTheDocument();
    expect(summary.getByText(/Rs\s?2,500/)).toBeInTheDocument();
  });

  it("shows a deliberate empty state (not a broken chart) when there are no expenses (AC-4)", async () => {
    stubFetch({
      total: 0,
      by_category: [
        { category: "Food", total: 0 },
        { category: "Transport", total: 0 },
        { category: "Bills", total: 0 },
        { category: "Other", total: 0 },
      ],
    });
    render(<App />);

    const region = await screen.findByRole("region", { name: /spending by category/i });
    expect(await within(region).findByText(/nothing to summarize yet/i)).toBeInTheDocument();
  });

  it("reflects a newly added expense without a manual reload (AC-3)", async () => {
    vi.stubGlobal("fetch", statefulApi());
    render(<App />);

    const region = await screen.findByRole("region", { name: /spending by category/i });
    expect(await within(region).findByText(/nothing to summarize yet/i)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/amount/i), { target: { value: "1500" } });
    fireEvent.change(screen.getByLabelText("Category"), { target: { value: "Food" } });
    fireEvent.change(screen.getByLabelText(/date/i), { target: { value: "2026-07-06" } });
    fireEvent.click(screen.getByRole("button", { name: /add expense/i }));

    // summary re-fetches and shows the new total — no reload (Rs 1,500 = Food row + Total row)
    const totals = await within(region).findAllByText(/Rs\s?1,500/);
    expect(totals.length).toBeGreaterThanOrEqual(1);
    expect(within(region).queryByText(/nothing to summarize yet/i)).not.toBeInTheDocument();
  });
});
