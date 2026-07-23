interface ErrorTextProps {
  children: string;
}

/** Mirrors AddExpenseForm.tsx's inline error message style. */
export function ErrorText({ children }: ErrorTextProps) {
  return <p className="text-sm text-destructive">{children}</p>;
}
