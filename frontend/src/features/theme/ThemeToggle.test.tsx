import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "@/App";

function stubEmptyApi() {
  vi.stubGlobal(
    "fetch",
    vi.fn((url: string) => {
      const body =
        url === "/api/auth/me"
          ? { id: 1, name: "Ada", email: "ada@example.com" }
          : url.endsWith("/summary")
            ? { total: 0, by_category: [] }
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

describe("B-1: theme toggle + persistence", () => {
  it("toggles light↔dark and persists the choice across a reload", async () => {
    stubEmptyApi();
    const { unmount } = render(<App />);

    // default light
    expect(document.documentElement.classList.contains("dark")).toBe(false);

    fireEvent.click(await screen.findByRole("button", { name: /theme|dark mode|light mode/i }));

    // now dark, and stored
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(localStorage.getItem("theme")).toBe("dark");

    // simulate a page reload: unmount and mount a fresh App
    unmount();
    document.documentElement.classList.remove("dark"); // reset DOM; the app should re-apply from storage
    render(<App />);

    // wait for the dashboard to re-mount (past the auth bootstrap) before asserting
    await screen.findByRole("button", { name: /theme|dark mode|light mode/i });
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });
});
