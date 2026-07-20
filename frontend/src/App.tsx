import { cn } from "@/lib/utils";

/**
 * Application shell. Feature tasks mount the add-expense form, the expense
 * list, and the category summary here; the theme toggle arrives with T-006.
 * This scaffold renders a titled, card-based frame so the app boots visibly.
 */
export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container max-w-5xl py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">Expense Tracker</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track what you spend, in NPR.
          </p>
        </header>
        <main
          className={cn(
            "rounded-lg border bg-card p-8 shadow-sm",
            "text-card-foreground",
          )}
        >
          <p className="text-muted-foreground">Setup complete — features coming next.</p>
        </main>
      </div>
    </div>
  );
}
