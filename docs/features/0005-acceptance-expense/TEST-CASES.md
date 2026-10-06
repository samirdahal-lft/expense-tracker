---
approved_by: "Samir dahal"
approved_at: "2026-10-06"
approved_sha256: "589c7246348ed023aab145202f2fb605d931e4f5dbffea04ee68d195bb35f3f2"
---
# Test Cases 0005 — Edit an Expense (Acceptance)
> One `## TSD S-0005.nn — TC-nn` section per test case — each becomes ONE task card
> (`lane new card --story S-0005.nn`), and the Critic reviews the test against that section,
> frozen at `lane start`. The `0005` prefix resolves this folder, so the header must match the
> story id exactly. Black-box only: every expected result is observable through the UI or the
> public API — never through the code's internals.

---

## TSD S-0005.01 — TC-01: Edit form opens pre-filled with existing values
| Field | Value |
|-------|-------|
| Covers | S-0002.01 AC-1 |
| Priority | P1 |
| Automation | playwright |
| Preconditions / Test data | One expense exists with amount=500, category=Food, date=2026-01-15, note=Lunch. Created by the test via the app's create flow in beforeEach. |
| Steps (Given / When / Then) | Given the expense list is visible with the seeded expense / When the user opens the edit form for that expense / Then the amount field shows 500, the category shows Food, the date shows 2026-01-15, and the note shows Lunch — no field is blank or defaulted |
| Expected result | All four fields are pre-populated with the expense's current values. No field shows a placeholder or default when the expense has a value. |

---

## TSD S-0005.01 — TC-02: Edit form shows empty note when expense has no note
| Field | Value |
|-------|-------|
| Covers | S-0002.01 AC-1 |
| Priority | P1 |
| Automation | playwright |
| Preconditions / Test data | One expense exists with amount=200, category=Transport, date=2026-03-01, note absent (not set). Created by the test in beforeEach. |
| Steps (Given / When / Then) | Given the expense list shows the seeded expense / When the user opens the edit form for that expense / Then the note field is empty (not showing a previous value or placeholder text that would imply a value) |
| Expected result | The note field is empty. The other three fields are pre-populated correctly. |

---

## TSD S-0005.01 — TC-03: Saving valid changes persists them and survives a page reload
| Field | Value |
|-------|-------|
| Covers | S-0002.01 AC-2 |
| Priority | P1 |
| Automation | playwright |
| Preconditions / Test data | One expense exists: amount=300, category=Bills, date=2026-02-10, note=Electricity. Created in beforeEach. |
| Steps (Given / When / Then) | Given the edit form is open, pre-filled with the seeded expense / When the user changes amount to 450, category to Other, and submits / Then the expense list shows 450 and Other for that entry / And after a full page reload the same entry still shows 450 and Other / And the note (Electricity) and date (2026-02-10) are unchanged / And the expense's identity (same record) is preserved |
| Expected result | Updated amount and category are visible in the list immediately and after reload. Untouched fields (note, date) retain their original values. |

---

## TSD S-0005.01 — TC-04: created_at is unchanged after editing an expense
| Field | Value |
|-------|-------|
| Covers | S-0002.01 AC-2 |
| Priority | P1 |
| Automation | playwright |
| Preconditions / Test data | One expense exists. The test reads its `created_at` value from the UI or API response immediately after creation. |
| Steps (Given / When / Then) | Given the expense was created and its created_at recorded / When the user opens edit, changes the amount, and saves / Then the expense's created_at value (as observable via the UI or API) is identical to the value recorded before the edit |
| Expected result | created_at is unchanged. The edit did not reset or modify the creation timestamp. |

---

## TSD S-0005.01 — TC-05: Cancelling the edit form leaves the expense unchanged
| Field | Value |
|-------|-------|
| Covers | S-0002.01 AC-5 |
| Priority | P1 |
| Automation | playwright |
| Preconditions / Test data | One expense exists: amount=100, category=Food, date=2026-04-01, note=Coffee. Created in beforeEach. |
| Steps (Given / When / Then) | Given the edit form is open and pre-filled / When the user changes the amount to 999 and then dismisses the form without submitting (cancel button or equivalent close action) / Then the expense list still shows amount=100 and category=Food for that entry / And after a page reload the values are still 100 and Food |
| Expected result | No mutation occurred. The expense retains its original values after the form is dismissed. |

---

## TSD S-0005.01 — TC-06: Full edit round trip — list updates live without page reload
| Field | Value |
|-------|-------|
| Covers | S-0002.01 AC-6 |
| Priority | P1 |
| Automation | playwright |
| Preconditions / Test data | One expense exists: amount=250, category=Transport, date=2026-05-10, note absent. Created in beforeEach. |
| Steps (Given / When / Then) | Given the user is viewing the expense list / When the user opens the edit form for the expense, changes amount to 300 and category to Food, and saves / Then the expense list immediately shows 300 and Food for that entry — without a page reload |
| Expected result | The updated amount and category are visible in the list within the same page interaction, with no manual reload required. |

---

## TSD S-0005.01 — TC-07: Invalid amount types are rejected with a message (UI and API)
| Field | Value |
|-------|-------|
| Covers | S-0002.01 AC-3 |
| Priority | P1 |
| Automation | playwright |
| Preconditions / Test data | One expense exists. Test runs four sub-cases: amount = 0, amount = -50, amount = 12.50, amount = "abc". |
| Steps (Given / When / Then) | Given the edit form is open / When the user submits with each invalid amount in turn / Then a message naming the problem is shown in the UI for each / And the stored expense is unchanged (confirmed by navigating away and re-opening the expense — or by a direct API GET — showing the original value) / And a direct API PATCH with each invalid amount returns a 4xx status |
| Expected result | Each invalid amount is rejected. The rejection message names the problem. The stored expense is not mutated. The API itself refuses the value (not just the browser form). |

