---
approved_by: "Samir dahal"
approved_at: "2026-10-08"
approved_sha256: "a9304ae1c79f07501ea7134464976aa0709e71a06ab06f06dce101d822c68b3d"
---
# Test Cases 0005 — Edit an expense — Acceptance QA
> One `## TSD S-0005.nn — TC-nn` section per test case, each with its OWN story id
> (S-0005.01, S-0005.02, … — never repeated; `lane approve` refuses a shared id). Each
> section becomes ONE task, and the Critic reviews the test against that section, frozen at
> `lane start`. The `0005` prefix resolves this folder. Black-box only: every expected result is
> observable through the UI or the public API — never through the code's internals.

## TSD S-0005.01 — TC-01: Change amount and category, list updates without a reload
| Field | Value |
|-------|-------|
| Covers | S-0002.01 AC-6 |
| Priority | P1 |
| Automation | playwright |
| Preconditions / Test data | The test creates its own expense through the public API: amount 500, category Food, date 2026-09-10, note "tc01-lunch". |
| Steps (Given / When / Then) | Given the expense list is open and shows the "tc01-lunch" expense with amount 500 and category Food <br> When the user opens edit on that expense, changes the amount to 750 and the category to Transport, and saves <br> Then the "tc01-lunch" row in the list shows amount 750 and category Transport, and the page was not reloaded |
| Expected result | Right after saving, the row shows 750 and Transport. A marker set on the page before saving is still there afterwards, which proves no reload or navigation happened. |

## TSD S-0005.02 — TC-02: Edit form is pre-filled with all four current values
| Field | Value |
|-------|-------|
| Covers | S-0002.01 AC-1 |
| Priority | P1 |
| Automation | playwright |
| Preconditions / Test data | The test creates an expense through the API: amount 300, category Bills, date 2026-09-15, note "tc02-electricity". |
| Steps (Given / When / Then) | Given the expense list is open and shows the "tc02-electricity" expense <br> When the user opens edit on that expense <br> Then the form shows amount 300, category Bills, date 2026-09-15 and note "tc02-electricity" |
| Expected result | All four fields hold the expense's current values. None is blank or shows a default. |

## TSD S-0005.03 — TC-03: An expense with no note opens with an empty note field
| Field | Value |
|-------|-------|
| Covers | S-0002.01 AC-1 |
| Priority | P1 |
| Automation | playwright |
| Preconditions / Test data | The test creates an expense through the API with no note: amount 203, category Other, date 2026-10-01. |
| Steps (Given / When / Then) | Given the expense list is open and shows the expense with amount 203 <br> When the user opens edit on that expense <br> Then the note field is empty, and amount 203, category Other and date 2026-10-01 are pre-filled |
| Expected result | The note field is present and empty, with no placeholder value submitted as text. The other three fields are pre-filled. |

## TSD S-0005.04 — TC-04: A saved edit survives a page reload
| Field | Value |
|-------|-------|
| Covers | S-0002.01 AC-2 |
| Priority | P1 |
| Automation | playwright |
| Preconditions / Test data | The test creates an expense through the API: amount 100, category Food, date 2026-08-01, note "tc04-snack". |
| Steps (Given / When / Then) | Given the expense list is open and shows the "tc04-snack" expense <br> When the user opens edit, changes the amount to 250 and the category to Transport, and saves <br> When the user reloads the page <br> Then the "tc04-snack" row shows amount 250 and category Transport |
| Expected result | After a full reload, the list shows 250 and Transport for that expense. The public API also returns 250 and Transport for it. |

## TSD S-0005.05 — TC-05: Fields the user did not touch keep their values
| Field | Value |
|-------|-------|
| Covers | S-0002.01 AC-2 |
| Priority | P1 |
| Automation | playwright |
| Preconditions / Test data | The test creates an expense through the API: amount 400, category Bills, date 2026-07-20, note "tc05-rent". |
| Steps (Given / When / Then) | Given the expense list is open and shows the "tc05-rent" expense <br> When the user opens edit, changes only the amount to 450, and saves <br> Then the row shows amount 450 <br> Then reopening edit on that expense shows category Bills, date 2026-07-20 and note "tc05-rent" |
| Expected result | Only the amount changed. Category, date and note keep their original values in the form and in the public API response. |

