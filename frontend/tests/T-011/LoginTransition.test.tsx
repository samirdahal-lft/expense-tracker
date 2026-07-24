import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "../../src/App";

/**
 * B-1 (tracer bullet): submitting the Login form with valid credentials
 * transitions the app from the unauthenticated view (Login/Register) to the
 * authenticated dashboard.
 *
 * Uses the codebase's fetch-stub pattern (see src/App.test.tsx): the real
 * useAuth hook drives the session, and fetch is stubbed so /auth/me starts
 * unauthenticated, /auth/login succeeds, and the dashboard's data endpoints
 * return empty once mounted.
 */
describe("B-1: Login transition to dashboard", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("submitting the Login form with valid credentials shows the dashboard", async () => {
    const user = { id: 1, name: "Ada", email: "ada@example.com" };

    // Session starts unauthenticated (/auth/me → 401); login succeeds and
    // establishes the session; dashboard data endpoints return empty.
    vi.stubGlobal(
      "fetch",
      vi.fn((url: string, init?: RequestInit) => {
        const method = init?.method ?? "GET";
        if (url === "/api/auth/me") {
          return Promise.resolve({ ok: false, status: 401, json: () => Promise.resolve(null) });
        }
        if (url === "/api/auth/login" && method === "POST") {
          return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(user) });
        }
        if (url.endsWith("/summary")) {
          return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({ total: 0, by_category: [] }) });
        }
        return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve([]) });
      }),
    );

    render(<App />);

    // Unauthenticated: the app opens on Register; switch to the Login screen.
    fireEvent.click(await screen.findByRole("button", { name: /already have an account\? sign in/i }));

    // Login screen is shown.
    const emailInput = await screen.findByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: "ada@example.com" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "password123" } });

    // Submit valid credentials.
    fireEvent.click(screen.getByRole("button", { name: /^sign in$/i }));

    // The app transitions to the authenticated dashboard.
    await waitFor(() => expect(screen.getByText("Add an expense")).toBeInTheDocument());
    expect(screen.getByRole("button", { name: /sign out/i })).toBeInTheDocument();
  });
});
