<!--
Sync Impact Report
- Version change: (template) → 1.0.0
- Modified principles: n/a (initial ratification)
- Added sections: Core Principles (5), Product & Data Constraints,
  Development Workflow, Governance
- Removed sections: template placeholders (all replaced)
- Follow-up TODOs: none
-->
# Railway Booking Constitution

## Core Principles

### I. No Fee Surprises (NON-NEGOTIABLE)

Any figure shown before checkout is the figure charged. Fares in the UI are
inclusive of GST, railway surcharge, and every other mandatory charge. Zero
convenience fee is a promise the interface must keep visually as well as
numerically: no component may introduce a charge at payment that was not
visible during search. Monetization, if ever added, must never reintroduce a
hidden checkout charge.

Rationale: this is the product's core promise per PRODUCT.md and is not
negotiable in the UI.

### II. Brand Boundaries

The interface MUST NOT resemble official IRCTC or Indian Railways branding and
MUST NOT use their marks, logos, or proprietary visual assets, or any device
that implies endorsement. The wordmark "Railway Booking" is fixed — never
renamed or restyled. The night-train navy / platform saffron relationship and
the train mark stay as established in code; individual token values may evolve,
the relationship may not.

### III. Accessibility Is the Bar (WCAG 2.2 AA)

All text clears 4.5:1 (3:1 for large text) on its actual composited
background, including text over photography. Every animation has a
`prefers-reduced-motion` path that reduces movement while preserving state and
feedback. Mobile is a first-class surface: the primary journey works one-handed
on a small screen over slow Indian mobile data. A page that fails contrast or
reduced-motion review does not ship, regardless of how the feature performs
otherwise.

### IV. One Destination, Two Speeds

Tatkal urgency and calm planning are deliberately distinct experiences, never
one compromise flow. The deadline is the product: quota-open moments get
design attention for urgency; planning flows get legibility and reassurance.
Reassure at the high-stakes moments — quota open, waitlisted, cancellation
deadline — where money and disappointment are both live.

### V. Honest Motion, Boring Code

Motion is authored with Framer Motion (the reason the stack was chosen) and
every animated moment must preserve state and feedback under reduced motion.
Code follows the laziest correct solution: no abstraction without a second
caller, no dependency for what a few lines do, boring over clever. A 3am
reader must decode any animation and any route in one pass.

## Product & Data Constraints

- **Voice:** plain, specific, no hype. Copy names the fare, the deadline, and
  the recovery.
- **Evidence only:** on-page figures and testimonials are the real, sourced ones
  from PRODUCT.md. Wikimedia CC BY-SA photo attribution renders on every page
  that shows those photos and survives any layout change.
- **Data boundary:** frontend-only with mock data behind swap-able modules; no
  backend calls. Mock PNR/booking generation must never look like a real
  confirmed ticket beyond what the demo labels itself.
- **Scope:** search, booking flow, PNR, and account pages follow
  `CAPABILITIES.md`; specs live at `specs/<module-id>/spec.md`.

## Development Workflow

- The capability map (`CAPABILITIES.md`) is the index of modules; a module is
  not built until its spec exists and has been approved.
- `npm run build` must pass before any hand-off. Non-trivial logic leaves one
  runnable check (`npm run check` / a small self-check script).
- Ask-first: adding dependencies, changing routing structure, or altering the
  design tokens.
- Never: commit secrets, remove a failing check to go green, or delete
  photo attribution.

## Governance

This constitution supersedes ad-hoc preferences for this repository. Amendments
are made through `/speckit.constitution`, versioned per semantic versioning
(MAJOR: principle removal/redefinition; MINOR: new principle; PATCH:
clarification), and reviewed against the Sync Impact Report attached to each
amendment. Every spec, plan, and review checks compliance with Principles I–III
explicitly; violations block merge.

**Version**: 1.0.0 | **Ratified**: 2026-10-08 | **Last Amended**: 2026-10-08