## TSD S-0005.06 — TC-06: An edit keeps the expense's identity and created_at
| Field | Value |
|-------|-------|
| Covers | S-0002.01 AC-2 |
| Priority | P1 |
| Automation | playwright |
| Preconditions / Test data | The test creates an expense through the API: amount 120, category Food, date 2026-09-05, note "tc06-coffee". It records the id and `created_at` from the API response. |
| Steps (Given / When / Then) | Given the expense list is open and shows exactly one "tc06-coffee" expense <br> When the user opens edit, changes the amount to 130, and saves <br> Then the list still shows exactly one "tc06-coffee" expense, with amount 130 <br> Then the public API returns that expense with the recorded id and the recorded `created_at` |
| Expected result | The same expense was updated: id and `created_at` match the values recorded at creation, and no second row appeared. |

## TSD S-0005.07 — TC-07: Saving twice quickly does not create a duplicate
| Field | Value |
|-------|-------|
| Covers | S-0002.01 AC-2 |
| Priority | P2 |
| Automation | playwright |
| Preconditions / Test data | The test creates an expense through the API: amount 80, category Transport, date 2026-09-12, note "tc07-bus". |
| Steps (Given / When / Then) | Given the expense list is open and shows exactly one "tc07-bus" expense <br> When the user opens edit, changes the amount to 90, and clicks save twice in quick succession <br> Then the list shows exactly one "tc07-bus" expense, with amount 90 <br> Then the public API returns exactly one "tc07-bus" expense, with its original id |
| Expected result | One expense with amount 90 and its original id. There is no duplicate in the list or the API. |

## TSD S-0005.08 — TC-08: Dismissing the form leaves the expense untouched
| Field | Value |
|-------|-------|
| Covers | S-0002.01 AC-5 |
| Priority | P1 |
| Automation | playwright |
| Preconditions / Test data | The test creates an expense through the API: amount 600, category Food, date 2026-09-01, note "tc08-dinner". |
| Steps (Given / When / Then) | Given the expense list is open and shows the "tc08-dinner" expense <br> When the user opens edit, changes the amount to 999 and the category to Bills <br> When the user dismisses the form without saving <br> Then the row still shows amount 600 and category Food <br> Then reopening edit shows amount 600, category Food, date 2026-09-01 and note "tc08-dinner" |
| Expected result | Nothing changed. The list, the reopened form and the public API all show the original four values. |

## TSD S-0005.09 — TC-09: A zero amount is refused and the expense is unchanged
| Field | Value |
|-------|-------|
| Covers | S-0002.01 AC-3 |
| Priority | P1 |
| Automation | playwright |
| Preconditions / Test data | The test creates an expense through the API: amount 100, category Food, date 2026-09-02, note "tc09-zero". |
| Steps (Given / When / Then) | Given the edit form is open for the "tc09-zero" expense <br> When the user sets the amount to 0 and saves <br> Then a message naming the amount problem is shown, and the row still shows amount 100 <br> When the same edit with amount 0 is sent straight to the public API <br> Then the API refuses it with a 4xx error, and re-reading the expense returns amount 100 |
| Expected result | Both the browser and the API refuse it. The browser shows a message about the amount. The stored expense is unchanged. |

