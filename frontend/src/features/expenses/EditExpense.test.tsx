import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "@/App";

type Row = {
  id: number;
  amount: number;
  category: string;
  date: string;
  note?: string;
  created_at: string;
};

const LUNCH: Row = {
  id: 1,
  amount: 1000,
  category: "Food",
  date: "2026-07-01",
  note: "lunch",
  created_at: "2026-07-01T10:00:00Z",
};

const CATEGORIES = ["Food", "Transport", "Bills", "Other"];

/** Summary derived from the store, the way the real endpoint derives it. */
function summaryOf(store: Row[]) {
  const by_category = CATEGORIES.map((category) => ({
    category,
    total: store.filter((e) => e.category === category).reduce((sum, e) => sum + e.amount, 0),
  }));
  return { total: by_category.reduce((sum, c) => sum + c.total, 0), by_category };
}

/**
 * Stateful fetch stub: PUT replaces a row's four editable fields (leaving id and
 * created_at alone), GET returns the store and a summary derived from it. The wire
 * is the only thing faked — the component tree, hooks and API client are all real.
 */
function statefulFetch(initial: Row[]) {
  let store = [...initial];
  const fn = vi.fn((url: string, init?: RequestInit) => {
    const method = init?.method ?? "GET";
    if (method === "PUT") {
      const id = Number(url.split("/").pop());
      const body = JSON.parse(String(init?.body)) as Partial<Row>;
      let updated: Row | undefined;
      store = store.map((e) =>
        e.id === id
          ? (updated = {
              ...e,
              amount: body.amount!,
              category: body.category!,
              date: body.date!,
              note: body.note,
            })
          : e,
      );
      return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(updated) });
    }
    if (url.includes("/summary")) {
      return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(summaryOf(store)) });
    }
    return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve([...store]) });
  });
  return fn;
}

/** The expense list lives in <main>; the summary renders its own list, so scope to it. */
async function expenseList() {
  return within(await screen.findByRole("main"));
}

