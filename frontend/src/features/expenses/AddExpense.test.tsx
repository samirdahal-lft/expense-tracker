import { fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "@/App";

/** Stateful fetch stub: POST appends to an in-memory store; GET returns it. */
function statefulFetch() {
  const store: Array<Record<string, unknown>> = [];
  return vi.fn((_url: string, init?: RequestInit) => {
    const method = init?.method ?? "GET";
    if (method === "POST") {
      const body = JSON.parse((init?.body as string) ?? "{}");
      const created = { id: store.length + 1, created_at: "2026-07-06T10:00:00Z", note: null, ...body };
      store.unshift(created);
      return Promise.resolve({ ok: true, status: 201, json: () => Promise.resolve(created) });
    }
    return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve([...store]) });
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("B-3: add an expense through the running app", () => {
  it("submitting the form makes the new expense appear in the list without a reload", async () => {
    vi.stubGlobal("fetch", statefulFetch());
    render(<App />);

    expect(await screen.findByText(/no expenses yet/i)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/amount/i), { target: { value: "1500" } });
    fireEvent.change(screen.getByLabelText(/category/i), { target: { value: "Transport" } });
    fireEvent.change(screen.getByLabelText(/date/i), { target: { value: "2026-07-06" } });
    fireEvent.click(screen.getByRole("button", { name: /add expense/i }));

    // the new expense appears in the list (scope past the form's category options)
    const list = within(await screen.findByRole("list"));
    expect(list.getByText("Transport")).toBeInTheDocument();
    expect(list.getByText(/Rs\s?1,500/)).toBeInTheDocument();
  });
});
