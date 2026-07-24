/** Off-ledger backfill: behaviors implemented within B-1's RegisterForm commit
 * (success transition, server-error surfacing, loading state + Sign in link),
 * tested after the code. Kept in a separate file from the proven B-1 ledger test. */
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { RegisterForm } from "./RegisterForm";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

function fill({ name = "Ada", email = "ada@example.com", password = "hunter2pw", confirm = "hunter2pw" } = {}) {
  fireEvent.change(screen.getByLabelText("Name"), { target: { value: name } });
  fireEvent.change(screen.getByLabelText("Email"), { target: { value: email } });
  fireEvent.change(screen.getByLabelText("Password"), { target: { value: password } });
  fireEvent.change(screen.getByLabelText("Confirm password"), { target: { value: confirm } });
}

function submit() {
  fireEvent.click(screen.getByRole("button", { name: /create account/i }));
}

describe("B-2 (backfill): valid submission registers and transitions", () => {
  it("calls register with the entered account and invokes onAuthenticated on success", async () => {
    const user = { id: 1, name: "Ada", email: "ada@example.com" };
    const fetchSpy = vi.fn(() => Promise.resolve({ ok: true, status: 201, json: () => Promise.resolve(user) }));
    vi.stubGlobal("fetch", fetchSpy);
    const onAuthenticated = vi.fn();
    render(<RegisterForm onAuthenticated={onAuthenticated} onSwitchToLogin={() => {}} />);

    fill();
    submit();

    await waitFor(() => expect(onAuthenticated).toHaveBeenCalledWith(user));
    expect(fetchSpy).toHaveBeenCalledWith("/api/auth/register", expect.objectContaining({ method: "POST" }));
    const call = fetchSpy.mock.calls[0] as unknown as [string, RequestInit];
    const body = JSON.parse(call[1].body as string);
    expect(body).toMatchObject({
      name: "Ada",
      email: "ada@example.com",
      password: "hunter2pw",
      confirm_password: "hunter2pw",
    });
  });
});

describe("B-3 (backfill): a server rejection is surfaced; no transition", () => {
  it("shows the server error and does not call onAuthenticated", async () => {
    const fetchSpy = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 409,
        json: () => Promise.resolve({ detail: "An account with this email already exists" }),
      }),
    );
    vi.stubGlobal("fetch", fetchSpy);
    const onAuthenticated = vi.fn();
    render(<RegisterForm onAuthenticated={onAuthenticated} onSwitchToLogin={() => {}} />);

    fill();
    submit();

    expect(await screen.findByText(/already exists/i)).toBeInTheDocument();
    expect(onAuthenticated).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: /create account/i })).toBeInTheDocument();
  });
});

describe("B-4 (backfill): loading state + Sign in link", () => {
  it("disables submit while in flight and links to the Login screen", async () => {
    let resolveFetch: (v: unknown) => void = () => {};
    const fetchSpy = vi.fn(() => new Promise((r) => { resolveFetch = r; }));
    vi.stubGlobal("fetch", fetchSpy);
    const onSwitchToLogin = vi.fn();
    render(<RegisterForm onAuthenticated={() => {}} onSwitchToLogin={onSwitchToLogin} />);

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));
    expect(onSwitchToLogin).toHaveBeenCalled();

    fill();
    submit();
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /creating account/i })).toBeDisabled(),
    );

    resolveFetch({ ok: true, status: 201, json: () => Promise.resolve({ id: 1, name: "Ada", email: "ada@example.com" }) });
  });
});
