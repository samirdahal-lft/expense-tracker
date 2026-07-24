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

/** Payload to create an expense. Amount is an integer number of whole NPR. */
export interface ExpenseInput {
  amount: number;
  category: Category;
  date: string;
  note?: string;
}

/** Create an expense; resolves to the created resource. */
export function createExpense(input: ExpenseInput): Promise<Expense> {
  return apiFetch<Expense>("/expenses", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

/** Delete an expense by id. */
export function deleteExpense(id: number): Promise<void> {
  return apiFetch<void>(`/expenses/${id}`, { method: "DELETE" });
}

export interface CategoryTotal {
  category: Category;
  total: number; // whole NPR
}

export interface Summary {
  total: number; // whole NPR
  by_category: CategoryTotal[];
}

/** Fetch the per-category spend summary. */
export function getSummary(): Promise<Summary> {
  return apiFetch<Summary>("/summary");
}

// ── Auth ──────────────────────────────────────────────────────────────────

/** The current account's public identity (never the password/verifier). */
export interface AuthUser {
  id: number;
  name: string;
  email: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

/** Pull a human-readable message out of a FastAPI error response body. */
async function errorDetail(resp: Response): Promise<string> {
  try {
    const body = (await resp.json()) as { detail?: unknown };
    const d = body?.detail;
    if (typeof d === "string") return d;
    if (Array.isArray(d) && typeof (d[0] as { msg?: unknown })?.msg === "string") {
      return (d[0] as { msg: string }).msg;
    }
  } catch {
    /* non-JSON body */
  }
  return `Request failed (${resp.status})`;
}

/**
 * Register a new account. On success the backend sets the session cookie and
 * returns the account. On failure (e.g. duplicate email) throws an Error whose
 * message is the server's detail, so the form can surface it.
 */
export async function register(input: RegisterInput): Promise<AuthUser> {
  const resp = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: input.name,
      email: input.email,
      password: input.password,
      confirm_password: input.confirmPassword,
    }),
  });
  if (!resp.ok) {
    throw new Error(await errorDetail(resp));
  }
  return (await resp.json()) as AuthUser;
}

export interface LoginInput {
  email: string;
  password: string;
}

/**
 * Log in with email and password. On success the backend sets the session cookie
 * and returns the account. On failure (e.g. invalid credentials) throws an Error
 * whose message is the server's detail, so the form can surface it.
 */
export async function login(input: LoginInput): Promise<AuthUser> {
  const resp = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!resp.ok) {
    throw new Error(await errorDetail(resp));
  }
  return (await resp.json()) as AuthUser;
}

/** The currently-authenticated account, or null if there is no valid session. */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const resp = await fetch(`${API_BASE}/auth/me`);
  if (resp.status === 401) {
    return null;
  }
  if (!resp.ok) {
    throw new Error(`auth/me failed: ${resp.status}`);
  }
  return (await resp.json()) as AuthUser;
}

/** Log out the current session. */
export async function logout(): Promise<void> {
  const resp = await fetch(`${API_BASE}/auth/logout`, { method: "POST" });
  if (!resp.ok) {
    throw new Error(`logout failed: ${resp.status}`);
  }
}
