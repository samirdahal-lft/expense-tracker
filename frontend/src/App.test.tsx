import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

// Toolchain sanity check — proves Vitest + Testing Library render the shell.
// Not a product test (this task is Tests: N/A — scaffolding).
describe("App shell", () => {
  it("renders the app title", () => {
    render(<App />);
    expect(screen.getByText("Expense Tracker")).toBeInTheDocument();
  });
});