## TSD S-0005.10 — TC-10: A negative amount is refused and the expense is unchanged
| Field | Value |
|-------|-------|
| Covers | S-0002.01 AC-3 |
| Priority | P1 |
| Automation | playwright |
| Preconditions / Test data | The test creates an expense through the API: amount 100, category Food, date 2026-09-03, note "tc10-negative". |
| Steps (Given / When / Then) | Given the edit form is open for the "tc10-negative" expense <br> When the user sets the amount to -1 and saves <br> Then a message naming the amount problem is shown, and the row still shows amount 100 <br> When the same edit with amount -1 is sent straight to the public API <br> Then the API refuses it with a 4xx error, and re-reading the expense returns amount 100 |
| Expected result | Both the browser and the API refuse it. The browser shows a message about the amount. The stored expense is unchanged. |

## TSD S-0005.11 — TC-11: A non-integer amount (12.50) is refused and the expense is unchanged
| Field | Value |
|-------|-------|
| Covers | S-0002.01 AC-3 |
| Priority | P1 |
| Automation | playwright |
| Preconditions / Test data | The test creates an expense through the API: amount 100, category Food, date 2026-09-04, note "tc11-decimal". |
| Steps (Given / When / Then) | Given the edit form is open for the "tc11-decimal" expense <br> When the user sets the amount to 12.50 and saves <br> Then a message naming the amount problem is shown, and the row still shows amount 100 <br> When the same edit with amount 12.50 is sent straight to the public API <br> Then the API refuses it with a 4xx error, and re-reading the expense returns amount 100 |
| Expected result | Both the browser and the API refuse it. The browser shows a message about the amount. The stored expense is unchanged. |

## TSD S-0005.12 — TC-12: An empty amount is refused and the expense is unchanged
| Field | Value |
|-------|-------|
| Covers | S-0002.01 AC-3 |
| Priority | P2 |
| Automation | playwright |
| Preconditions / Test data | The test creates an expense through the API: amount 100, category Food, date 2026-09-06, note "tc12-empty". |
| Steps (Given / When / Then) | Given the edit form is open for the "tc12-empty" expense <br> When the user clears the amount field and saves <br> Then a message naming the amount problem is shown, and the row still shows amount 100 <br> When an edit with no amount value is sent straight to the public API <br> Then the API refuses it with a 4xx error, and re-reading the expense returns amount 100 |
| Expected result | Both the browser and the API refuse it. The stored expense is unchanged. |

## TSD S-0005.13 — TC-13: A non-numeric amount is refused by the API
| Field | Value |
|-------|-------|
| Covers | S-0002.01 AC-3 |
| Priority | P2 |
| Automation | playwright |
| Preconditions / Test data | The test creates an expense through the API: amount 100, category Food, date 2026-09-07, note "tc13-text". |
| Steps (Given / When / Then) | Given the "tc13-text" expense exists with amount 100 <br> When an edit with amount "abc" is sent straight to the public API <br> Then the API refuses it with a 4xx error <br> Then the list, after a reload, still shows the "tc13-text" expense with amount 100 |
| Expected result | The API refuses the non-numeric amount. The stored expense is unchanged in the API and in the list. |

## TSD S-0005.14 — TC-14: The smallest valid amount (1) is accepted
| Field | Value |
|-------|-------|
| Covers | S-0002.01 AC-3 |
| Priority | P2 |
| Automation | playwright |
| Preconditions / Test data | The test creates an expense through the API: amount 100, category Food, date 2026-09-08, note "tc14-one". |
| Steps (Given / When / Then) | Given the edit form is open for the "tc14-one" expense <br> When the user sets the amount to 1 and saves <br> Then no error is shown, and the row shows amount 1 |
| Expected result | An amount of 1 is accepted. The list and the public API both show amount 1. |

## TSD S-0005.15 — TC-15: A category outside the fixed set is refused
| Field | Value |
|-------|-------|
| Covers | S-0002.01 AC-4 |
| Priority | P1 |
| Automation | playwright |
| Preconditions / Test data | The test creates an expense through the API: amount 100, category Food, date 2026-09-09, note "tc15-category". |
| Steps (Given / When / Then) | Given the edit form is open for the "tc15-category" expense <br> Then the category control offers exactly Food, Transport, Bills and Other <br> When an edit with category "Groceries" is sent straight to the public API <br> Then the API refuses it with a 4xx error, and re-reading the expense returns category Food |
| Expected result | The form offers only the four fixed categories. The API refuses any other value, and the stored category stays Food. |

