# Ingestion run spec

This is the exact, repeatable job the scheduled agent runs each cycle. It is
written as instructions an agent can follow directly.

## Goal

Find genuinely new developments at the **digital assets × financial crime**
intersection since the last run, draft them as `Item`s, and **auto-publish**
them by appending to `web/src/content/feed.json`.

## Inputs

- [`sources.ts`](sources.ts) — the source registry to scan.
- `web/src/content/items.ts` + `web/src/content/feed.json` — existing items;
  use their `id`s and `title`s to **dedupe** (don't re-publish the same story).

## Steps

1. **Scan / search** the registry and the web for items dated since the last
   `lastUpdated` (regulation, enforcement, reports, funding/M&A, typologies).
2. **Dedupe** against existing ids/titles; skip anything already covered.
3. **Draft** each new item as an [`Item`](../web/src/content/types.ts):
   - `type` (signal/regulatory/venture/solution/typology), `title`, `summary`;
   - **`soWhat`** — what it means for a regulated bank's financial-crime posture;
   - `date` (event), `addedAt` (today), `addedBy: "agent"`, `status: "published"`;
   - `region`, `impact`, `tags`, and **`sources` with at least one URL**;
   - type extras where relevant (venture/solution/typology blocks).
4. **Validate** (hard gates — drop the item if it fails):
   - has ≥1 source URL; no fabricated specifics; illustrative content labelled
     `[Illustrative]`; paywalled bodies summarised-and-linked only.
5. **Write**: append the new items to `feed.json` and set `lastUpdated` to today.
6. (Remote mode) commit the diff: `feat(feed): ingest YYYY-MM-DD (N items)`.

## Output shape (`feed.json`)

```json
{ "lastUpdated": "YYYY-MM-DD", "items": [ /* Item objects */ ] }
```

## Example run

The 2026-06-03 run produced 7 items (3 regulatory, 2 signal, 1 venture, 1
typology) — the GENIUS Act stablecoin NPRM, the FATF stablecoin report, the
FDIC rule, the OFAC/Tether $344m freeze, DPRK IT-worker laundering, TRM's
Series C, and Treasury's "programmable enforcement" push — each with a source
URL and a "So what". That run is the current contents of `feed.json`; use it
as the quality bar.

## Cadence

Daily or weekly. Keep runs small and well-sourced; a steady trickle of sharp,
cited items beats a flood. If a run finds nothing new, do nothing (don't pad).
