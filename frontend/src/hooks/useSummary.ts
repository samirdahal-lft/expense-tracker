import { useCallback, useEffect, useState } from "react";
import { getSummary, type Summary } from "@/api/client";

interface UseSummary {
  summary: Summary | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
}

/** Loads the per-category summary and exposes loading/error state. `reload` refetches. */
export function useSummary(): UseSummary {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    getSummary()
      .then((data) => setSummary(data))
      .catch((e: unknown) => setError(e instanceof Error ? e.message : "Failed to load summary"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { summary, loading, error, reload: load };
}
