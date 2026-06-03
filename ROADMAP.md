# Roadmap

## Phase 1 — foundation ✅

- React 19 + Vite + Tailwind v4, one-model-many-views.
- Real, sourced seed content; **dark / neutral / violet** DefiLlama-style UI
  (sidebar + stat tiles + dense expandable tables).
- Project docs: `CLAUDE.md` + `docs/`.

## Phase 2 — the ingestion agent — pipeline ✅ · scheduling next

- **Auto-publish** pipeline: agent writes `published` items to
  [`web/src/content/feed.json`](web/src/content/feed.json), merged into the
  streams by `content/index.ts`. **No human-in-the-loop** (per the
  auto-publish decision); the Review queue became the **Activity** log.
- Guardrail replacing the human: every item must carry a **real source URL**
  (summarise-and-link).
- **First real run done** (2026-06-03, 7 sourced items) — see
  [`agent/INGEST.md`](agent/INGEST.md) and [`agent/README.md`](agent/README.md).
- **Remaining:** wire the recurring schedule (remote routine on GitHub, or a
  local scheduled task — see `agent/README.md`).

## Phase 3 — analytics & radar

- Regulatory **radar**: forward-looking timeline of key dates (e.g. MiCA
  1 Jul 2026, GENIUS rules effective +12 months).
- Deeper metrics on real data where licensing allows.

## Phase 4 — refinements

- Optional: a lightweight "hide" safety valve in Activity; per-stream sorting
  and search; a charting library.

## Deliberately deferred

- Auth / hosting so it's reachable without a terminal.
- Rename off the "Sentinel" placeholder + branding.
- Tests / lint / CI (add when it becomes a shared tool).
