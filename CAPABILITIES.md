# Capability Map: Railway Booking v2

Approved 2026-10-08. Index of modules; each module gets its own spec at
`specs/NNN-<module-id>/spec.md` (spec-kit sequential numbering), then plan
and tasks, in dependency order. The active feature is recorded in
`.specify/feature.json`.

| Module id | Responsibility | Depends on |
|---|---|---|
| `shell` | Add react-router, real page routes, rewire header/footer/mobile nav to routes instead of `#anchors` | — |
| `ui-polish` | Landing polish: spacing, type hierarchy, responsive fixes, shared design tokens for new pages | — |
| `booking-flow` | Results → passenger details → seat map → payment → PNR confirmation (mock data) | `shell` |
| `pnr-lookup` | Check PNR page (header nav already promises it) | `shell` |
| `my-bookings` | Trip list, PNR status, cancel action — reads bookings created by `booking-flow` | `shell`, `booking-flow` |
| `account` | Sign-in page, mock guest/IRCTC session (PRODUCT.md: login only for history) | `shell` |
| `info-pages` | About, Help/Contact, Refund policy, Privacy, Terms | `shell` |

**Build order:** `shell` + `ui-polish` → `booking-flow`, `pnr-lookup`, `account`, `info-pages` → `my-bookings`

## Decisions

- Frontend only, mock data (no backend); PNR and bookings generated/looked up locally.
- `react-router-dom` added as the route library.
- UI work polishes the existing navy/saffron/motion style; wordmark and palette
  relationship are binding (PRODUCT.md Brand Commitments).
