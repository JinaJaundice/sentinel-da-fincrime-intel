# Sentinel — handoff

A session-to-session snapshot: the narrative, the gotchas, and where to pick
up. **Canonical detail lives elsewhere** — this file links out rather than
duplicating it (a fact lives in one place):

- Architecture, file map, state → [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)
- Design system → [`docs/DESIGN.md`](docs/DESIGN.md)
- `Item` schema, integrity rules → [`docs/CONTENT.md`](docs/CONTENT.md)
- Ports, launch.json, the headless gotcha → [`docs/RUNBOOK.md`](docs/RUNBOOK.md)
- The ingestion agent → [`agent/README.md`](agent/README.md) · [`agent/INGEST.md`](agent/INGEST.md)
- Phase status + deferred → [`ROADMAP.md`](ROADMAP.md)
- Project rules new sessions read first → [`CLAUDE.md`](CLAUDE.md)

---

## What it is

A dark, sleek web app that aggregates everything at the **digital assets ×
financial crime** intersection (news, regulation, ventures, vendors,
laundering typologies) — a combination not aggregated anywhere else. Built for
a bank financial-crime team for (a) knowledge building and (b) client-delivery
support. Every item carries a **"So what"** — what it means for a regulated
bank (the differentiator vs. a news feed).

## Where it lives

- **Code:** `web/` (the app) + `agent/` (the ingest spec)
- **Stack:** React 19 + Vite + Tailwind v4 + lucide. Dev server on port
  **5174** (preview launch config `sentinel`).
- **Live:** https://sentinel-da-fincrime-intel.vercel.app (Vercel, git-linked
  auto-deploy from `main`)
- **Repo:** github.com/JinaJaundice/sentinel-da-fincrime-intel (private)

## Architecture in one line

**One model, many views.** Every tracked thing is one `Item`
(`type ∈ signal | regulatory | venture | solution | typology`). Seed
(`content/items.ts`) + agent output (`content/feed.json`) merge via
`content/index.ts` → `ALL_ITEMS`. Each tab is a filtered view. See
[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

Tabs: Overview · Themes · Signals · Ventures · Solutions · Intelligence ·
Radar · Activity.

## What's built

- Command-center **Overview**, dense searchable/sortable tables with per-tab
  dashboards, **Radar** (key-date timeline), **Intelligence** (typology
  library), **Activity** (agent log).
- **Themes** — 6 curated topic briefings (Stablecoins, Sanctions/OFAC, Travel
  Rule, MiCA/EU, US rulemaking, State actors/DPRK), each a primer + aggregated
  items + risk-mix + key dates.
- **Delivery & export** (Phase 5, ✅) — the thing that turns Sentinel from a
  read-tool into a client-delivery tool. One formatter engine
  (`lib/export.ts`), many call sites:
  - per-item **copy citation** / **copy as deck bullet** (in `ItemDetail`);
  - a per-view **Export** menu — copy Markdown, download `.md` / `.csv` — on
    Signals/Ventures/Solutions and on each Theme page (theme exports lead with
    the primer);
  - a **briefing-pack builder** — a floating, zero-footprint drawer to curate
    items across any view, reorder, and export a one-pager;
  - a **vendor comparison matrix** — a Table/Matrix toggle on Solutions.
- **Knowledge layer** (Phase 6, ✅) — a **Learn** hub tab (guided "start here"
  path + searchable glossary), an accessible `<Term>` glossary tooltip, and a
  "how it works" **primer** on every typology in Intelligence.
- **Verified tier** (Phase 7, ✅) — trust signals on the one `Item`, as durable
  git-versioned data fields: a human **verified** shield (never set by the
  agent) + a **Verified-only** filter, a **confidence** signal, and
  **primary/secondary** source badges. All flow into the exports.

## The autonomous agent (daily routine)

**Auto-publish, no human-in-the-loop.** A local Claude Code scheduled task
(`sentinel-daily-ingest`, ~08:15 local) runs [`agent/INGEST.md`](agent/INGEST.md):
web-searches new DA×FinCrime developments → drafts `Item`s (every item needs a
real source URL) → appends `feed.json` → commits + pushes → Vercel
auto-redeploys. Runs while Claude Code is open (catches up on next launch) —
not a 24/7 cloud cron.

## Key gotchas (read before committing)

- **Vercel seat-block:** commits must be authored as
  `JinaJaundice <53195433+JinaJaundice@users.noreply.github.com>` or deploys go
  BLOCKED (`TEAM_ACCESS_REQUIRED`). The repo's local git identity is already
  set to this — don't change it.
- **Screenshots time out** on this machine (headless blocked) → verify via
  preview **snapshots** + `tsc --noEmit` (and `npm run build` before a push).
- **PowerShell commits:** avoid embedded quotes in `-m`; use
  `git commit -F <msgfile>`.
- **Direct to `main`:** this repo deploys from `main` and the agent commits
  there daily — the established workflow is commit-to-main, not feature
  branches/PRs.

## Parked

- The 24/7 claude.ai cloud routine (`/schedule` backend was down) and the
  GitHub Actions alternative (needs an `ANTHROPIC_API_KEY`). Decision: the
  local daily routine is enough for now.

## Next up

All four "next level" thrusts are now delivered (Themes · Delivery & export ·
Knowledge layer · Verified tier). What's left is the **deliberately deferred**
list in [`ROADMAP.md`](ROADMAP.md): auth/hosting so it's reachable without a
terminal, renaming off the "Sentinel" placeholder, and tests/lint/CI when it
becomes a shared tool. Otherwise: keep curating, let the agent run, and mark
items `verified` as you vouch for them.
