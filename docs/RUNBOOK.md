# Runbook

## Run

```bash
cd da-fincrime-intel/web
npm install        # one-time
npm run dev        # → http://localhost:5174
```

- **Port 5174** (the Compliance Engine owns 5173, don't collide).
- Preview launch config is named **`sentinel`** in the repo-root
  `.claude/launch.json` (runs `npm --prefix da-fincrime-intel/web run dev`).
  Start it with `preview_start("sentinel")`.

## Verify a change

1. **Typecheck:** `web/node_modules/.bin/tsc --noEmit -p web/tsconfig.json`
   → expect `TYPECHECK CLEAN`.
2. **Lint:** `npm --prefix web run lint` (ESLint 9 flat config in `web/eslint.config.js`).
3. **Unit tests:** `npm --prefix web test` (Vitest; covers the pure export
   formatters in `web/src/lib/export.test.ts`).
4. **Console:** `preview_console_logs(level:"error")` → expect none.
5. **Structure/content:** `preview_snapshot` (the accessibility tree).
6. **Production build:** `npm --prefix web run build` (tsc + vite build).

> **CI:** [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) runs
> lint + test + build on every push/PR to `main`. No secrets needed (the
> `ANTHROPIC_API_KEY` is only for the agent), and it's independent of the
> Vercel git-linked deploy. Tests live next to the code as `*.test.ts`.

## The headless gotcha: important

**`preview_screenshot` times out on this machine**: headless rasterisation
is blocked here. The cause is the environment and the app is fine. **Verify via
`preview_snapshot`** (accessibility tree: exact text, roles, structure) and
`preview_console_logs`. Don't burn time retrying screenshots. (Same
constraint is noted in the machine-local memory's image-generation pipeline.)

## Common interactions to snapshot-test

- Nav: `nav[aria-label="Primary"] button` (Overview…Activity, 10 tabs).
- Expand a table row: `main button[aria-expanded="false"]`.
- Add to briefing pack: the "Add to pack" toggle in an expanded `ItemDetail`;
  the floating pack drawer appears (bottom-right) once the pack is non-empty.
- Drill a theme: click a momentum row on Trends, or a "This week" chip on
  Overview → the theme's briefing page.

## Gotchas

- `vite-env.d.ts` (`/// <reference types="vite/client" />`) is required or
  `tsc` errors on the `index.css` side-effect import.
- Briefing-pack localStorage key: `sentinel.pack.v1`.
- Tailwind v4 only generates classes it sees as **literal strings**: keep
  colour in the enumerated tokens (see [DESIGN](DESIGN.md)).
