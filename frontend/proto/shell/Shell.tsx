import type { ReactNode } from "react";

interface ShellProps {
  children: ReactNode;
}

/**
 * Mirrors the real app's outer page frame (frontend/src/App.tsx: the
 * min-h-screen background + centered max-w-5xl container). This app has no
 * persistent nav/sidebar — every screen (auth or authenticated) sits in this
 * same background + container frame, matching the real product exactly.
 */
export function Shell({ children }: ShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container max-w-5xl py-10">{children}</div>
    </div>
  );
}
