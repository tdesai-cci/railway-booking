# Data Model: Routing Shell

The shell introduces **no domain entities** — no passengers, bookings, or PNRs
(those belong to `booking-flow`, `pnr-lookup`, `my-bookings`). The only record
is navigation structure.

## RouteConfig (navigation record)

One row per page in the site map. Lives in `src/routes.jsx`.

| Field | Type | Rules |
|---|---|---|
| `path` | string | Unique; starts with `/`; no trailing slash |
| `label` | string \| null | Display label; `null` for home (wordmark serves as its label) |
| `nav` | `"header" \| "footer" \| "mobile" \| null` | Which surfaces render it; `null` = reachable only by direct URL |
| `owner` | module id | Must match a module id in `CAPABILITIES.md` |
| `page` | component | Real page component |
| `placeholder` | `{ blurb, cta }` | Present **only** while `owner` module has not shipped; removed when the real page lands |
| `homeAnchor` | string \| null | Marks an in-page home anchor (`search`, `faq`, …) — never its own route (spec FR-005) |

### Invariants

1. Every header/footer/mobile link target resolves to a row (or a
   `homeAnchor` on home) — **FR-002**, enforced by `npm run check`.
2. Exactly one row per `path`.
3. `placeholder` and a shipped `page` are mutually exclusive — a row shows a
   placeholder until its owning module replaces it (**FR-006**).
4. Unknown paths render `NotFound` — never fall through to a blank render
   (**FR-003**).

### State transitions (mobile menu, kept from current UI)

`closed → open → closed` — closes on any navigation (**FR-007**);
`aria-expanded` follows state.

## Entities deferred to later modules

Booking, Passenger, PNR, Session, Itinerary: **not modeled here**. Their specs
(`specs/NNN-booking-flow`, etc.) own them; this module must not pre-build
schemas it cannot test (YAGNI, constitution V).
