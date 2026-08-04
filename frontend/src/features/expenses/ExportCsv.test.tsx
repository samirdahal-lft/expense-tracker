import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "@/App";
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

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  vi.setSystemTime(new Date("2026-08-04T12:00:00Z"));
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
    await screen.findByRole("list"); // expenses loaded

    fireEvent.click(screen.getByRole("button", { name: /export/i }));

    await waitFor(() => expect(offered).toHaveLength(1));
    expect(offered[0].filename).toBe("expenses-2026-08-04.csv");
    await expect(offered[0].blob.text()).resolves.toContain(expensesToCsv(SAMPLE as never));

    // the user is told it worked
    const status = await screen.findByRole("status");
    expect(status.textContent).toMatch(/export/i);

    // AC-8: read-only — the export issued no write
    expect(calls.filter((c) => c.method !== "GET")).toHaveLength(0);
  });
});
