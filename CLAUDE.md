# CLAUDE.md — entry point for Sentinel

**Small. Stable. Pointers, not encyclopedia.** This is the table of contents
new sessions read first; detail lives in `docs/`. Same discipline as the
Compliance Engine: give the agent a **map, not a 1,000-page manual**. This
file changes rarely — only when a project-wide rule changes.

---

## What this is

**Sentinel** — an agent-tended, one-stop web app tracking everything at the
**digital assets × financial crime** intersection: news/regulation,
ventures, the vendor/build-vs-buy landscape, and a laundering-typology
library. A personal/team intelligence tool (v0.1), standalone, separate from
the Compliance Engine. React 19 + Vite + Tailwind v4. Dev server on
`localhost:5174`; preview launch config `sentinel` (engine stays on 5173).

## The thesis (drives every decision)

**Not "another crypto news aggregator" — an intelligence layer with a
bank-financial-crime point of view.** Every item carries a **"So what"**
stating what the development means for a regulated institution's posture.
The agent does the monitoring and first-draft synthesis; human judgement is
what makes it credible. The Ventures + Solutions streams feed real decisions
(the Notabene-vs-in-house build/buy call).

---

## Three rules every change honours

### 1. One content model, many views — non-negotiable

Every tracked thing is one `Item` (`web/src/content/types.ts`) with a `type`
discriminator. Each tab is a **filtered view** over the single store
(`web/src/content/items.ts`). Adding a tab = nav entry + seed data, **never**
new plumbing. The ingestion agent only ever emits `Item`s. Declutter as you
go; reuse `DataTable`, `ItemDetail`, `Panel`, the tokens — don't add bespoke
surfaces.

### 2. Design identity — dark, neutral, violet

Deliberately **distinct from the Engine** (light + blue). Near-black neutral
base (`neutral-950/900/800`), a single **violet** accent, amber/rose risk
bands. DefiLlama-style structure: left sidebar + stat tiles + dense
expandable tables. All colour is enumerated in `lib/uiTokens.ts` (Tailwind
v4 only sees literal class strings — never build colour by interpolation).
The accent is swappable in one file.

### 3. Content integrity — for humans and the agent

Cite a source for every factual claim. **Never** fabricate enforcement
actions or financings. Label anything illustrative `[Illustrative]`.
Summarise-and-link; never republish paywalled intel (Chainalysis / TRM /
Elliptic) wholesale. The agent **auto-publishes** (no human gate), so the
guardrail is hard: **every auto-published item must carry a real source
URL** — no source, no publish. The Activity view is a transparency log.

---

## Where to look — the map

| Working on… | Read |
|---|---|
| Architecture, the one-model-many-views design, file map, state, adding a tab | [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) |
| Design system: dark/violet tokens, layout, components, a11y, changing the accent | [`docs/DESIGN.md`](docs/DESIGN.md) |
| The `Item` schema, taxonomy, integrity rules, seeding & status lifecycle | [`docs/CONTENT.md`](docs/CONTENT.md) |
| Running it: ports, launch.json, typecheck, the preview/headless gotcha | [`docs/RUNBOOK.md`](docs/RUNBOOK.md) |
| Phase 2 ingestion agent: auto-publish contract + the ingest run spec | [`agent/README.md`](agent/README.md) · [`agent/INGEST.md`](agent/INGEST.md) |
| Phase status + deliberately-deferred items | [`ROADMAP.md`](ROADMAP.md) |
| Public, user-facing overview | [`README.md`](README.md) |

---

## Verification discipline (every change)

1. `tsc --noEmit` clean (run via `web/node_modules/.bin/tsc`).
2. `npm --prefix web run lint` + `npm --prefix web test` green (ESLint +
   Vitest; **CI runs lint + test + build on every push** — see RUNBOOK).
3. Preview console clean (no errors/warnings).
4. **Verify via preview _snapshots_, not screenshots** — headless
   rasterisation is blocked on this machine, so screenshots time out;
   accessibility-tree snapshots are reliable. See [`docs/RUNBOOK.md`](docs/RUNBOOK.md).
5. Decluttered + on-identity (dark/neutral/violet) — confirm before reporting.

---

## Doc-gardening — keep this map fresh

- When a module changes, **update the relevant `docs/<TOPIC>.md` in the same
  change**. CLAUDE.md itself changes rarely — only for a project-wide rule.
- If a topic file outgrows ~300 lines, split it. Don't recreate the manual.
- A fact lives in exactly one place; everywhere else links to it.

## Machine-local memory

A personal auto-memory exists at `~/.claude/projects/.../memory/*.md` (not in
this folder) — see `project_sentinel_intel.md`. This `CLAUDE.md` + `docs/`
is the in-repo source of truth; keep it current — it is what makes future
sessions cheap.
