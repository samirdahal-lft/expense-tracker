---
approved_by: "Samir dahal"
approved_at: "2026-10-07"
approved_sha256: "cf05e6434ea00f3073682d54e6759fe33819cdea4329c9bfb324ff641abfb62e"
---
# Test Cases 0005 — Edit an expense — Acceptance QA
> One `## TSD S-0005.nn — TC-nn` section per test case, each with its OWN story id
> (S-0005.01, S-0005.02, … — never repeated; `lane approve` refuses a shared id). Each
> section becomes ONE task, and the Critic reviews the test against that section, frozen at
> `lane start`. The `0005` prefix resolves this folder. Black-box only: every expected result is
> observable through the UI or the public API — never through the code's internals.

## TSD S-0005.01 — TC-01: Full e2e — change amount and category, list updates live
| Field | Value |
|-------|-------|
| Covers | S-0002.01 AC-6 |
| Priority | P1 |
| Automation | playwright |
| Preconditions / Test data | A test expense exists with a known amount (e.g. 500 NPR), category (e.g. Food), a date, and no note. Created by the test itself via the app UI or API before the test body runs. |
| Steps (Given / When / Then) | Given the expense list is open and the test expense is visible / When the user opens the edit form for that expense, changes the amount to 750 and the category to Transport, and saves / Then the expense row in the list shows 750 NPR and Transport without a page reload |
| Expected result | The expense list row displays the updated amount (750 NPR) and the updated category (Transport) immediately after saving, with no page reload required. |

## TSD S-0005.02 — TC-02: Edit form pre-fills all four fields for an expense with values set
| Field | Value |
|-------|-------|
| Covers | S-0002.01 AC-1 |
| Priority | P1 |
| Automation | playwright |
| Preconditions / Test data | A test expense created with amount 300 NPR, category Bills, date 2026-09-15, and note "monthly electricity". |
| Steps (Given / When / Then) | Given the expense list is open / When the user opens the edit form for the test expense / Then the amount field shows 300, the category field shows Bills, the date field shows 2026-09-15, and the note field shows "monthly electricity" — no field is blank or defaulted |
| Expected result | All four fields in the edit form are pre-filled with the expense's current stored values; none starts blank or shows a default. |

## TSD S-0005.03 — TC-03: Edit form shows empty note field when expense has no note
| Field | Value |
|-------|-------|
| Covers | S-0002.01 AC-1 |
| Priority | P1 |
| Automation | playwright |
| Preconditions / Test data | A test expense created with amount 200 NPR, category Other, date 2026-10-01, and no note (note field left empty at creation). |
| Steps (Given / When / Then) | Given the expense list is open / When the user opens the edit form for the test expense / Then the note field is present and empty — not pre-filled with a placeholder or a default value |
| Expected result | The note field in the edit form is empty when the stored expense has no note. |

## TSD S-0005.04 — TC-04: Saving valid changes persists and survives a page reload
| Field | Value |
|-------|-------|
| Covers | S-0002.01 AC-2 |
| Priority | P1 |
| Automation | playwright |
| Preconditions / Test data | A test expense created with amount 100 NPR, category Food, date 2026-08-01, note "lunch". |
| Steps (Given / When / Then) | Given the edit form is open for the test expense / When the user changes the amount to 250, the category to Transport, and saves / And then reloads the page / Then the expense still shows amount 250 NPR and category Transport |
| Expected result | The updated amount and category remain visible in the expense list after a full page reload, confirming the change was persisted to the server. |

## TSD S-0005.05 — TC-05: Fields the user did not touch keep their original values after save
| Field | Value |
|-------|-------|
| Covers | S-0002.01 AC-2 |
| Priority | P1 |
| Automation | playwright |
| Preconditions / Test data | A test expense created with amount 400 NPR, category Bills, date 2026-07-20, note "rent". |
| Steps (Given / When / Then) | Given the edit form is open for the test expense / When the user changes only the amount to 450 and saves, leaving category, date, and note untouched / Then the list row shows 450 NPR; the category remains Bills, date remains 2026-07-20, and the note remains "rent" |
| Expected result | Only the amount changed; category, date, and note are unchanged after save. Observable by opening the edit form again and verifying the other three fields still hold their original values. |

## TSD S-0005.06 — TC-06: Expense retains its original created_at after an edit
| Field | Value |
|-------|-------|
| Covers | S-0002.01 AC-2 |
| Priority | P2 |
| Automation | playwright |
| Preconditions / Test data | A test expense created by the test; its creation timestamp is captured immediately after creation via the public API (GET /expenses or equivalent). |
| Steps (Given / When / Then) | Given the test expense exists with a known created_at / When the user edits the amount and saves / Then the expense's created_at returned by the API equals the value captured at creation |
| Expected result | The expense's created_at is unchanged after an edit. Observable via the public API response for that expense. |

