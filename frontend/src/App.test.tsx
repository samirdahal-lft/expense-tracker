import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "./App";

// Shell sanity: the app renders its title. App loads the list on mount, so we
// stub fetch (empty list) and let the async state settle to avoid act() noise.
describe("App shell", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("renders the app title", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve([]) })),
    );
    render(<App />);
    expect(screen.getByText("Expense Tracker")).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText(/no expenses yet/i)).toBeInTheDocument());
  });
});
