import { readFileSync } from "fs";
import { resolve } from "path";
import { describe, expect, it } from "vitest";

const css = readFileSync(resolve(__dirname, "../index.css"), "utf-8");

describe("button color CSS variables (0008)", () => {
  it("light mode --primary is pink (hue 330)", () => {
    const rootBlock = css.match(/:root\s*\{([^}]+)\}/)?.[1] ?? "";
    expect(rootBlock).toMatch(/--primary:\s*330\s/);
  });

  it("dark mode --primary is pink (hue 330)", () => {
    const darkBlock = css.match(/\.dark\s*\{([^}]+)\}/)?.[1] ?? "";
    expect(darkBlock).toMatch(/--primary:\s*330\s/);
  });

  it("no other CSS variables changed by this patch", () => {
    expect(css).toContain("--foreground: 222 47% 11%");
    expect(css).toContain("--background: 30 20% 97%");
    expect(css).toContain("--card: 0 0% 100%");
  });
});
