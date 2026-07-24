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
    // Authenticated session: /auth/me returns a user so the app renders the dashboard.
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
    render(<App />);
    expect(await screen.findByText("Expense Tracker")).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText(/no expenses yet/i)).toBeInTheDocument());
  });
});
