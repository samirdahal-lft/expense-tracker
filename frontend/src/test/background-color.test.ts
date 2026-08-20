import { readFileSync } from "fs";
import { resolve } from "path";
import { describe, expect, it } from "vitest";

const css = readFileSync(resolve(__dirname, "../index.css"), "utf-8");

describe("background color CSS variables (0003)", () => {
  it("light mode --background is 30 20% 97%", () => {
    // :root block must contain the new warm off-white value
    const rootBlock = css.match(/:root\s*\{([^}]+)\}/)?.[1] ?? "";
    expect(rootBlock).toContain("--background: 30 20% 97%");
  });

  it("dark mode --background is 220 13% 10%", () => {
    // .dark block must contain the new soft dark neutral value
    const darkBlock = css.match(/\.dark\s*\{([^}]+)\}/)?.[1] ?? "";
    expect(darkBlock).toContain("--background: 220 13% 10%");
  });

  it("no other CSS variables changed", () => {
    // Spot-check a sample of invariants that must be untouched
    expect(css).toContain("--foreground: 222 47% 11%");
    expect(css).toContain("--primary: 160 84% 39%");
    expect(css).toContain("--card: 0 0% 100%");
  });
});
