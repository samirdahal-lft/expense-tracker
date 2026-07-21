import "@testing-library/jest-dom/vitest";

// Recharts' ResponsiveContainer uses ResizeObserver, which jsdom does not provide.
// A no-op polyfill lets charts mount in tests (they render at 0×0; tests assert the
// surrounding totals/labels, not the SVG geometry).
if (!("ResizeObserver" in globalThis)) {
  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  (globalThis as unknown as { ResizeObserver: unknown }).ResizeObserver = ResizeObserver;
}
