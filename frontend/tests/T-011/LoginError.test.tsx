import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "../../src/App";

/**
 * B-2: a failed login surfaces the generic invalid-credentials error on the
 * form; the app stays on the Login screen.
 *
 * fetch is stubbed so /auth/me starts unauthenticated and /auth/login returns a
 * 401 with a generic invalid-credentials detail (the backend never reveals
 * whether the email or the password was wrong).
 */
describe("B-2: failed login shows error and stays on Login", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("surfaces the generic error and does not transition to the dashboard", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn((url: string, init?: RequestInit) => {
        const method = init?.method ?? "GET";
        if (url === "/api/auth/me") {
          return Promise.resolve({ ok: false, status: 401, json: () => Promise.resolve(null) });
        }
        if (url === "/api/auth/login" && method === "POST") {
          return Promise.resolve({
            ok: false,
            status: 401,
            json: () => Promise.resolve({ detail: "Invalid email or password." }),
          });
        }
        return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve([]) });
      }),
    );

    render(<App />);

    // Switch to the Login screen.
    fireEvent.click(await screen.findByRole("button", { name: /already have an account\? sign in/i }));

    const emailInput = await screen.findByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: "wrong@example.com" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "badpassword" } });

    fireEvent.click(screen.getByRole("button", { name: /^sign in$/i }));

    // The generic invalid-credentials error is surfaced on the form.
    await waitFor(() => expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument());

    // The app stays on the Login screen — the dashboard's add form never appears.
    expect(screen.queryByText("Add an expense")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^sign in$/i })).toBeInTheDocument();
  });
});
