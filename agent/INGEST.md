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
   **FCA publications — sweep exhaustively.** Each run, enumerate the FCA's own
   listings and add EVERY crypto- or financial-crime-related publication not
   already in the store (dedupe by `publication.ref`, e.g. `CP25/25`), not just
   the headline ones:
   - crypto regime index (lists all crypto CP/DP/GC): https://www.fca.org.uk/firms/new-regime-cryptoasset-regulation
   - financial-crime hub: https://www.fca.org.uk/firms/financial-crime
   - publications search filtered to "cryptoasset" and to "financial crime": https://www.fca.org.uk/publications
   Capture consultation papers (CP), discussion papers (DP), policy statements
   (PS), guidance consultations (GC), finalised guidance (FG) and relevant
   blogs/speeches. Take the title, **exact date** and URL from the FCA page
   itself (a primary source) — never guess a reference or date.
2. **Dedupe** against existing ids/titles; skip anything already covered.
3. **Draft** each new item as an [`Item`](../web/src/content/types.ts):
   - `type` (signal/regulatory/venture/solution/typology), `title`, `summary`;
   - **`soWhat`** — what it means for a regulated bank's financial-crime posture;
   - `date` (event), `addedAt` (today), `addedBy: "agent"`, `status: "published"`;
   - `region`, `impact`, `tags`, and **`sources` with at least one URL**;
   - `confidence` (`high`/`medium`/`low`) — your honest certainty in the item;
   - mark each source's `kind`: `primary` (the official / originating document —
     a regulator, court, the filing itself) or `secondary` (reporting / analysis);
   - type extras where relevant (venture/solution/typology blocks);
   - for a **regulator publication** (e.g. an FCA paper) use `type: "regulatory"`
     and set the `publication { issuer, kind, ref }` extra (e.g. issuer "FCA",
     kind "Consultation Paper", ref "CP25/14") — it then surfaces in both Signals
     and the **FCA** tab;
   - **never set `verified`** — that flag is a human vouch only. The agent
     publishes unverified; a human marks `verified: true` when they vouch.
4. **Validate** (hard gates — drop the item if it fails):
   - has ≥1 source URL; no fabricated specifics; illustrative content labelled
     `[Illustrative]`; paywalled bodies summarised-and-linked only.
5. **Write**: append the new items to `feed.json` and set `lastUpdated` to today.
6. **Digest**: regenerate the rolling weekly one-pager — `npm --prefix web run digest`
   (writes `DIGEST.md` at the repo root: a "what moved + so what" summary of the
   last 7 days, by `addedAt`). Cheap and idempotent — run it every cycle so the
   digest stays current.
7. (Remote mode) commit the diff (include `DIGEST.md`): `feat(feed): ingest YYYY-MM-DD (N items)`.

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
