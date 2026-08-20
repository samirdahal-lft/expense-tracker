---
approved_by: "Samir dahal"
approved_at: "2026-08-20"
approved_sha256: "d98e3f3af26068fa7486fdc40c63dd358fc4edd9b35edbb2602897115d024afd"
---
# Patch 0004 — Add loading spinner on expense submit

**Severity:** minor
**Source:** review feedback — submit button gives no visual in-flight signal beyond text change

**Current behavior:** When the user submits the Add or Edit expense form, the submit button
is disabled and its label changes ("Adding…" / "Saving…"), but there is no spinning icon.
On a slow connection the button looks frozen rather than working.

**Expected behavior:** While a submit request is in flight, a spinning icon appears inside
the submit button (alongside the label text) in both `AddExpenseForm` and `EditExpenseForm`.
The icon is decorative (aria-hidden); the label text continues to provide the accessible name.
The spinner disappears when the request settles (success or error).

**Must NOT change:** Button disabled state, label text, error display, success behavior, and
all existing passing tests are unchanged.

## TSD S-0004.01 — Submit spinner in Add and Edit expense forms

| Aspect | Spec |
|--------|------|
| Interfaces | `AddExpenseForm` and `EditExpenseForm` (internal render only — no prop changes) |
| Data / State | Existing `submitting: boolean` state drives the spinner; no new state |
| Behavior | While `submitting` is true: a spinning icon with `aria-hidden="true"` is rendered inside the submit button. When `submitting` is false: no spinner is present in the DOM. |
| Boundaries | None — no external deps; lucide-react is already a project dependency |
| Tests | Vitest + Testing Library: stub fetch to hold (never resolve) to freeze `submitting` at true; assert a spinner element is present in the submit button for each form. |

## Task T-add-loading-spinner-on-expense-submit-x5mnve — Submit spinner in Add and Edit forms
**Slice:** full vertical — render change inside each form component + tests
**Acceptance criteria:** (tag each: `behavior` | `invariant` | `non-functional` | `e2e`)
- [ ] AC-1 [behavior]: While `AddExpenseForm` is submitting, the submit button contains a spinner icon (aria-hidden).
- [ ] AC-2 [behavior]: While `EditExpenseForm` is submitting, the submit button contains a spinner icon (aria-hidden).
- [ ] AC-3 [invariant]: When not submitting, no spinner is present in either form's submit button.
**Tests:** AC-1, AC-2, AC-3

## Execution Plan

**Approach:** Import `Loader2` from `lucide-react` in each form component. When `submitting`
is true, render `<Loader2 className="animate-spin" aria-hidden="true" />` inside the submit
button, before the label text. Wrap both in a single new test file covering all three ACs.

**Boundaries & mocks:** `fetch` stubbed via `vi.stubGlobal` — returning a Promise that never
resolves keeps `submitting` true so the spinner is visible during the assertion.

**Behaviors (TDD order):**
- B-1: Failing test asserts spinner present in `AddExpenseForm` submit button while submitting; then add the spinner to `AddExpenseForm`.
- B-2: Failing test asserts spinner present in `EditExpenseForm` submit button while submitting; then add the spinner to `EditExpenseForm`.

**Open questions:** none
