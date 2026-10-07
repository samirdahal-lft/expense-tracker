---
approved_by: "Samir dahal"
approved_at: "2026-10-07"
approved_sha256: "e908cb9f86e6c29046ab1b34d410ea20f5f7f5108a9928296ad369a3296a69af"
---
# Test Cases 0005 — Edit an expense (acceptance)
> One `## TSD S-0005.nn — TC-nn` section per test case, each with its OWN story id
> (S-0005.01, S-0005.02, … — never repeated; `lane approve` refuses a shared id). Each
> section becomes ONE task, and the Critic reviews the test against that section, frozen at
> `lane start`. The `0005` prefix resolves this folder. Black-box only: every expected result is
> observable through the UI or the public API — never through the code's internals.

Conventions for every case below:
- "Create an expense" means the test creates it through the public API in its own setup, with a
  unique note (or, where the case needs no note, a unique amount) so the test finds its own row in
  the list without relying on position or an empty list.
- "The update endpoint" is the app's public HTTP endpoint for changing one expense; "read back"
  means fetching that expense through the public API.
- "Refused" at the API means a 4xx response whose body names the offending field; "row unchanged"
  means a read-back returns the values the test created.
- UI elements are located by accessible role and label (Amount, Category, Date, Note; Edit, Save,
  Cancel), never by CSS or test ids.

## TSD S-0005.01 — TC-01: Edit amount and category from the list; list updates without reload
| Field | Value |
|-------|-------|
| Covers | S-0002.01 AC-6 |
| Priority | P1 |
| Automation | playwright |
| Preconditions / Test data | Create an expense: amount 500, category Food, date 2026-09-01, note "tc01-lunch". |
| Steps (Given / When / Then) | Given the expense list is open and shows the tc01 row / When the user opens edit on that row, changes amount to 750 and category to Transport, and saves / Then the tc01 row in the list shows 750 and Transport, with no page navigation or reload between Save and the check. |
| Expected result | The list row for tc01 shows amount 750 and category Transport; the page was not reloaded (no navigation event after Save). |

## TSD S-0005.02 — TC-02: Edit form is pre-filled with the expense's current values
| Field | Value |
|-------|-------|
| Covers | S-0002.01 AC-1 |
| Priority | P1 |
| Automation | playwright |
| Preconditions / Test data | Create an expense: amount 1234, category Bills, date 2026-08-15, note "tc02-electricity". |
| Steps (Given / When / Then) | Given the expense list shows the tc02 row / When the user opens edit on that row / Then the form shows the expense's current values. |
| Expected result | Amount field shows 1234, Category shows Bills, Date shows 2026-08-15, Note shows "tc02-electricity". No field is blank or a default. |

## TSD S-0005.03 — TC-03: An expense with no note opens with an empty note field
| Field | Value |
|-------|-------|
| Covers | S-0002.01 AC-1 |
| Priority | P2 |
| Automation | playwright |
| Preconditions / Test data | Create an expense with no note: amount 303, category Other, date 2026-07-03. |
| Steps (Given / When / Then) | Given the expense list shows the 303 / Other row / When the user opens edit on that row / Then the note field is empty and the other fields are pre-filled. |
| Expected result | Note field is empty (not "null", "undefined" or placeholder-as-value); Amount 303, Category Other, Date 2026-07-03. |

## TSD S-0005.04 — TC-04: A saved edit survives reload and untouched fields keep their values
| Field | Value |
|-------|-------|
| Covers | S-0002.01 AC-2 |
| Priority | P1 |
| Automation | playwright |
| Preconditions / Test data | Create an expense: amount 400, category Food, date 2026-09-04, note "tc04-dinner". |
| Steps (Given / When / Then) | Given the expense list shows the tc04 row / When the user opens edit, changes only the amount to 450, saves, and reloads the page / Then the tc04 row shows the new amount and the original category, date and note. |
| Expected result | After reload: amount 450, category Food, date 2026-09-04, note "tc04-dinner". |

## TSD S-0005.05 — TC-05: An edit keeps the expense's identity and created_at
| Field | Value |
|-------|-------|
| Covers | S-0002.01 AC-2 |
| Priority | P1 |
| Automation | playwright |
| Preconditions / Test data | Create an expense: amount 505, category Transport, date 2026-09-05, note "tc05-bus"; record its id and `created_at` from the create response. |
| Steps (Given / When / Then) | Given the tc05 expense exists / When the user edits it through the UI (category to Other) and saves / Then reading it back by the recorded id returns the edited values with the same id and `created_at`. |
| Expected result | Read-back by the original id succeeds; category is Other; `created_at` equals the recorded value; the list contains exactly one tc05 row (no new record). |

