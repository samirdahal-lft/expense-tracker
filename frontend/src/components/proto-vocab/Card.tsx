import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: ReactNode;
  className?: string;
}

/** Mirrors the card surface used across App.tsx sections (rounded, subtle shadow). */
export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-card p-6 shadow-sm text-card-foreground",
        className,
      )}
    >
      {children}
    </div>
  );
}
