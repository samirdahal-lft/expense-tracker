/**
 * TC-06 — Expense retains its original created_at after an edit
 * Covers: S-0002.01 AC-2
 *
 * Creates a test expense via the API, records its created_at, edits the
 * amount through the UI, then asserts the API-returned created_at is
 * unchanged. Tears down after each test.
 */
import { test, expect, request as playwrightRequest } from "@playwright/test";

const BASE_URL = "http://localhost:8000";

interface Expense {
  id: number;
  amount: number;
  category: string;
  date: string;
  note: string | null;
  created_at: string;
}

test.describe("TC-06: expense created_at is preserved after an edit", () => {
  let expenseId: number;
  let originalCreatedAt: string;

  test.beforeEach(async () => {
    // Create a test expense via the API and capture its created_at.
    const api = await playwrightRequest.newContext({ baseURL: BASE_URL });
    const res = await api.post("/api/expenses", {
      data: { amount: 300, category: "Food", date: "2026-01-15", note: "tc-06 test" },
    });
    expect(res.ok()).toBeTruthy();
    const created: Expense = await res.json();
    expenseId = created.id;
    originalCreatedAt = created.created_at;
    await api.dispose();
  });

  test.afterEach(async () => {
    if (expenseId == null) return;
    const api = await playwrightRequest.newContext({ baseURL: BASE_URL });
    await api.delete(`/api/expenses/${expenseId}`);
    await api.dispose();
  });

  test("created_at returned by the API is unchanged after editing amount via the UI", async ({
    page,
    request,
  }) => {
    // Navigate to the expense list.
    await page.goto("/");

    // Click the Edit button for our test expense.
    // The edit button's aria-label encodes category and formatted amount: "Edit Food expense of Rs 300"
    await page.getByRole("button", { name: "Edit Food expense of Rs 300" }).click();

    // The edit form appears. Fill the amount field.
    const amountField = page.getByLabel("Amount (NPR)");
    await amountField.fill("450");

    // Submit the form.
    await page.getByRole("button", { name: "Save changes" }).click();

    // Wait for the list to reflect the updated amount — the edit button's label changes.
    await expect(
      page.getByRole("button", { name: "Edit Food expense of Rs 450" })
    ).toBeVisible();

    // Fetch all expenses from the API and locate our expense by id.
    const res = await request.get(`${BASE_URL}/api/expenses`);
    expect(res.ok()).toBeTruthy();
    const expenses: Expense[] = await res.json();
    const updated = expenses.find((e) => e.id === expenseId);

    expect(updated).toBeDefined();
    expect(updated!.created_at).toBe(originalCreatedAt);
  });
});
