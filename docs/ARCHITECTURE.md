# Architecture

## The core idea: one content model, many views

Every tracked thing — a news signal, a regulatory move, a funding round, a
vendor, a laundering typology — is a single [`Item`](../web/src/content/types.ts)
with a `type` discriminator (`signal | regulatory | venture | solution | typology`).

- The **single store** is [`web/src/content/items.ts`](../web/src/content/items.ts)
  (a typed array; git-versioned = an audit trail).
- Each **tab is a filtered view** over that store. No tab has its own data
  model or fetching logic.
- The **ingestion agent** (Phase 2) only ever appends `Item`s — it never
  touches view code.

This is what keeps the app decluttered as it grows. Adding a tab is a nav
entry + (optionally) a `DataTable` variant — never new plumbing.

## Module map

| Path | Responsibility |
|---|---|
| `web/src/App.tsx` | Shell: sidebar + main; merges seed + agent feed (`ALL_ITEMS`) with any overlay; routes `page → view` |
| `web/src/components/Sidebar.tsx` | Left nav (the `Page` type lives here); "new agent items" badge |
| `web/src/components/DataTable.tsx` | Dense, expandable table for Signals/Ventures/Solutions (per-`variant` columns) with search + sortable headers |
| `web/src/components/ItemDetail.tsx` | Shared content block (summary, "So what", type-extras, sources with primary/secondary tags, trust badges (verified · confidence), per-item copy actions, review actions) |
| `web/src/components/ItemCard.tsx` | `Panel` + `ItemDetail` — used by Overview & Activity |
| `web/src/components/CopyButton.tsx` | Ghost copy-to-clipboard control (citation / deck bullet); used inside `ItemDetail` |
| `web/src/components/ExportMenu.tsx` | Bulk export dropdown (copy Markdown · download .md / .csv) over a view's in-scope items; optional `intro` lead paragraph (theme primer) |
| `web/src/components/BriefingPack.tsx` | `PackToggle` (per-item) + the floating `BriefingPackDrawer` — curate across views, reorder, export a one-pager |
| `web/src/components/VendorMatrix.tsx` | Solutions comparison grid (vendors by category, stance-ordered) — the "Matrix" view mode |
| `web/src/components/Term.tsx` | Inline glossary term — dotted-underline trigger, definition on hover/focus (looks up `glossary.ts`) |
| `web/src/views/Brief.tsx` | Overview: stat tiles, auto-publish banner, a "This week" pulse (movers + digest copy/download), latest list |
| `web/src/views/Learn.tsx` | Knowledge hub: guided "start here" path (stream tour, how to read an item) + the searchable glossary |
| `web/src/views/Themes.tsx` | Curated topic briefings — one page per theme, aggregating related items + a primer; per-theme `ExportMenu` (primer leads the Markdown) |
| `web/src/views/Collection.tsx` | Generic: filters by `types`, region chips, a Verified-only filter, an `ExportMenu`, a Table/Matrix toggle (solutions), renders a `DataTable` or `VendorMatrix` |
| `web/src/views/Intelligence.tsx` | Typology library (each card expands to a "How it works" primer + key-term chips) + coverage bars |
| `web/src/views/Trends.tsx` | Time-series analytics: date-ranged monthly volume × risk, theme momentum (click a row to drill into the theme), top topics, and a weekly-digest export |
| `web/scripts/digest.ts` | Writes `DIGEST.md` at the repo root (`npm --prefix web run digest`, via `tsx`) — the agent runs it each cycle |
| `web/src/views/Activity.tsx` | Transparency log of what the agent auto-published (newest first) |
| `web/src/views/Radar.tsx` | Regulatory radar: upcoming milestones (countdowns) + recently-landed regulatory items |
| `web/src/content/` | `types.ts` · `taxonomy.ts` · `items.ts` (seed) · `feed.json` (agent output) · `themes.ts` (theme briefings) · `glossary.ts` + `primers.ts` (knowledge layer) · `milestones.ts` (radar dates) · `index.ts` (merges seed+feed → `ALL_ITEMS`) |
| `web/src/lib/` | `ui.tsx` (primitives) · `uiTokens.ts` (colour tokens) · `store.ts` (review overlay) · `pack.ts` (briefing-pack selection) · `utils.ts` · `insights.ts` (derived metrics + time-series) · `digest.ts` (weekly one-pager) · `export.ts` (delivery & export — see below) |
| `web/src/components/viz.tsx` | Chart primitives (CSS/flex, no chart lib): `ImpactMix`, `MiniBars`, `MonthlyImpactChart`, `MomentumList` |

