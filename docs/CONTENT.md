# Content model & integrity

## The `Item` schema

Defined in [`web/src/content/types.ts`](../web/src/content/types.ts). Core
fields on every item:

| Field | Notes |
|---|---|
| `id` | stable kebab-case slug |
| `type` | `signal \| regulatory \| venture \| solution \| typology` |
| `title`, `summary` | summary = 1–2 sentence synthesis |
| `soWhat` | **the bank financial-crime lens** — the differentiator; write one for every item |
| `date` / `addedAt` | event date / when it entered Sentinel (ISO `yyyy-mm-dd`) |
| `addedBy` | `agent \| human` (shown as provenance) |
| `status` | `published \| pending \| rejected` |
| `region`, `impact` | impact drives the risk chip (`low/medium/high`) |
| `confidence`, `verified` | `confidence` = trust signal (`high/medium/low`); `verified` = a human vouched — **never set by the agent** |
| `tags`, `sources` | sources = `{ name, url?, kind? }[]`; `kind` is `primary` (official/originating) or `secondary` (reporting/analysis) |

Type-specific extras (optional, populated per `type`):
`venture { company, round, amount, investors }` ·
`solution { vendor, category, stance, note }` ·
`typology { vector, controls[], obligations[] }`.

Labels/icons per type and the stance chips live in
[`taxonomy.ts`](../web/src/content/taxonomy.ts).

## Where items live

- [`items.ts`](../web/src/content/items.ts) — hand-seeded baseline.
- [`feed.json`](../web/src/content/feed.json) — **agent-published** items.
- [`index.ts`](../web/src/content/index.ts) — merges both into `ALL_ITEMS`.

## Status lifecycle — auto-publish

Phase 2 is **auto-publish**: the agent writes items straight to
`status:"published"` in `feed.json`. There is **no pending/approval step**.

```
agent ─▶ status:"published" ─▶ live in its stream + listed in Activity
```

`status` stays in the schema (`published | pending | rejected`) and views
filter to `published`, but nothing produces the other states today — the
human-in-the-loop review overlay was removed when auto-publish became the model.

## Integrity rules (enforced here and in the agent)

1. **Every item carries a source URL** — the hard guardrail that replaces the
   human reviewer under auto-publish. No source, no publish.
2. **Never fabricate** specific enforcement actions or financings.
3. **Label illustrative** content `[Illustrative]` in the title.
4. **Summarise-and-link** — never paste paywalled report bodies (Chainalysis
   / TRM / Elliptic). Store the takeaway, the "So what", and the URL.
5. Set `confidence` (`high/medium/low`) honestly, and mark each source's
   `kind` (`primary`/`secondary`). The agent **never** sets `verified` — that
   is a human vouch only (the client-ready tier). Marking an item verified =
   a human edits the content and commits it.

## Adding an item

- Human-curated → append to `ITEMS` in `items.ts` (`addedBy:"human"`).
- Agent → append to `feed.json` (`addedBy:"agent"`, `status:"published"`),
  per [`agent/INGEST.md`](../agent/INGEST.md).

Keep `soWhat` sharp — that is the product.

## Knowledge-layer content (not `Item`s)

Two reference modules feed the Learn hub and Intelligence (see
[`docs/ARCHITECTURE.md`](ARCHITECTURE.md#knowledge-layer)):

- [`glossary.ts`](../web/src/content/glossary.ts) — terms with a short
  definition, optional bank "so what", and `category`.
- [`primers.ts`](../web/src/content/primers.ts) — a "how it works" per
  typology `Item`, keyed by id.

Integrity stance: definitions of **standard industry terms are general
knowledge** — no source URL required (unlike `Item`s, where rule #1 is
absolute). Only canonical frameworks (FATF, OFAC, FinCEN, …) carry a link.
Never invent a definition you're unsure of; omit rather than guess.