## TSD S-0005.16 — TC-16: An empty category is refused by the API
| Field | Value |
|-------|-------|
| Covers | S-0002.01 AC-4 |
| Priority | P2 |
| Automation | playwright |
| Preconditions / Test data | The test creates an expense through the API: amount 100, category Bills, date 2026-09-11, note "tc16-nocat". |
| Steps (Given / When / Then) | Given the "tc16-nocat" expense exists with category Bills <br> When an edit with an empty category is sent straight to the public API <br> Then the API refuses it with a 4xx error <br> Then the list, after a reload, still shows the "tc16-nocat" expense with category Bills |
| Expected result | The API refuses the empty category. The stored expense is unchanged. |

## TSD S-0005.17 — TC-17: A date not in YYYY-MM-DD format is refused by the API
| Field | Value |
|-------|-------|
| Covers | S-0002.01 AC-4 |
| Priority | P1 |
| Automation | playwright |
| Preconditions / Test data | The test creates an expense through the API: amount 100, category Food, date 2026-09-13, note "tc17-format". |
| Steps (Given / When / Then) | Given the "tc17-format" expense exists with date 2026-09-13 <br> When an edit with date "08/10/2026" is sent straight to the public API <br> Then the API refuses it with a 4xx error <br> Then the list, after a reload, still shows the "tc17-format" expense with date 2026-09-13 |
| Expected result | The API refuses the wrongly formatted date. The stored date is unchanged. |

## TSD S-0005.18 — TC-18: An impossible calendar date (2026-02-30) is refused by the API
| Field | Value |
|-------|-------|
| Covers | S-0002.01 AC-4 |
| Priority | P1 |
| Automation | playwright |
| Preconditions / Test data | The test creates an expense through the API: amount 100, category Food, date 2026-09-14, note "tc18-feb30". |
| Steps (Given / When / Then) | Given the "tc18-feb30" expense exists with date 2026-09-14 <br> When an edit with date "2026-02-30" is sent straight to the public API <br> Then the API refuses it with a 4xx error <br> Then the list, after a reload, still shows the "tc18-feb30" expense with date 2026-09-14 |
| Expected result | The API refuses a date that does not exist on the calendar. The stored date is unchanged. |

## TSD S-0005.19 — TC-19: An empty date is refused and the expense is unchanged
| Field | Value |
|-------|-------|
| Covers | S-0002.01 AC-4 |
| Priority | P2 |
| Automation | playwright |
| Preconditions / Test data | The test creates an expense through the API: amount 100, category Food, date 2026-09-16, note "tc19-nodate". |
| Steps (Given / When / Then) | Given the edit form is open for the "tc19-nodate" expense <br> When the user clears the date field and saves <br> Then the edit is not saved, and the row still shows date 2026-09-16 <br> When an edit with an empty date is sent straight to the public API <br> Then the API refuses it with a 4xx error, and re-reading the expense returns date 2026-09-16 |
| Expected result | Both the browser and the API refuse it. The stored date is unchanged. |

## TSD S-0005.20 — TC-20: A leap-day date (2024-02-29) is accepted
| Field | Value |
|-------|-------|
| Covers | S-0002.01 AC-4 |
| Priority | P2 |
| Automation | playwright |
| Preconditions / Test data | The test creates an expense through the API: amount 100, category Food, date 2026-09-17, note "tc20-leap". |
| Steps (Given / When / Then) | Given the edit form is open for the "tc20-leap" expense <br> When the user sets the date to 2024-02-29 and saves <br> Then no error is shown, and the row shows date 2024-02-29 |
| Expected result | A real leap-day date is accepted. The list and the public API both show 2024-02-29. |
