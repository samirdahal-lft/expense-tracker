import { render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "@/App";

const SAMPLE = [
  { id: 2, amount: 2500, category: "Transport", date: "2026-07-02", note: "taxi", created_at: "2026-07-02T09:00:00Z" },
  { id: 1, amount: 1000, category: "Food", date: "2026-07-01", note: "lunch", created_at: "2026-07-01T10:00:00Z" },
];

function stubFetchResolving(data: unknown) {
  vi.stubGlobal(
    "fetch",
    vi.fn(() => Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(data) })),
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("B-3: expense list in the running app", () => {
  it("renders expenses as readable rows (amount as NPR, category, date, note)", async () => {
    stubFetchResolving(SAMPLE);
    render(<App />);

    // scope to the list — category names also appear as options in the add form
    const list = within(await screen.findByRole("list"));
    expect(list.getByText("Transport")).toBeInTheDocument();
    expect(list.getByText("Food")).toBeInTheDocument();
    expect(list.getByText(/Rs\s?2,500/)).toBeInTheDocument();
    expect(list.getByText("taxi")).toBeInTheDocument();
    expect(list.getByText("2026-07-02")).toBeInTheDocument();
  });

  it("shows a loading state while the request is pending (AC-3)", async () => {
    // auth resolves (so the dashboard mounts), but the expenses request never does
    vi.stubGlobal(
      "fetch",
      vi.fn((url: string) => {
        if (url === "/api/auth/me") {
          return Promise.resolve({
            ok: true,
            status: 200,
            json: () => Promise.resolve({ id: 1, name: "Ada", email: "ada@example.com" }),
          });
        }
        return new Promise(() => {}); // expenses/summary never resolve
      }),
    );
    render(<App />);

    expect(await screen.findByText(/loading expenses/i)).toBeInTheDocument();
  });

  it("shows a deliberate empty state when there are no expenses (AC-3)", async () => {
    stubFetchResolving([]);
    render(<App />);

    expect(await screen.findByText(/no expenses yet/i)).toBeInTheDocument();
  });
});
