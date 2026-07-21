import { render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "@/App";

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
});
