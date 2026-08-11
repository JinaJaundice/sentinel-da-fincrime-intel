# Roadmap

## Phase 1: foundation ✅

- React 19 + Vite + Tailwind v4, one-model-many-views.
- Real, sourced seed content; **dark / neutral / violet** DefiLlama-style UI
  (sidebar + stat tiles + dense expandable tables).
- Project docs: `CLAUDE.md` + `docs/`.

## Phase 2: the ingestion agent ✅ (scheduled & running)

- **Auto-publish** pipeline: agent writes `published` items to
  [`web/src/content/feed.json`](web/src/content/feed.json), merged into the
  streams by `content/index.ts`. **No human-in-the-loop** (per the
  auto-publish decision); the Review queue became the **Activity** log.
- Guardrail replacing the human: every item must carry a **real source URL**
  (summarise-and-link).
- **First real run done** (2026-06-03, 7 sourced items): see
  [`agent/INGEST.md`](agent/INGEST.md) and [`agent/README.md`](agent/README.md).
- **Remaining:** wire the recurring schedule (remote routine on GitHub, or a
  local scheduled task, see `agent/README.md`).

## Phase 3: analytics & radar

- Regulatory **radar**: forward-looking timeline of key dates (e.g. MiCA
  1 Jul 2026, GENIUS rules effective +12 months).
- Deeper metrics on real data where licensing allows.

## Phase 4: refinements

- Optional: a lightweight "hide" safety valve in Activity; a charting library.

## Phase 5: delivery & export

Turning Sentinel from a read-tool into a client-delivery tool. One formatter
engine ([`web/src/lib/export.ts`](web/src/lib/export.ts)), many call sites.

- **Tier A, export primitives ✅**: per-item copy-as-citation and
  copy-as-deck-bullet (in `ItemDetail`); a per-view **Export** menu, copy
  Markdown, download `.md` / `.csv`, in every Collection header
  (`ExportMenu`), scoped to the items currently shown.
- **Tier B ✅**: a **briefing-pack builder**, a floating, zero-footprint
  drawer (`BriefingPack.tsx`) to curate items across any view, reorder them and
  export a one-pager (ordered Markdown / CSV); and a **vendor comparison
  matrix** (`VendorMatrix.tsx`) as a Table/Matrix toggle on Solutions.
- **Per-theme export ✅**: each Theme page exports a ready-made briefing, 
  the primer leads, followed by the theme's grouped items.

## Phase 6: knowledge layer ✅

Turning Sentinel from a feed into a teaching tool. No new data model.

- **Glossary + tooltips**: `content/glossary.ts` (~35 terms) surfaced inline
  via `<Term>` (`components/Term.tsx`), hover/focus, accessible.
- **Typology primers**: `content/primers.ts`; each typology on Intelligence
  expands to a plain-language "how it works" + key-term chips.
- **Learn hub**: a new tab (`views/Learn.tsx`): a guided "start here" path
  (how to read an item, a clickable stream tour, how to deliver) + the
  searchable glossary.

## Phase 7: client-ready / verified tier ✅

The last of the four "next level" thrusts: trust signals on the one `Item`,
no new plumbing. Durable, git-versioned data fields (so they travel into
client exports), not a local overlay.

- **Verified**: a human-vouched `verified` flag (never set by the agent),
  shown as a violet shield; a **Verified-only** filter on every collection to
  build client packs from vouched items.
- **Confidence**: a `high/medium/low` trust signal, distinct from impact.
- **Source provenance**: each source tagged `primary` / `secondary`, badged
  on the item.
- Trust signals flow into the Markdown/CSV exports; the agent contract
  (`INGEST.md`) now emits `confidence` + source `kind` (but never `verified`).

All four "next level" thrusts are now delivered (Themes, Delivery & export,
Knowledge layer, Verified tier).

## Phase 8: dev infra ✅

Now that it's a shared, deployed tool: **ESLint 9** (flat config,
`web/eslint.config.js`) + **Vitest** unit tests for the pure export
formatters (`web/src/lib/export.test.ts`) + a **GitHub Actions CI**
([`.github/workflows/ci.yml`](.github/workflows/ci.yml)) running lint + test +
build on every push/PR to `main` (no secrets). See [`docs/RUNBOOK.md`](docs/RUNBOOK.md).

## Phase 9: trends & analytics ✅

A new **Trends** tab ([`web/src/views/Trends.tsx`](web/src/views/Trends.tsx))
over the accumulating feed: monthly volume stacked by impact, **theme/tag
momentum** (new items in the last 60 days vs the 60 before, rising / cooling),
and most-active topics. Pure derivations in `lib/insights.ts`
(`monthlyByImpact`, `momentum`, `countByMulti`); CSS chart primitives in
`components/viz.tsx` (`MonthlyImpactChart`, `MomentumList`). No new data model
, just the one store, so it sharpens as the agent publishes. Extended: a
**date-range** selector (All / 12m / 90d / 30d) scoping the period; momentum
rows **drill into the theme**; and a **weekly digest** one-pager
([`lib/digest.ts`](web/src/lib/digest.ts)), copy/download in-app, plus the
agent regenerates [`DIGEST.md`](DIGEST.md) each run (`npm run digest`, wired in
[`agent/INGEST.md`](agent/INGEST.md)). The **Overview** also carries a "This
week" pulse, top movers (`weeklyMovers`, click to drill into a theme) + the
digest copy/download.

## Phase 10: FCA publications tab ✅

A dedicated **FCA** tab tracking FCA publications (consultation & discussion
papers, policy statements, …) across crypto and financial crime, a filtered
lens over items carrying a `publication { issuer, kind, ref }` extra, so they
also surface in Signals. New [`views/FCA.tsx`](web/src/views/FCA.tsx) + an `fca`
`DataTable` variant; no new data model. Seeded with the **full crypto-regime
set** (DP23/4 → CP26/13, incl. CP25/25, CP25/40–42, GC26/2) + PS24/17, 
real papers, primary `fca.org.uk` sources. The agent now **sweeps the FCA
listings exhaustively** each run and dedupes by `ref` (see `agent/INGEST.md`).

## Phase 11: regulatory atlas ✅

An interactive **Atlas** tab ([`views/Atlas.tsx`](web/src/views/Atlas.tsx)): a
world map of crypto-regulation **status by jurisdiction**
(`implemented` / `in-progress` / `none`). The map
([`components/WorldMap.tsx`](web/src/components/WorldMap.tsx)) is **self-rendered**
, an equirectangular projection of a `world-atlas` topojson into SVG (no map
library), with status-tinted countries, pulsing clickable markers, and
drag-pan/zoom. Click a marker (or a name) → a detail panel with the status,
the bank "So what", key dates and **sources** to explore. Curated, sourced
data in [`content/jurisdictions.ts`](web/src/content/jurisdictions.ts) (~18
jurisdictions to start). The view is **lazy-loaded** so the topojson never
weighs down the initial bundle.

## Settled (former deferred items, decided 2026-06-06)

- **Hosting** ✅: live on Vercel, git-linked auto-deploy from `main`.
- **Access**: deliberately left **public** (content is summarise-and-link
  from public sources). Can lock down later via Vercel Deployment Protection.
- **Name**: **keeping "Sentinel"** for now (a rename would touch the repo,
  the Vercel project and the live URL).
- **Tests / lint / CI** ✅: done (Phase 8 above).
