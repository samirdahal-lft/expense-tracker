import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { type Summary } from "@/api/client";
import { formatNpr } from "@/lib/format";

interface CategorySummaryProps {
  summary: Summary | null;
  loading: boolean;
  error: string | null;
}

/** Accent-derived palette per category (kept in-file; T-006 makes it theme-aware). */
const CATEGORY_COLOR: Record<string, string> = {
  Food: "#10b981",
  Transport: "#3b82f6",
  Bills: "#f59e0b",
  Other: "#8b5cf6",
};

/** Per-category spend: a donut chart with the totals listed alongside; empty state when zero. */
export function CategorySummary({ summary, loading, error }: CategorySummaryProps) {
  const isEmpty = !summary || !summary.total;
  const byCategory = summary?.by_category ?? [];
  const grandTotal = summary?.total ?? 0;

  return (
    <section
      aria-label="Spending by category"
      className="rounded-lg border bg-card p-6 shadow-sm text-card-foreground"
    >
      <h2 className="mb-4 text-lg font-medium">Spending by category</h2>

      {loading ? (
        <p className="py-12 text-center text-muted-foreground">Loading summary…</p>
      ) : error ? (
        <p className="py-12 text-center text-destructive">Couldn’t load summary. {error}</p>
      ) : isEmpty ? (
        <div className="py-12 text-center text-muted-foreground">
          <p className="text-base font-medium">Nothing to summarize yet</p>
          <p className="mt-1 text-sm">Add an expense to see where your money goes.</p>
        </div>
      ) : (
        <div className="grid items-center gap-6 sm:grid-cols-[220px_1fr]">
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={byCategory.filter((c) => c.total > 0)}
                  dataKey="total"
                  nameKey="category"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                >
                  {byCategory
                    .filter((c) => c.total > 0)
                    .map((c) => (
                      <Cell key={c.category} fill={CATEGORY_COLOR[c.category]} />
                    ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <ul className="space-y-2">
            {byCategory.map((c) => (
              <li key={c.category} className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-2 text-sm">
                  <span
                    className="inline-block h-3 w-3 rounded-sm"
                    style={{ backgroundColor: CATEGORY_COLOR[c.category] }}
                    aria-hidden
                  />
                  {c.category}
                </span>
                <span className="font-semibold tabular-nums">{formatNpr(c.total)}</span>
              </li>
            ))}
            <li className="flex items-center justify-between gap-4 border-t border-border pt-2 text-sm font-medium">
              <span>Total</span>
              <span className="font-semibold tabular-nums">{formatNpr(grandTotal)}</span>
            </li>
          </ul>
        </div>
      )}
    </section>
  );
}
