import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "@/App";

function stubApiWithSummary() {
  vi.stubGlobal(
    "fetch",
    vi.fn((url: string) => {
      const body = url.endsWith("/summary")
        ? {
            total: 4000,
            by_category: [
              { category: "Food", total: 1500 },
              { category: "Transport", total: 2500 },
              { category: "Bills", total: 0 },
              { category: "Other", total: 0 },
            ],
          }
        : [];
      return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(body) });
    }),
  );
}

beforeEach(() => {
  localStorage.clear();
  document.documentElement.classList.remove("dark");
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  localStorage.clear();
  document.documentElement.classList.remove("dark");
});

describe("B-2 (e2e): theme applies app-wide and the summary renders in both modes", () => {
  it("toggles dark then back to light; the summary/donut region stays rendered throughout", async () => {
    stubApiWithSummary();
    render(<App />);

    // summary region present in light mode
    expect(await screen.findByRole("region", { name: /spending by category/i })).toBeInTheDocument();
    expect(document.documentElement.classList.contains("dark")).toBe(false);

    const toggle = screen.getByRole("button", { name: /dark mode|light mode/i });

    fireEvent.click(toggle); // → dark
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(screen.getByRole("region", { name: /spending by category/i })).toBeInTheDocument();

    fireEvent.click(toggle); // → light
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(screen.getByRole("region", { name: /spending by category/i })).toBeInTheDocument();
  });
});