## TSD S-0005.07 — TC-07: Dismissing the edit form leaves the expense completely unchanged
| Field | Value |
|-------|-------|
| Covers | S-0002.01 AC-5 |
| Priority | P1 |
| Automation | playwright |
| Preconditions / Test data | A test expense with amount 600 NPR, category Food, date 2026-09-01, note "dinner". |
| Steps (Given / When / Then) | Given the edit form is open for the test expense / When the user changes the amount to 999 and then dismisses the form (cancel button or close gesture) without submitting / Then the expense in the list still shows 600 NPR and Food |
| Expected result | The expense is unchanged after dismissal: amount, category, date, and note all retain their values before the edit form was opened. |

## TSD S-0005.08 — TC-08: Zero amount is rejected with an error; expense unchanged
| Field | Value |
|-------|-------|
| Covers | S-0002.01 AC-3 |
| Priority | P1 |
| Automation | playwright |
| Preconditions / Test data | A test expense with amount 100 NPR. |
| Steps (Given / When / Then) | Given the edit form is open for the test expense / When the user enters 0 in the amount field and submits / Then an error message is shown naming the problem, and the expense still shows 100 NPR in the list |
| Expected result | The form displays an error indicating the amount must be a positive whole number. The stored amount remains 100 NPR (confirmed by reopening the form). |

## TSD S-0005.09 — TC-09: Negative amount is rejected with an error; expense unchanged
| Field | Value |
|-------|-------|
| Covers | S-0002.01 AC-3 |
| Priority | P1 |
| Automation | playwright |
| Preconditions / Test data | A test expense with amount 100 NPR. |
| Steps (Given / When / Then) | Given the edit form is open for the test expense / When the user enters -50 in the amount field and submits / Then an error message is shown naming the problem, and the expense still shows 100 NPR |
| Expected result | The form displays an error for the negative amount. The stored amount remains 100 NPR. |

## TSD S-0005.10 — TC-10: Decimal amount is rejected with an error; expense unchanged
| Field | Value |
|-------|-------|
| Covers | S-0002.01 AC-3 |
| Priority | P1 |
| Automation | playwright |
| Preconditions / Test data | A test expense with amount 100 NPR. |
| Steps (Given / When / Then) | Given the edit form is open for the test expense / When the user enters 12.50 in the amount field and submits / Then an error message is shown naming the problem, and the expense still shows 100 NPR |
| Expected result | The form displays an error for the non-integer amount. The stored amount remains 100 NPR. |

## TSD S-0005.11 — TC-11: API-level amount rejection — invalid amount via direct API call returns an error
| Field | Value |
|-------|-------|
| Covers | S-0002.01 AC-3 |
| Priority | P1 |
| Automation | playwright |
| Preconditions / Test data | A test expense with amount 100 NPR; its id captured after creation. |
| Steps (Given / When / Then) | Given the test expense exists / When the test sends a PATCH/PUT request to the edit endpoint with amount 0 (or -1, or 12.50), bypassing the browser form / Then the API returns an error status (4xx) and the expense's amount returned by a subsequent GET is still 100 NPR |
| Expected result | The server rejects the invalid amount with an error response. The stored expense is unchanged. This confirms server-side validation independent of the browser form. |

## TSD S-0005.12 — TC-12: Category outside the fixed set is rejected
| Field | Value |
|-------|-------|
| Covers | S-0002.01 AC-4 |
| Priority | P1 |
| Automation | playwright |
| Preconditions / Test data | A test expense with category Food. |
| Steps (Given / When / Then) | Given the edit form is open for the test expense / When the test submits the form with a category value not in {Food, Transport, Bills, Other} (sent via direct API call to bypass browser select constraints) / Then the API returns an error and the stored category remains Food |
| Expected result | The server rejects a category value outside the fixed set. The stored expense is unchanged. |

## TSD S-0005.13 — TC-13: Malformed date is rejected
| Field | Value |
|-------|-------|
| Covers | S-0002.01 AC-4 |
| Priority | P1 |
| Automation | playwright |
| Preconditions / Test data | A test expense with date 2026-09-01. |
| Steps (Given / When / Then) | Given the edit form is open for the test expense / When the test submits a date that is not a valid YYYY-MM-DD calendar date (e.g. "not-a-date", "2026-13-01", "2026-02-30") via direct API call / Then the API returns an error and the stored date remains 2026-09-01 |
| Expected result | The server rejects an invalid or non-existent date. The stored expense is unchanged. |

## TSD S-0005.14 — TC-14: Clearing the note field removes an existing note from the stored expense
| Field | Value |
|-------|-------|
| Covers | S-0002.01 AC-2 |
| Priority | P2 |
| Automation | playwright |
| Preconditions / Test data | A test expense with note "grocery run". |
| Steps (Given / When / Then) | Given the edit form is open for the test expense and the note field shows "grocery run" / When the user clears the note field and saves / Then the expense in the list shows no note, and reopening the edit form shows the note field empty |
| Expected result | The note is removed from the stored expense when the note field is submitted empty. Observable through the UI (no note shown) and confirmed by reopening the edit form (note field is empty). |