/** Open the edit form on the first listed row and return a scope over that form. */
async function openEditForm() {
  const list = await expenseList();
  fireEvent.click(list.getByRole("button", { name: /^edit/i }));
  return within(await screen.findByRole("form", { name: /edit expense/i }));
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("B-4: opening edit on a listed expense presents a pre-filled form", () => {
  it("seeds every field from that expense's current values", async () => {
    vi.stubGlobal("fetch", statefulFetch([LUNCH]));
    render(<App />);

    const form = await openEditForm();

    // the user corrects a value rather than retyping the entry
    expect(form.getByLabelText(/amount/i)).toHaveValue(1000);
    expect(form.getByLabelText(/category/i)).toHaveValue("Food");
    expect(form.getByLabelText(/date/i)).toHaveValue("2026-07-01");
    expect(form.getByLabelText(/note/i)).toHaveValue("lunch");
  });

  it("presents an absent note as an empty field, not a missing one", async () => {
    vi.stubGlobal("fetch", statefulFetch([{ ...LUNCH, note: undefined }]));
    render(<App />);

    const form = await openEditForm();

    expect(form.getByLabelText(/note/i)).toBeInTheDocument();
    expect(form.getByLabelText(/note/i)).toHaveValue("");
  });
});

describe("B-5: submitting an emptied note clears it", () => {
  it("replaces the note rather than preserving the old one", async () => {
    const fetchMock = statefulFetch([LUNCH]);
    vi.stubGlobal("fetch", fetchMock);
    render(<App />);

    expect((await expenseList()).getByText("lunch")).toBeInTheDocument();

    const form = await openEditForm();
    fireEvent.change(form.getByLabelText(/note/i), { target: { value: "   " } }); // whitespace = empty
    fireEvent.click(form.getByRole("button", { name: /save/i }));

    // the note is gone from the listed expense
    await waitFor(() => expect(screen.queryByText("lunch")).not.toBeInTheDocument());

    // and it went over the wire as an emptied note, not an omitted field
    const put = fetchMock.mock.calls.find(([, init]) => (init as RequestInit)?.method === "PUT");
    expect(put, "an update request should have been issued").toBeDefined();
    const sent = JSON.parse(String((put![1] as RequestInit).body)) as Partial<Row>;
    expect(sent.note ?? "").toBe("");

    // nothing else about the expense changed
    const list = await expenseList();
    expect(list.getByText("Rs 1,000")).toBeInTheDocument();
    expect(list.getByText("Food")).toBeInTheDocument();
    expect(list.getByText("2026-07-01")).toBeInTheDocument();
  });
});

describe("B-6: dismissing the edit form", () => {
  it("issues no update request and discards the unsaved draft", async () => {
    const fetchMock = statefulFetch([LUNCH]);
    vi.stubGlobal("fetch", fetchMock);
    render(<App />);

    let form = await openEditForm();
    fireEvent.change(form.getByLabelText(/amount/i), { target: { value: "9999" } });
    fireEvent.change(form.getByLabelText(/category/i), { target: { value: "Bills" } });

    fireEvent.click(form.getByRole("button", { name: /cancel/i }));

    // the form is gone and nothing was sent — abandoning an edit is not a silent save
    await waitFor(() =>
      expect(screen.queryByRole("form", { name: /edit expense/i })).not.toBeInTheDocument(),
    );
    expect(
      fetchMock.mock.calls.some(([, init]) => (init as RequestInit)?.method === "PUT"),
    ).toBe(false);

    // the listed expense is untouched
    const list = await expenseList();
    expect(list.getByText("Rs 1,000")).toBeInTheDocument();
    expect(list.getByText("Food")).toBeInTheDocument();
    expect(list.getByText("lunch")).toBeInTheDocument();

    // and re-opening shows the stored values, not the abandoned draft
    form = await openEditForm();
    expect(form.getByLabelText(/amount/i)).toHaveValue(1000);
    expect(form.getByLabelText(/category/i)).toHaveValue("Food");
  });
});

/** The per-category summary panel. */
async function summaryPanel() {
  return within(await screen.findByRole("region", { name: /spending by category/i }));
}

/** The amount the summary currently attributes to one category. */
function totalFor(panel: ReturnType<typeof within>, category: string) {
  const row = panel
    .getAllByRole("listitem")
    .find((li: HTMLElement) => li.textContent?.trim().startsWith(category));
  return row ? within(row).getByText(/^Rs /).textContent : null;
}

describe("B-7 (e2e): editing an entry updates the list and the summary without a reload", () => {
  it("re-reflects the change in both views in the same interaction", async () => {
    vi.stubGlobal("fetch", statefulFetch([LUNCH]));
    render(<App />);

    // starting point: one Food expense, and a summary that agrees with it
    let panel = await summaryPanel();
    expect(totalFor(panel, "Food")).toBe("Rs 1,000");
    expect(totalFor(panel, "Transport")).toBe("Rs 0");
    expect(totalFor(panel, "Total")).toBe("Rs 1,000");

    // the user corrects the entry: a different amount AND a different category
    const form = await openEditForm();
    fireEvent.change(form.getByLabelText(/amount/i), { target: { value: "2500" } });
    fireEvent.change(form.getByLabelText(/category/i), { target: { value: "Transport" } });
    fireEvent.click(form.getByRole("button", { name: /save/i }));

    // the row reflects it…
    const list = await expenseList();
    await waitFor(() => expect(list.getByText("Rs 2,500")).toBeInTheDocument());
    expect(list.getByText("Transport")).toBeInTheDocument();

    // …and so does the summary, in the same interaction, with no page reload
    panel = await summaryPanel();
    await waitFor(() => expect(totalFor(panel, "Transport")).toBe("Rs 2,500"));
    expect(totalFor(panel, "Food")).toBe("Rs 0");
    expect(totalFor(panel, "Total")).toBe("Rs 2,500");
  });
});