## TSD S-0005.06 — TC-06: Amount zero is refused
| Field | Value |
|-------|-------|
| Covers | S-0002.01 AC-3 |
| Priority | P1 |
| Automation | playwright |
| Preconditions / Test data | Create an expense: amount 600, category Food, date 2026-09-06, note "tc06". |
| Steps (Given / When / Then) | Given the tc06 expense exists / When the user sets the amount to 0 in the edit form and saves, and separately the update endpoint is called directly with amount 0 / Then both are refused and the expense is unchanged. |
| Expected result | UI: a message naming the amount problem is shown; the list row still shows 600. API: refused (4xx naming amount); read-back shows amount 600. |

## TSD S-0005.07 — TC-07: Negative amount is refused
| Field | Value |
|-------|-------|
| Covers | S-0002.01 AC-3 |
| Priority | P1 |
| Automation | playwright |
| Preconditions / Test data | Create an expense: amount 700, category Food, date 2026-09-07, note "tc07". |
| Steps (Given / When / Then) | Given the tc07 expense exists / When the user sets the amount to -1 in the edit form and saves, and separately the update endpoint is called directly with amount -1 / Then both are refused and the expense is unchanged. |
| Expected result | UI: a message naming the amount problem; list row still shows 700. API: refused (4xx naming amount); read-back shows amount 700. |

## TSD S-0005.08 — TC-08: Non-integer amount is refused
| Field | Value |
|-------|-------|
| Covers | S-0002.01 AC-3 |
| Priority | P1 |
| Automation | playwright |
| Preconditions / Test data | Create an expense: amount 800, category Food, date 2026-09-08, note "tc08". |
| Steps (Given / When / Then) | Given the tc08 expense exists / When the user sets the amount to 12.50 in the edit form and saves, and separately the update endpoint is called directly with amount 12.50 / Then both are refused and the expense is unchanged. |
| Expected result | UI: a message naming the amount problem; list row still shows 800 (not 12, 13 or 12.5). API: refused (4xx naming amount); read-back shows amount 800. |

## TSD S-0005.09 — TC-09: The smallest valid amount (1) is accepted
| Field | Value |
|-------|-------|
| Covers | S-0002.01 AC-3 |
| Priority | P2 |
| Automation | playwright |
| Preconditions / Test data | Create an expense: amount 900, category Other, date 2026-09-09, note "tc09". |
| Steps (Given / When / Then) | Given the tc09 expense exists / When the user sets the amount to 1 and saves / Then the edit is accepted. |
| Expected result | No error message; the tc09 row shows amount 1, and still shows 1 after reload. |

## TSD S-0005.10 — TC-10: A category outside the fixed set is refused at the API
| Field | Value |
|-------|-------|
| Covers | S-0002.01 AC-4 |
| Priority | P1 |
| Automation | playwright |
| Preconditions / Test data | Create an expense: amount 1000, category Food, date 2026-09-10, note "tc10". |
| Steps (Given / When / Then) | Given the tc10 expense exists / When the update endpoint is called directly with category "Groceries" / Then it is refused and the expense is unchanged. |
| Expected result | API: refused (4xx naming category); read-back shows category Food. The edit form's category control offers exactly Food, Transport, Bills, Other. |

## TSD S-0005.11 — TC-11: An impossible calendar date is refused
| Field | Value |
|-------|-------|
| Covers | S-0002.01 AC-4 |
| Priority | P1 |
| Automation | playwright |
| Preconditions / Test data | Create an expense: amount 1100, category Bills, date 2026-09-11, note "tc11". |
| Steps (Given / When / Then) | Given the tc11 expense exists / When the update endpoint is called directly with date 2026-02-30 / Then it is refused and the expense is unchanged. |
| Expected result | API: refused (4xx naming date); read-back shows date 2026-09-11. |

## TSD S-0005.12 — TC-12: An out-of-range month is refused
| Field | Value |
|-------|-------|
| Covers | S-0002.01 AC-4 |
| Priority | P2 |
| Automation | playwright |
| Preconditions / Test data | Create an expense: amount 1200, category Bills, date 2026-09-12, note "tc12". |
| Steps (Given / When / Then) | Given the tc12 expense exists / When the update endpoint is called directly with date 2026-13-01 / Then it is refused and the expense is unchanged. |
| Expected result | API: refused (4xx naming date); read-back shows date 2026-09-12. |

