import { Moon, Sun } from "lucide-react";
import { type Theme } from "@/hooks/useTheme";

interface ThemeToggleProps {
  theme: Theme;
  onToggle: () => void;
}

/** Accessible light/dark toggle; the label states the action it will perform. */
export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const goingDark = theme === "light";
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={goingDark ? "Switch to dark mode" : "Switch to light mode"}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm transition-colors hover:bg-secondary"
    >
      {goingDark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
    </button>
  );
}
