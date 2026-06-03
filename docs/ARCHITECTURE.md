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
| `web/src/components/Sidebar.tsx` | Left nav (the `Page` type lives here); review-count badge |
| `web/src/components/DataTable.tsx` | Dense, expandable table for Signals/Ventures/Solutions (column config per `variant`) |
| `web/src/components/ItemDetail.tsx` | Shared content block (summary, "So what", type-extras, sources, review actions) |
| `web/src/components/ItemCard.tsx` | `Panel` + `ItemDetail` — used by Overview & Review |
| `web/src/views/Brief.tsx` | Overview: stat tiles, review callout, latest list |
| `web/src/views/Collection.tsx` | Generic: filters by `types`, region chips, renders a `DataTable` |
| `web/src/views/Intelligence.tsx` | Typology library + coverage bars (derived metrics) |
| `web/src/views/Activity.tsx` | Transparency log of what the agent auto-published (newest first) |
| `web/src/content/` | `types.ts` · `taxonomy.ts` · `items.ts` (seed) · `feed.json` (agent output) · `index.ts` (merges seed+feed → `ALL_ITEMS`) |
| `web/src/lib/` | `ui.tsx` (primitives) · `uiTokens.ts` (colour tokens) · `store.ts` (review overlay) · `utils.ts` |

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

## How to add a new tab

1. If it's a new content kind, add a `type` to `Item` and a `TYPE_META` entry.
2. Seed some `Item`s in `items.ts`.
3. Add a `Page` id + nav entry in `Sidebar.tsx`.
4. Render it in `App.tsx` — usually just another `<Collection types={[…]} variant=… />`.
   Add a `DataTable` column set only if the existing variants don't fit.

No new state, no new store, no bespoke layout.
