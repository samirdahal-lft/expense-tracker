import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost";
}

/**
 * Mirrors the two button styles already in use: the primary submit button
 * (AddExpenseForm.tsx) and the icon/ghost button (ThemeToggle.tsx).
 */
export function Button({ variant = "primary", className, children, ...rest }: ButtonProps) {
  const base = "inline-flex h-10 items-center justify-center rounded-md text-sm font-medium transition-colors disabled:opacity-50";
  const styles =
    variant === "primary"
      ? "bg-primary px-4 text-primary-foreground shadow-sm hover:opacity-90"
      : "border border-border bg-card px-4 text-foreground shadow-sm hover:bg-secondary";
  return (
    <button className={cn(base, styles, className)} {...rest}>
      {children}
    </button>
  );
}