## State: the review overlay

Seed items ship with a baseline `status`. The reviewer's approve/reject
decisions are stored as a **localStorage overlay** keyed by item id
([`lib/store.ts`](../web/src/lib/store.ts), `useSyncExternalStore`). `App.tsx`
merges the overlay onto the seed at render:

```
status = overlay[id] ?? item.status        // published | pending | rejected
```

- `published` is the default — the agent **auto-publishes**, so items appear
  in their stream's view immediately.
- `rejected` (via the overlay) hides an item — unused by default; reserved for
  an optional "hide" valve in Activity.

Phase 2 is live: the agent appends `published` items to `feed.json`, merged by
`content/index.ts` into `ALL_ITEMS`. See [`agent/INGEST.md`](../agent/INGEST.md).

The **briefing pack** ([`lib/pack.ts`](../web/src/lib/pack.ts)) reuses this
exact pattern — an ordered list of item ids in a localStorage overlay via
`useSyncExternalStore`. Order matters (it's a curated narrative), so it's an
array with reorder, where the review overlay is a per-id map.

## Delivery & export

Same discipline as the content model — **one engine, many call sites**.
[`lib/export.ts`](../web/src/lib/export.ts) holds pure formatters that turn
`Item`s into pasteable / downloadable text:

- `citationText(item)` — a sourced, absolute-dated citation line.
- `deckBullet(item)` — title + tab-indented "So what" (pastes as a slide bullet + sub-bullet).
- `itemsToMarkdown(items, title)` — a briefing doc grouped by type.
- `itemsToCsv(items)` — one row per item, BOM-prefixed on download for Excel.

The two side-effects (`copyText`, `downloadText`) are the only impure parts,
kept apart so the formatters stay reusable. Call sites:

- per-item `CopyButton`s in `ItemDetail` (`citationText` / `deckBullet`);
- the `ExportMenu` in each `Collection` header and on Theme pages (whole view, grouped by type; theme exports lead with the primer via `intro`);
- the `BriefingPackDrawer`, which exports a **curated one-pager** in pack order
  via `itemsToMarkdown(items, title, { grouped: false })`.

The `VendorMatrix` is a second *view* of the solution Items (no new data),
so the header `ExportMenu` still covers it. Adding a new export surface =
call these functions, never re-format inline.

## Knowledge layer

The teaching layer over the same content — three pieces, no new data model:

- **Glossary** ([`content/glossary.ts`](../web/src/content/glossary.ts)) — ~35
  terms with a short definition, optional bank "so what", and a source on the
  canonical frameworks. `<Term id="…">` ([`components/Term.tsx`](../web/src/components/Term.tsx))
  renders any of them as an inline hover/focus tooltip; it falls back to plain
  text if the id is unknown, so it's always safe to wrap a word.
- **Typology primers** ([`content/primers.ts`](../web/src/content/primers.ts)) —
  a plain-language "how it works" per typology `Item` (keyed by id), shown as an
  expandable card section on **Intelligence** with key-term chips.
- **Learn hub** ([`views/Learn.tsx`](../web/src/views/Learn.tsx)) — the front
  door: a guided "start here" path (how to read an item, a clickable stream
  tour, how to deliver) plus the searchable glossary. One nav tab.

Definitions of standard industry terms are general knowledge (no source
needed per the integrity rules); only the canonical frameworks link out.

## How to add a new tab

1. If it's a new content kind, add a `type` to `Item` and a `TYPE_META` entry.
2. Seed some `Item`s in `items.ts`.
3. Add a `Page` id + nav entry in `Sidebar.tsx`.
4. Render it in `App.tsx` — usually just another `<Collection types={[…]} variant=… />`.
   Add a `DataTable` column set only if the existing variants don't fit.

No new state, no new store, no bespoke layout.
