import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "../../src/App";

/**
 * B-4 (AC-5 e2e): a user with an existing account logs in via the Login screen,
 * sees their own prior expenses, logs out, and is returned to the Login/Register
 * screen.
 *
 * This drives the full sequence at the component level with a stubbed backend
 * (session starts unauthenticated; login succeeds and the account owns prior
 * expenses; logout ends the session). The true smoke test runs against the
 * running stack out-of-band per the exec-plan Boundaries.
 */
describe("B-4: full login → see own expenses → logout flow", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("logs in, shows the account's own prior expenses, then logs out back to Login/Register", async () => {
    const user = { id: 1, name: "Ada", email: "ada@example.com" };
    // The account's own prior expenses, returned once authenticated.
    const priorExpenses = [
      { id: 7, amount: 1500, category: "Transport", date: "2026-07-06", created_at: "2026-07-06T10:00:00Z", note: null },
    ];
    let authenticated = false;

    vi.stubGlobal(
      "fetch",
      vi.fn((url: string, init?: RequestInit) => {
        const method = init?.method ?? "GET";
        if (url === "/api/auth/me") {
          return authenticated
            ? Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(user) })
            : Promise.resolve({ ok: false, status: 401, json: () => Promise.resolve(null) });
        }
        if (url === "/api/auth/login" && method === "POST") {
          authenticated = true;
          return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(user) });
        }
        if (url === "/api/auth/logout" && method === "POST") {
          authenticated = false;
          return Promise.resolve({ ok: true, status: 204, json: () => Promise.resolve(null) });
        }
        if (url.endsWith("/summary")) {
          return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({ total: 1500, by_category: [{ category: "Transport", total: 1500 }] }) });
        }
        // /expenses — the account's own rows
        return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(priorExpenses) });
      }),
    );

    render(<App />);

    // Unauthenticated: switch to the Login screen and sign in.
    fireEvent.click(await screen.findByRole("button", { name: /already have an account\? sign in/i }));
    fireEvent.change(await screen.findByLabelText(/email/i), { target: { value: "ada@example.com" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "password123" } });
    fireEvent.click(screen.getByRole("button", { name: /^sign in$/i }));

    // Authenticated dashboard shows the account's own prior expenses. The
    // Delete affordance's aria-label is unique to a row in the expense list,
    // so it pins the assertion to the list (not the category-summary legend).
    expect(await screen.findByText("Add an expense")).toBeInTheDocument();
    expect(
      await screen.findByRole("button", { name: /delete transport expense of/i }),
    ).toBeInTheDocument();

    // Log out — returns to the unauthenticated Login/Register screen (the user
    // arrived via Login, so the Login screen is shown; the dashboard is gone).
    fireEvent.click(screen.getByRole("button", { name: /sign out/i }));
    await waitFor(() => expect(screen.queryByText("Add an expense")).not.toBeInTheDocument());
    expect(screen.queryByRole("button", { name: /sign out/i })).not.toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^sign in$/i })).toBeInTheDocument();
  });
});
