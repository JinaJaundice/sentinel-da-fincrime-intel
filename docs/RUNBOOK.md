# Runbook

## Run

```bash
cd apps/sentinel/web
npm install        # one-time
npm run dev        # → http://localhost:5174
```

- **Port 5174** (the Compliance Engine owns 5173, don't collide).
- Preview launch config is named **`sentinel`** in the repo-root
  `.claude/launch.json` (runs `npm --prefix apps/sentinel/web run dev`).
  Start it with `preview_start("sentinel")`.

## Verify a change

1. **Typecheck:** `web/node_modules/.bin/tsc --noEmit -p web/tsconfig.json`.
2. **Lint:** `npm --prefix web run lint` (ESLint 9 flat config; 0 errors).
3. **Prose:** `npm --prefix web run prose` (the plain-language check over
   hand-authored copy; `feed.json` is not gated).
4. **Unit tests:** `npm --prefix web test` (Vitest; the export formatters and
   the digest).
5. **Build:** `npm --prefix web run build` (tsc + vite build).
6. **Design gate:** `npm --prefix web run design` over the build. Every page,
   both themes, 1440 and 390 wide: the two faces, the 11px floor, WCAG AA
   contrast, overflow, the tells, console. See [DESIGN](DESIGN.md).
7. **Look at it:** `npm --prefix web run shots -- <outdir>` writes full-page
   PNGs of every page in both themes at both widths plus five interaction
   states (an open row, the vendor matrix, a topic briefing, a country on
   the map, an open crime pattern). Open them and look; the gate cannot see
   taste.

> **CI:** [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) runs
> lint + prose + test + build on every push/PR to `main`. The design gate
> and the shots need a Playwright Chromium, which the laptop has and CI does
> not, so they run locally before a push. No secrets needed.

## Screenshots on this machine

The in-app Browser pane does not composite frames, so its screenshot tool
times out. **Playwright's headless Chromium renders fine**: `playwright` is
a dev dependency of `web/` and the browsers are installed under
`~/AppData/Local/ms-playwright`. Both `scripts/shots.mjs` and
`scripts/design-check.mjs` serve `dist/` on a local port and drive the app
through the rail (desktop) or the page picker (phone), because the app
switches pages in state rather than by route.

## Common interactions to test

- Nav: `nav[aria-label="Primary"] button[data-page="<id>"]` on desktop;
  `select[aria-label="Go to page"]` on a phone.
- Open a row: `main button[aria-expanded="false"]:not([aria-haspopup])`.
- Add to the briefing pack: the "Add to pack" action in an open row; the
  floating pack control appears (bottom-right) once the pack is non-empty.
- Drill a topic: click a row on Topic briefings, a topic on What is moving,
  or a topic on Today's briefing.

## Gotchas

- `vite-env.d.ts` (`/// <reference types="vite/client" />`) is required or
  `tsc` errors on the `index.css` side-effect import.
- Briefing-pack localStorage key: `sentinel.pack.v1`. Theme: `sentinel:theme`.
- Tailwind v4 only generates classes it sees as **literal strings**: keep
  colour in the enumerated tokens (see [DESIGN](DESIGN.md)).
- Plain CSS classes must sit inside `@layer components` (and base rules in
  `@layer base`), or they beat every Tailwind utility on the same element.
- A grid or flex child needs `min-w-0` (the `.panel` utility has it) or a
  long title widens the page at 390px. The gate's overflow check catches it.