---

## TSD S-0005.01 — TC-08: Invalid category is rejected
| Field | Value |
|-------|-------|
| Covers | S-0002.01 AC-4 |
| Priority | P1 |
| Automation | playwright |
| Preconditions / Test data | One expense exists. Test submits a category value not in the fixed set (Food / Transport / Bills / Other) — e.g. "Groceries" or an empty selection, if the UI allows it. |
| Steps (Given / When / Then) | Given the edit form is open / When the user submits with an invalid category value / Then the form is rejected with an error message / And the stored expense's category is unchanged |
| Expected result | The invalid category is rejected. The expense is not updated. (Note: if the UI enforces the fixed set via a dropdown and prevents free-text entry entirely, this case verifies that the constraint exists — a direct API PATCH with an invalid category must still return a 4xx.) |

---

## TSD S-0005.01 — TC-09: Invalid date format is rejected
| Field | Value |
|-------|-------|
| Covers | S-0002.01 AC-4 |
| Priority | P1 |
| Automation | playwright |
| Preconditions / Test data | One expense exists. Test attempts: date = "not-a-date", date = "2026-13-01" (month 13), date = "2026-00-10" (month 0). |
| Steps (Given / When / Then) | Given the edit form is open / When the user submits with each invalid date in turn / Then each submission is rejected with an error message / And the stored expense's date is unchanged |
| Expected result | Each invalid date is rejected. The expense is not updated. The API refuses a non-YYYY-MM-DD or non-calendar date with a 4xx. |

---

## TSD S-0005.01 — TC-10: Summary stats refresh after editing an expense
| Field | Value |
|-------|-------|
| Covers | S-0002.01 AC-6 (implied) |
| Priority | P2 |
| Automation | playwright |
| Preconditions / Test data | Two expenses exist: expense A = 200 (Food), expense B = 100 (Transport). Total = 300. Created in beforeEach. |
| Steps (Given / When / Then) | Given the page shows total spend = 300 and Food = 200, Transport = 100 in the summary / When the user edits expense A to amount=150, category=Transport / Then the summary updates to total = 250, Food = 0 (or absent), Transport = 250 — without a page reload |
| Expected result | The total spend and spend-by-category figures in the summary reflect the edited values in the same interaction. |

---

## TSD S-0005.01 — TC-11: Clearing an existing note removes it
| Field | Value |
|-------|-------|
| Covers | S-0002.01 AC-2 (implied) |
| Priority | P2 |
| Automation | playwright |
| Preconditions / Test data | One expense exists with note="Dinner out". Created in beforeEach. |
| Steps (Given / When / Then) | Given the edit form is open showing note="Dinner out" / When the user clears the note field and saves / Then the expense no longer shows a note in the list or when re-opened for editing |
| Expected result | The note is absent after saving. Clearing the field and saving removes the note; it does not revert to the previous value. |

---

## TSD S-0005.01 — TC-12: Minimum valid amount (1 NPR) is accepted
| Field | Value |
|-------|-------|
| Covers | S-0002.01 AC-3 (boundary) |
| Priority | P2 |
| Automation | playwright |
| Preconditions / Test data | One expense exists with amount=500. Created in beforeEach. |
| Steps (Given / When / Then) | Given the edit form is open / When the user changes amount to 1 and saves / Then the edit succeeds and the expense shows amount=1 in the list |
| Expected result | Amount 1 (minimum positive whole number) is accepted and persisted. |

---

## TSD S-0005.01 — TC-13: Submitting the edit form with no changes succeeds
| Field | Value |
|-------|-------|
| Covers | S-0002.01 AC-2 (boundary) |
| Priority | P2 |
| Automation | playwright |
| Preconditions / Test data | One expense exists: amount=400, category=Bills, date=2026-06-01, note=Rent. Created in beforeEach. |
| Steps (Given / When / Then) | Given the edit form is open and pre-filled / When the user submits the form without changing any field / Then no error is shown and the expense still shows its original values in the list |
| Expected result | A no-op edit succeeds without error. All original values are preserved. |

---

## TSD S-0005.01 — TC-14: Feb 29 on a non-leap year is rejected
| Field | Value |
|-------|-------|
| Covers | S-0002.01 AC-4 (boundary) |
| Priority | P2 |
| Automation | playwright |
| Preconditions / Test data | One expense exists. Test submits date = "2025-02-29" (2025 is not a leap year). |
| Steps (Given / When / Then) | Given the edit form is open / When the user submits with date="2025-02-29" / Then the submission is rejected as an invalid calendar date / And the expense's date is unchanged |
| Expected result | 2025-02-29 is rejected. The API returns a 4xx. The expense is not updated. |

---

## TSD S-0005.01 — TC-15: Feb 29 on a leap year is accepted
| Field | Value |
|-------|-------|
| Covers | S-0002.01 AC-4 (boundary) |
| Priority | P2 |
| Automation | playwright |
| Preconditions / Test data | One expense exists. Test submits date = "2024-02-29" (2024 is a leap year). |
| Steps (Given / When / Then) | Given the edit form is open / When the user submits with date="2024-02-29" / Then the edit succeeds and the expense shows date=2024-02-29 in the list |
| Expected result | 2024-02-29 is accepted and persisted as a valid calendar date. |