## TSD S-0005.13 — TC-13: A date not in YYYY-MM-DD format is refused
| Field | Value |
|-------|-------|
| Covers | S-0002.01 AC-4 |
| Priority | P2 |
| Automation | playwright |
| Preconditions / Test data | Create an expense: amount 1300, category Transport, date 2026-09-13, note "tc13". |
| Steps (Given / When / Then) | Given the tc13 expense exists / When the update endpoint is called directly with date "07/10/2026" / Then it is refused and the expense is unchanged. |
| Expected result | API: refused (4xx naming date); read-back shows date 2026-09-13. |

## TSD S-0005.14 — TC-14: An empty date is refused
| Field | Value |
|-------|-------|
| Covers | S-0002.01 AC-4 |
| Priority | P2 |
| Automation | playwright |
| Preconditions / Test data | Create an expense: amount 1400, category Food, date 2026-09-14, note "tc14". |
| Steps (Given / When / Then) | Given the tc14 expense exists / When the user clears the date in the edit form and saves, and separately the update endpoint is called directly with an empty date / Then both are refused and the expense is unchanged. |
| Expected result | UI: a message naming the date problem; list row still shows 2026-09-14. API: refused (4xx naming date); read-back shows date 2026-09-14. |

## TSD S-0005.15 — TC-15: Dismissing the form leaves the expense untouched
| Field | Value |
|-------|-------|
| Covers | S-0002.01 AC-5 |
| Priority | P1 |
| Automation | playwright |
| Preconditions / Test data | Create an expense: amount 1500, category Food, date 2026-09-15, note "tc15-original". |
| Steps (Given / When / Then) | Given the expense list shows the tc15 row / When the user opens edit, changes every field (amount 9999, category Bills, date 2026-01-01, note "tc15-changed") and dismisses the form without saving / Then the expense keeps its original values. |
| Expected result | The list row shows 1500, Food, 2026-09-15, "tc15-original" immediately and after reload; read-back returns the same values. |

## TSD S-0005.16 — TC-16: Double-clicking Save produces one update and no duplicate
| Field | Value |
|-------|-------|
| Covers | S-0002.01 AC-2 (implied negative: double submit) |
| Priority | P2 |
| Automation | playwright |
| Preconditions / Test data | Create an expense: amount 1600, category Other, date 2026-09-16, note "tc16". |
| Steps (Given / When / Then) | Given the edit form for tc16 is open / When the user changes the amount to 1650 and clicks Save twice in quick succession / Then there is exactly one tc16 expense, with the new amount. |
| Expected result | The list shows exactly one tc16 row, amount 1650; after reload still exactly one, amount 1650; no error shown. |

## TSD S-0005.17 — TC-17: Editing one expense does not change any other
| Field | Value |
|-------|-------|
| Covers | S-0002.01 AC-2 (implied negative: isolation) |
| Priority | P2 |
| Automation | playwright |
| Preconditions / Test data | Create two expenses: A = 1700, Food, 2026-09-17, "tc17-a"; B = 1701, Bills, 2026-09-18, "tc17-b". |
| Steps (Given / When / Then) | Given both rows are in the list / When the user edits A (amount 1777, category Transport) and saves / Then A shows the new values and B is unchanged. |
| Expected result | Row tc17-a: 1777, Transport. Row tc17-b: 1701, Bills, 2026-09-18, "tc17-b" in the list, after reload, and on read-back. |

## TSD S-0005.18 — TC-18: Updating a non-existent expense is refused and creates nothing
| Field | Value |
|-------|-------|
| Covers | S-0002.01 AC-2 (implied negative: unknown id) |
| Priority | P3 |
| Automation | playwright |
| Preconditions / Test data | Create one expense (amount 1800, Food, 2026-09-18, "tc18-anchor") and record its id; derive an id that does not exist by deleting a second freshly created expense and reusing its id. |
| Steps (Given / When / Then) | Given an id that refers to no expense / When the update endpoint is called with that id and otherwise valid values (amount 1818, Food, 2026-09-18, note "tc18-ghost") / Then it is refused as not found and no expense is created. |
| Expected result | API: 404 (not found); the list contains no "tc18-ghost" row; the tc18-anchor row is unchanged. |
