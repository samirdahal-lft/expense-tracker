---
approved_by: "Samir dahal"
approved_at: "2026-08-13"
approved_sha256: "d2566ef6babeb565cd76a81aca23e22f2a36da511a08a9566a0ff0ffaf0ca228"
---
# Briefing 0007 — Welcome page for Expense Tracker

> Scratch pad — flesh the idea out before committing to a PRD.
> ★ Gate: stakeholder (PM / SA / client) approves before any PRD work begins.
> Approve by running `lane approve` — lane writes the stamp after your y/N confirm.
> Do NOT edit the frontmatter fields by hand; a hand-typed stamp does not count.

## Why
New users land directly on the tracker dashboard with no context — no intro, no value proposition, no call to action. This creates a cold-start experience. A welcome page gives first-time visitors a clear sense of what the app does and a single entry point into it.

## Hypothesis
A dedicated welcome/landing page shown before the main tracker will reduce confusion for new users. It presents the app name, a short description, and a "Get Started" call-to-action that navigates to the tracker. Returning users bypass it automatically (or via a simple nav link).

## Mocks / references
- Simple hero layout: app name + tagline centered, one CTA button ("Start Tracking"), optional feature highlights (track expenses, view by category, export CSV)
- No authentication required — purely informational entry point

## Scope hints
**Probably in:**
- Welcome/landing route (`/` or `/welcome`) with app name, tagline, and "Get Started" CTA
- CTA navigates to the main tracker (`/app` or equivalent)
- Responsive layout consistent with existing Tailwind/shadcn design system
- Light/dark theme support (uses existing CSS variables)

**Probably out:**
- Authentication or user accounts
- Animations or complex hero graphics
- Backend changes — purely frontend routing + static content

## Open questions
- Should the welcome page be the default route (`/`) with the tracker at `/app`, or a modal/overlay on first visit?
- Should returning users (e.g. via localStorage flag) skip the welcome page automatically?

## Approval
Run `lane approve` — lane stamps the frontmatter (name, date, content hash) after you confirm.
Editing this file after approval invalidates the stamp and reopens the gate.
