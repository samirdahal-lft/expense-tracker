import { fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "@/App";

/** Stateful fetch stub: DELETE removes from the store; GET returns it. */
function statefulFetch(initial: Array<Record<string, unknown>>) {
  let store = [...initial];
  return vi.fn((url: string, init?: RequestInit) => {
    const method = init?.method ?? "GET";
    if (method === "DELETE") {
      const id = Number(url.split("/").pop());
      store = store.filter((e) => e.id !== id);
      return Promise.resolve({ ok: true, status: 204, json: () => Promise.resolve(undefined) });
    }
    return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve([...store]) });
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("B-3: delete an expense through the running app", () => {
  it("clicking a row's delete control removes it from the list without a reload", async () => {
    vi.stubGlobal(
      "fetch",
      statefulFetch([
        { id: 1, amount: 1000, category: "Food", date: "2026-07-01", note: "lunch", created_at: "2026-07-01T10:00:00Z" },
      ]),
    );
    render(<App />);

    const list = within(await screen.findByRole("list"));
    expect(list.getByText("Food")).toBeInTheDocument();

    fireEvent.click(list.getByRole("button", { name: /delete/i }));

    // the expense is gone → list becomes the empty state, without any reload
    expect(await screen.findByText(/no expenses yet/i)).toBeInTheDocument();
  });
});
