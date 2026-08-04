import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "@/App";
import { ExportCsvButton } from "@/features/expenses/ExportCsvButton";
import { expensesToCsv } from "@/lib/csv";

const SAMPLE = [
  { id: 2, amount: 2500, category: "Transport", date: "2026-07-02", note: "taxi", created_at: "2026-07-02T09:00:00Z" },
  { id: 1, amount: 1000, category: "Food", date: "2026-07-01", note: "lunch", created_at: "2026-07-01T10:00:00Z" },
];

const SUMMARY = {
  total: 3500,
  by_category: [
    { category: "Food", total: 1000 },
    { category: "Transport", total: 2500 },
    { category: "Bills", total: 0 },
    { category: "Other", total: 0 },
  ],
};

/** Serve the endpoints the app loads on mount, recording every call made. */
function stubApi(expenses: unknown[]) {
  const calls: Array<{ url: string; method: string }> = [];
  vi.stubGlobal(
    "fetch",
    vi.fn((url: string, init?: RequestInit) => {
      calls.push({ url, method: init?.method ?? "GET" });
      const body = url.includes("/summary") ? SUMMARY : expenses;
      return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(body) });
    }),
  );
  return calls;
}

/**
 * jsdom implements neither object URLs nor real downloads, so the browser download
 * boundary is stubbed exactly the way `fetch` is: replace the external API, then assert
 * what the app handed it. Captures each blob plus the filename the anchor asked for.
 */
function stubDownloadBoundary() {
  const offered: Array<{ filename: string; blob: Blob }> = [];
  const revoked: string[] = [];
  const urlFor = new Map<string, Blob>();
  let n = 0;

  vi.stubGlobal("URL", {
    ...URL,
    createObjectURL: vi.fn((blob: Blob) => {
      const href = `blob:mock/${++n}`;
      urlFor.set(href, blob);
      return href;
    }),
    revokeObjectURL: vi.fn((href: string) => revoked.push(href)),
  });

  // An anchor click is what actually starts a download; record it instead of navigating.
  const clickSpy = vi
    .spyOn(HTMLAnchorElement.prototype, "click")
    .mockImplementation(function mockClick(this: HTMLAnchorElement) {
      const blob = urlFor.get(this.href);
      if (blob) offered.push({ filename: this.download, blob });
    });

  return { offered, revoked, clickSpy };
}

/** jsdom's Blob has no text() — read it the way a browser without that method would. */
function blobText(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsText(blob);
  });
}

/** Raw bytes — readAsText decodes UTF-8 and swallows the BOM, so the BOM must be read as bytes. */
function blobBytes(blob: Blob): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(new Uint8Array(reader.result as ArrayBuffer));
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(blob);
  });
}

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  // A LOCAL midday instant: the filename uses the local calendar day, so a UTC instant would
  // make this assertion depend on the machine's timezone.
  vi.setSystemTime(new Date(2026, 7, 4, 12, 0, 0));
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("B-4: exporting expenses from the running app", () => {
  it("offers one CSV file named for today and confirms the export succeeded", async () => {
    const calls = stubApi(SAMPLE);
    const { offered } = stubDownloadBoundary();
    render(<App />);
    await screen.findByText("taxi"); // expenses loaded and rendered

    fireEvent.click(screen.getByRole("button", { name: /export/i }));

    await waitFor(() => expect(offered).toHaveLength(1));
    expect(offered[0].filename).toBe("expenses-2026-08-04.csv");
    await expect(blobText(offered[0].blob)).resolves.toContain(expensesToCsv(SAMPLE as never));

    // the user is told it worked
    const status = await screen.findByRole("status");
    expect(status.textContent).toMatch(/export/i);

    // AC-8: read-only — the export issued no write
    expect(calls.filter((c) => c.method !== "GET")).toHaveLength(0);
  });
});

describe("B-5: exporting with nothing recorded", () => {
  it("produces no file and says there is nothing to export", async () => {
    stubApi([]);
    const { offered } = stubDownloadBoundary();
    render(<App />);
    await screen.findByText(/no expenses yet/i); // empty list rendered

    fireEvent.click(screen.getByRole("button", { name: /export/i }));

    const status = await screen.findByRole("status");
    await waitFor(() => expect(status.textContent).toMatch(/nothing to export/i));
    expect(offered).toHaveLength(0); // no file was produced
    expect(screen.queryByText(/^Exported /)).not.toBeInTheDocument();
  });
});

describe("B-6: repeated exports", () => {
  it("replaces the status message instead of stacking messages", async () => {
    stubApi(SAMPLE);
    stubDownloadBoundary();
    render(<App />);
    await screen.findByText("taxi");

    const button = screen.getByRole("button", { name: /export/i });
    fireEvent.click(button);
    await waitFor(() => expect(screen.getByRole("status").textContent).toMatch(/^Exported /));
    fireEvent.click(button);

    // one live region carrying one message — messages do not accumulate
    const statuses = screen.getAllByRole("status");
    expect(statuses).toHaveLength(1);
    expect(statuses[0].textContent).toMatch(/^Exported /);
    expect(statuses[0].textContent).not.toMatch(/nothing to export/i);
  });
});

