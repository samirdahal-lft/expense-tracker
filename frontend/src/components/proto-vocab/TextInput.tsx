import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

/** Mirrors AddExpenseForm.tsx's labeled-input pattern (inputClass + label). */
export function TextInput({ label, id, className, ...rest }: TextInputProps) {
  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        className={cn(
          "w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring",
          className,
        )}
        {...rest}
      />
    </div>
  );
}
