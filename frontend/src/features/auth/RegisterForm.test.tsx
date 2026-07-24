import { fireEvent, render, screen } from "@testing-library/react";
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

describe("B-1: RegisterForm client validation", () => {
  it("blocks submission and shows a message; never calls the API or transitions", () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);
    const onAuthenticated = vi.fn();
    render(<RegisterForm onAuthenticated={onAuthenticated} onSwitchToLogin={() => {}} />);

    // confirmation mismatch
    fill({ confirm: "different9" });
    submit();
    expect(screen.getByText(/match/i)).toBeInTheDocument();

    // password shorter than 8 chars
    fill({ password: "short7!", confirm: "short7!" });
    submit();
    expect(screen.getByText(/8 characters/i)).toBeInTheDocument();

    // an empty required field
    fill({ name: "" });
    submit();
    expect(screen.getByText(/required|fill in/i)).toBeInTheDocument();

    // no network request was sent and no authenticated transition happened
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(onAuthenticated).not.toHaveBeenCalled();
  });
});
