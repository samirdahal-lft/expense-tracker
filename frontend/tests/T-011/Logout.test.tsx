import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "../../src/App";

/**
 * B-3: triggering logout from the authenticated view returns the app to the
 * Login/Register screen with no confirmation step.
 *
 * fetch is stubbed so the session starts authenticated (/auth/me returns a
 * user); the logout endpoint succeeds; and once logged out a fresh /auth/me
 * would report unauthenticated. There is no confirmation dialog — a single
 * click ends the session.
 */
describe("B-3: logout returns to the Login/Register screen", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("clicking Sign out ends the session with no confirmation and shows the unauthenticated screen", async () => {
    const user = { id: 1, name: "Ada", email: "ada@example.com" };

    vi.stubGlobal(
      "fetch",
      vi.fn((url: string, init?: RequestInit) => {
        const method = init?.method ?? "GET";
        if (url === "/api/auth/me") {
          return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(user) });
        }
        if (url === "/api/auth/logout" && method === "POST") {
          return Promise.resolve({ ok: true, status: 204, json: () => Promise.resolve(null) });
        }
        if (url.endsWith("/summary")) {
          return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({ total: 0, by_category: [] }) });
        }
        return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve([]) });
      }),
    );

    render(<App />);

    // Authenticated: the dashboard is shown.
    expect(await screen.findByText("Add an expense")).toBeInTheDocument();
    const signOut = screen.getByRole("button", { name: /sign out/i });

    // A single click ends the session — no confirmation dialog appears.
    fireEvent.click(signOut);

    // The app returns to the unauthenticated view (Register/Login).
    await waitFor(() => expect(screen.queryByText("Add an expense")).not.toBeInTheDocument());
    // The unauthenticated view is shown — the "Sign out" affordance is gone and
    // the account-creation screen (with its switch-to-Login link) is back.
    expect(screen.queryByRole("button", { name: /sign out/i })).not.toBeInTheDocument();
    expect(screen.getByText("Create your account")).toBeInTheDocument();
  });
});