describe("B-5: the status message describes the export that happened", () => {
  it("keeps reporting what was exported after the list changes underneath it", async () => {
    // the list shrinks after the export: first load returns two expenses, later loads one
    let listBody: unknown[] = SAMPLE;
    vi.stubGlobal(
      "fetch",
      vi.fn((url: string) => {
        const body = url.includes("/summary") ? SUMMARY : listBody;
        return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(body) });
      }),
    );
    stubDownloadBoundary();
    render(<App />);
    await screen.findByText("taxi");

    fireEvent.click(screen.getByRole("button", { name: /export/i }));
    await waitFor(() => expect(screen.getByRole("status").textContent).toMatch(/2 expenses/));

    // the user deletes a row; the app refetches and the loaded list is now one expense
    listBody = [SAMPLE[1]];
    fireEvent.click(screen.getByRole("button", { name: /delete transport expense/i }));
    await waitFor(() => expect(screen.queryByText("taxi")).not.toBeInTheDocument());

    // the message still describes the export that actually happened — 2 expenses, not 1
    expect(screen.getByRole("status").textContent).toMatch(/2 expenses/);
  });
});

describe("B-7: the real download seam (AC-10 wiring)", () => {
  it("offers a text/csv blob carrying the UTF-8 BOM and releases the object URL", async () => {
    stubApi(SAMPLE);
    const { offered, revoked } = stubDownloadBoundary();
    render(<App />);
    await screen.findByText("taxi");

    fireEvent.click(screen.getByRole("button", { name: /export/i }));

    await waitFor(() => expect(offered).toHaveLength(1));
    expect(offered[0].blob.type).toMatch(/^text\/csv/);
    // a spreadsheet needs the BOM to read non-ASCII notes correctly
    const bytes = await blobBytes(offered[0].blob);
    expect([bytes[0], bytes[1], bytes[2]]).toEqual([0xef, 0xbb, 0xbf]);
    await expect(blobText(offered[0].blob)).resolves.toMatch(/^date,category,amount,note/);
    // the handle is released, so repeated exports leak nothing
    expect(revoked).toHaveLength(1);
  });
});

/**
 * Guards added after review. Each strengthens an AC whose original assertion could pass for the
 * wrong reason; they are recorded off-ledger because the behavior was already built.
 */
describe("AC-5 guard: the message is replaced when the outcome changes", () => {
  it("drops the success message for nothing-to-export once the last expense is gone", async () => {
    let listBody: unknown[] = [SAMPLE[0]];
    vi.stubGlobal(
      "fetch",
      vi.fn((url: string) => {
        const body = url.includes("/summary") ? SUMMARY : listBody;
        return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(body) });
      }),
    );
    stubDownloadBoundary();
    render(<App />);
    await screen.findByText("taxi");

    const button = screen.getByRole("button", { name: /export/i });
    fireEvent.click(button);
    await waitFor(() => expect(screen.getByRole("status").textContent).toMatch(/^Exported /));

    // delete the only expense, then export again — the OUTCOME changes this time
    listBody = [];
    fireEvent.click(screen.getByRole("button", { name: /delete transport expense/i }));
    await waitFor(() => expect(screen.queryByText("taxi")).not.toBeInTheDocument());
    fireEvent.click(button);

    await waitFor(() => expect(screen.getByRole("status").textContent).toMatch(/nothing to export/i));
    expect(screen.getAllByRole("status")).toHaveLength(1);
    expect(screen.queryByText(/^Exported /)).not.toBeInTheDocument();
  });
});

describe("AC-6 guard: export triggers no request and changes nothing on screen", () => {
  it("makes no call at all and leaves the expenses panel identical", async () => {
    const calls = stubApi(SAMPLE);
    stubDownloadBoundary();
    render(<App />);
    await screen.findByText("taxi");
    const callsBefore = calls.length;
    const panelBefore = screen.getByRole("main").innerHTML;

    fireEvent.click(screen.getByRole("button", { name: /export/i }));
    await waitFor(() => expect(screen.getByRole("status").textContent).toMatch(/^Exported /));

    // stronger than "no writes": exporting does not even refetch
    expect(calls.length).toBe(callsBefore);
    // and nothing the user is looking at moved, apart from the status line itself
    const strip = (html: string) => html.replace(/Exported[^<]*/, "");
    expect(strip(screen.getByRole("main").innerHTML)).toBe(strip(panelBefore));
  });
});

describe("AC-8 guard: the control is keyboard-reachable", () => {
  it("is a native button that takes focus and exports when activated from the keyboard", async () => {
    stubApi(SAMPLE);
    const { offered } = stubDownloadBoundary();
    render(<App />);
    await screen.findByText("taxi");

    const button = screen.getByRole("button", { name: /export/i });
    expect(button.tagName).toBe("BUTTON"); // natively in tab order — no tabindex juggling
    expect(button).not.toHaveAttribute("tabindex");

    button.focus();
    expect(button).toHaveFocus();
    fireEvent.click(document.activeElement as HTMLElement); // Enter/Space on a focused button
    await waitFor(() => expect(offered).toHaveLength(1));
  });
});

describe("the injectable download seam", () => {
  it("hands the filename and CSV text to a caller-supplied port instead of the browser", () => {
    const handed: Array<[string, string]> = [];
    render(
      <ExportCsvButton
        expenses={SAMPLE as never}
        downloadCsv={(filename, csv) => handed.push([filename, csv])}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /export/i }));

    expect(handed).toHaveLength(1);
    expect(handed[0][0]).toBe("expenses-2026-08-04.csv");
    expect(handed[0][1]).toBe(expensesToCsv(SAMPLE as never));
  });
});
