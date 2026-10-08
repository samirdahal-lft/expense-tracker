import { test, expect, Page } from "@playwright/test";

// TC-01 (S-0005.01) — covers S-0002.01 AC-6.
// Change amount and category, list updates without a reload.

const API = "http://localhost:8000/api/expenses";
const NOTE = "tc01-lunch";

const expenseRow = (page: Page) =>
  page
    .locator("li, tr, article, [role=listitem], [role=row]")
    .filter({ hasText: NOTE })
    .last();

test("TC-01: change amount and category, list updates without a reload", async ({
  page,
  request,
}) => {
  // Precondition: the test creates its own expense through the public API.
  const created = await request.post(API, {
    data: { amount: 500, category: "Food", date: "2026-09-10", note: NOTE },
  });
  expect(created.ok()).toBeTruthy();

  await test.step('Given the expense list is open and shows the "tc01-lunch" expense with amount 500 and category Food', async () => {
    await page.goto("/");
    const row = expenseRow(page);
    await expect(row).toBeVisible();
    await expect(row).toContainText("500");
    await expect(row).toContainText("Food");
  });

  await test.step("When the user opens edit on that expense, changes the amount to 750 and the category to Transport, and saves", async () => {
    // Marker set before saving: it only survives if the page is not reloaded.
    await page.evaluate(() => {
      (window as any).__noReloadMarker = "set-before-save";
    });
    await expenseRow(page).getByRole("button", { name: /edit/i }).click();
    const form = page
      .locator("form")
      .filter({ has: page.getByRole("button", { name: /save/i }) });
    await form.getByLabel(/amount/i).fill("750");
    await form.getByLabel(/category/i).selectOption("Transport");
    await form.getByRole("button", { name: /save/i }).click();
  });

  await test.step('Then the "tc01-lunch" row in the list shows amount 750 and category Transport, and the page was not reloaded', async () => {
    const row = expenseRow(page);
    await expect(row).toContainText("750");
    await expect(row).toContainText("Transport");
    const marker = await page.evaluate(() => (window as any).__noReloadMarker);
    expect(marker).toBe("set-before-save");
  });
});
