# Quickstart: Routing Shell Validation

Manual walk-through proving the shell end-to-end. Prereqs: Node 20+, repo root.

## Setup

```powershell
npm install            # adds react-router-dom
npm run dev            # http://localhost:5173
```

Gates (run before any hand-off):

```powershell
npm run build          # must pass
npm run check          # must pass, incl. new route-table assertions
```

## Scenarios → expected outcomes

| # | Scenario (spec ref) | Expected |
|---|---|---|
| 1 | Click every header, footer, and mobile-menu link (US1/FR-002, SC-001) | Each renders its own page with a changed URL; zero dead links; in-page anchors (Book Ticket, FAQ…) scroll on home without leaving it (FR-005) |
| 2 | Click the wordmark from any page (US1) | Home renders |
| 3 | On a narrow viewport, open mobile menu → tap a link (US1/FR-007) | Menu closes, target page renders |
| 4 | On any sub-page: refresh, then copy URL into a fresh tab (US2/FR-001, SC-002) | Same page renders both times, no flash of home |
| 5 | Enter a garbage URL, e.g. `/nope` (US2/FR-003, SC-003) | Not-found page with a working link home; no blank screen/console error |
| 6 | After deploy to a production static host: deep-link `/check-pnr` directly (FR-001) | Page renders — **requires the host to fall back to index.html**; if the host can't, switch to `HashRouter` (one import, see research.md #2) |
| 7 | Navigate forward twice → press Back (US2/FR-004, SC-004) | One Back = previous page, scrolled to top; anchor URL scrolls to its section |
| 8 | Visit every placeholder route (US3/FR-006) | Labeled placeholder naming the future content + working CTA; never blank/crash |
| 9 | DevTools → emulate `prefers-reduced-motion` → navigate (constitution III) | Route changes and residual motion still work, movement reduced, state/feedback preserved |
| 10 | Keyboard-only pass: Tab through header → route → footer (constitution III) | Focus moves to `<main>` on route change (no tabbing into stale DOM); all controls reachable, visible focus |

## Reading

- Route table contract: [contracts/route-table.md](contracts/route-table.md)
- Decisions & caveats: [research.md](research.md)
