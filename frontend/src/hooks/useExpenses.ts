import { useCallback, useEffect, useState } from "react";
import { type Expense, listExpenses } from "@/api/client";

interface UseExpenses {
  expenses: Expense[];
  loading: boolean;
  error: string | null;
  reload: () => void;
}

/** Loads the expense list and exposes loading/error state. `reload` refetches. */
export function useExpenses(): UseExpenses {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    listExpenses()
      .then((data) => setExpenses(data))
      .catch((e: unknown) => setError(e instanceof Error ? e.message : "Failed to load expenses"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { expenses, loading, error, reload: load };
}
