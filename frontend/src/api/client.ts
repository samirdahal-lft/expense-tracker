/**
 * Typed API client — the single module through which components (via hooks)
 * reach the backend. Feature tasks implement the request bodies; this scaffold
 * fixes the shared types and the fetch wrapper so nothing scatters raw fetches.
 */

export const CATEGORIES = ["Food", "Transport", "Bills", "Other"] as const;
export type Category = (typeof CATEGORIES)[number];

/** Amount is whole Nepalese Rupees (NPR) — an integer, never a float. */
export interface Expense {
  id: number;
  amount: number;
  category: Category;
  date: string; // YYYY-MM-DD
  note?: string;
  created_at: string; // ISO-8601 UTC
}

const API_BASE = "/api";

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const resp = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!resp.ok) {
    throw new Error(`API ${init?.method ?? "GET"} ${path} failed: ${resp.status}`);
  }
  if (resp.status === 204) {
    return undefined as T;
  }
  return (await resp.json()) as T;
}

/** Fetch all expenses, most recent first. */
export function listExpenses(): Promise<Expense[]> {
  return apiFetch<Expense[]>("/expenses");
}
