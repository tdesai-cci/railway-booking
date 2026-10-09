# Contract: Route Table ↔ Navigation

**Type**: internal UI contract (single source of truth pattern)
**Consumers**: router, header nav, footer nav, mobile menu, `npm run check`

## Interface

`src/routes.jsx` exports:

```js
routes: RouteConfig[]   // one row per page — see data-model.md for fields
homeAnchors: string[]   // in-page section ids valid on home only
```

## Rules (testable)

1. **Router**: `<Routes>` is generated from `routes`; any path not listed
   renders `NotFound`.
2. **Header / Footer / Mobile menu**: links are filtered views of `routes`
   by `nav` field. A surface may not hardcode a path string — if it's not in
   the table, it can't be linked.
3. **Home anchors**: rendered as links to `/#<id>`; valid only on home.
   `npm run check` asserts every anchor id exists as a section id in
   `Home.jsx`'s markup and that no anchor appears as a `path` row.
4. **Check assertion** (in `scripts/self-check.mjs`):
   - every `path` is unique and starts with `/`
   - every row has `page` xor `placeholder`
   - every placeholder row's `owner` is in the `CAPABILITIES.md` module list
   - header/footer/mobile link labels used in `App.jsx` all exist in `routes`

## Adding a page (later modules)

1. Add/replace one row in `routes.jsx` (real `page`, drop `placeholder`).
2. Nothing else — nav surfaces update automatically; the check enforces it.

This contract is what makes FR-002 ("no dead links") a check, not a hope.
