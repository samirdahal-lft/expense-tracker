import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "@/App";

/**
 * B-1: Submitting the Login form with valid credentials transitions the app
 * from the unauthenticated view (Login/Register) to the authenticated dashboard.
 */
describe("B-1: Login transition to dashboard", () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("submitting the Login form with valid credentials shows the dashboard", async () => {
    // Mock the login API to succeed
    const mockFetch = vi.fn((_url: string, init?: RequestInit) => {
      const method = init?.method ?? "GET";
      if (_url.includes("/api/auth/login") && method === "POST") {
        // Successful login response sets session cookie
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () =>
            Promise.resolve({
              user_id: "user-123",
              email: "test@example.com",
              name: "Test User",
            }),
        });
      }
      return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve([]) });
    });
    vi.stubGlobal("fetch", mockFetch);

    render(<App />);

    // Initially, the unauthenticated view (Login screen) is shown
    const loginScreen = await screen.findByRole("heading", { name: /sign in/i });
    expect(loginScreen).toBeInTheDocument();

    // Fill in the login form with valid credentials
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "password123" } });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /sign in|log in/i }));

    // After successful login, the authenticated dashboard appears
    expect(await screen.findByRole("heading", { name: /expense tracker/i })).toBeInTheDocument();
    // Dashboard should show expenses or a "no expenses" message
    expect(
      await screen.findByText(/no expenses yet|expense|category|amount/i)
    ).toBeInTheDocument();
  });
});
