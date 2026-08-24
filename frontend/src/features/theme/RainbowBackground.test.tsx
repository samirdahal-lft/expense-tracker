import { render } from "@testing-library/react";
import { vi } from "vitest";
import { describe, it, expect, afterEach } from "vitest";
import App from "@/App";

// B-1: Root <div> must carry the animated rainbow gradient background class.
describe("Rainbow background", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("root div has the rainbow-bg class applied", () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve([]) })),
    );
    const { container } = render(<App />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.classList.contains("rainbow-bg")).toBe(true);
  });
});
