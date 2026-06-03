# Runbook

## Run

```bash
cd da-fincrime-intel/web
npm install        # one-time
npm run dev        # → http://localhost:5174
```

- **Port 5174** (the Compliance Engine owns 5173 — don't collide).
- Preview launch config is named **`sentinel`** in the repo-root
  `.claude/launch.json` (runs `npm --prefix da-fincrime-intel/web run dev`).
  Start it with `preview_start("sentinel")`.

## Verify a change

1. **Typecheck:** `web/node_modules/.bin/tsc --noEmit -p web/tsconfig.json`
   → expect `TYPECHECK CLEAN`.
2. **Console:** `preview_console_logs(level:"error")` → expect none.
3. **Structure/content:** `preview_snapshot` (the accessibility tree).
4. **Production build (optional, heavier):** `npm run build` (tsc + vite build).

> v0.1 has no test/lint/CI set up yet (deliberately lean for a personal
> tool). Typecheck + snapshot is the bar. Add Vitest/Playwright if/when this
> grows toward a shared tool.

## The headless gotcha — important

**`preview_screenshot` times out on this machine** — headless rasterisation
is blocked here. This is environmental, not a bug in the app. **Verify via
`preview_snapshot`** (accessibility tree: exact text, roles, structure) and
`preview_console_logs`. Don't burn time retrying screenshots. (Same
constraint is noted in the machine-local memory's image-generation pipeline.)

## Common interactions to snapshot-test

- Nav: `nav[aria-label="Primary"] button:nth-child(n)` (Overview…Review).
- Expand a table row: `main button[aria-expanded="false"]`.
- Review actions: the approve/reject buttons inside a pending `ItemCard`;
  approving drops the sidebar "Review" badge and removes the row.
- Reset: the "Reset demo decisions" button restores the seeded queue.

## Gotchas

- `vite-env.d.ts` (`/// <reference types="vite/client" />`) is required or
  `tsc` errors on the `index.css` side-effect import.
- Review overlay localStorage key: `sentinel.review.v1`.
- Tailwind v4 only generates classes it sees as **literal strings** — keep
  colour in the enumerated tokens (see [DESIGN](DESIGN.md)).
