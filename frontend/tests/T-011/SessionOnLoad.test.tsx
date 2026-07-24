import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "../../src/App";

/**
 * AC-4 (non-functional) guard: on load the app shows the authenticated dashboard
 * when a valid session exists and the Login/Register screen otherwise (the
 * session survives a page reload — each mount re-derives state from /auth/me).
 * The unauthenticated screen links to Register/Login.
 */
describe("AC-4: auth state on load (session survives reload)", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  function stubFetch(sessionUser: { id: number; name: string; email: string } | null) {
    vi.stubGlobal(
      "fetch",
      vi.fn((url: string) => {
        if (url === "/api/auth/me") {
          return sessionUser
            ? Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(sessionUser) })
            : Promise.resolve({ ok: false, status: 401, json: () => Promise.resolve(null) });
        }
        if (url.endsWith("/summary")) {
          return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({ total: 0, by_category: [] }) });
        }
        return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve([]) });
      }),
    );
  }

  it("renders the dashboard on load when a valid session exists (survives reload)", async () => {
    stubFetch({ id: 1, name: "Ada", email: "ada@example.com" });
    render(<App />);
    expect(await screen.findByText("Add an expense")).toBeInTheDocument();
  });

  it("renders the Login/Register screen on load when there is no session", async () => {
    stubFetch(null);
    render(<App />);
    // Unauthenticated view: the account-creation screen, which links to sign in.
    expect(await screen.findByText("Create your account")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /already have an account\? sign in/i })).toBeInTheDocument();
    // The dashboard is not rendered.
    await waitFor(() => expect(screen.queryByText("Add an expense")).not.toBeInTheDocument());
  });
});
