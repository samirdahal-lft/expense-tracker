import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "@/App";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

/** Routes fetch by path: unauthenticated bootstrap, then a successful register, then
 * an empty dashboard. */
function routedFetch() {
  return vi.fn((url: string, init?: RequestInit) => {
    const method = init?.method ?? "GET";
    if (url === "/api/auth/me") {
      return Promise.resolve({ ok: false, status: 401, json: () => Promise.resolve({ detail: "Not authenticated" }) });
    }
    if (url === "/api/auth/register" && method === "POST") {
      return Promise.resolve({ ok: true, status: 201, json: () => Promise.resolve({ id: 1, name: "Ada", email: "ada@example.com" }) });
    }
    if (url === "/api/summary") {
      return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({ total: 0, by_category: [] }) });
    }
    // /api/expenses and anything else
    return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve([]) });
  });
}

describe("B-5 (e2e): unauthenticated user registers and lands on the dashboard", () => {
  it("shows Register when logged out, then the dashboard after a successful registration", async () => {
    vi.stubGlobal("fetch", routedFetch());
    render(<App />);

    // bootstrap resolves to no session → the Register screen is shown
    expect(await screen.findByText(/create your account/i)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Ada" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "ada@example.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "hunter2pw" } });
    fireEvent.change(screen.getByLabelText("Confirm password"), { target: { value: "hunter2pw" } });
    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    // lands on the authenticated dashboard (empty state)
    expect(await screen.findByText(/no expenses yet/i)).toBeInTheDocument();
    // the Register screen is gone
    expect(screen.queryByText(/create your account/i)).not.toBeInTheDocument();
  });
});
