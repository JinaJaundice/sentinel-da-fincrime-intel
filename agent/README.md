# Sentinel ingestion agent (Phase 2)

The agent is what makes Sentinel "routinely updated." It
**monitors → classifies → drafts → publishes**, **autonomously**. As of
the auto-publish decision there is **no human-in-the-loop gate**: items go
straight to `published`. The [Activity](../web/src/views/Activity.tsx) view is
a transparency log of what it shipped. Nothing waits there for approval.

> **The one guardrail that replaces the human:** every auto-published item
> **must carry a real source URL** and **summarise-and-link** (never invent
> specifics). If the agent can't cite it, it doesn't publish it. This keeps
> "auto-publish" from becoming "auto-hallucinate" in a domain where a fake
> enforcement action is costly.

## The loop

```
 sources.ts ─▶ web search ─▶ dedupe (vs existing ids/titles)
                                  │
                                  ▼
                 draft Item { status: "published", addedBy: "agent",
                              soWhat, impact, sources:[{url}] }
                                  │
                                  ▼
            append to web/src/content/feed.json  +  bump lastUpdated
                                  │
                                  ▼
            merged by content/index.ts → live in the streams
                                  ▼
                 Activity view = transparency log
```

The agent writes **`web/src/content/feed.json`** (plain JSON, safe to
append, clean provenance), **not** `items.ts` (that stays the hand-seeded
baseline). The exact, repeatable run is specified in [`INGEST.md`](INGEST.md).

**Fetching:** pages are read with the local **Trafilatura** CLI (raw extracted
markdown), not WebFetch summaries. Titles, dates and reference numbers come
from the source's own text, which is what makes the no-fabrication guardrail
enforceable. Command + fallbacks in [`INGEST.md`](INGEST.md) ("Fetching pages").

## Output contract (the `Item` type)

Each item must:

- be a valid [`Item`](../web/src/content/types.ts) with `status: "published"`,
  `addedBy: "agent"`, and today's `addedAt`;
- include **at least one `source` with a URL** (hard requirement);
- carry a **"So what"** (the bank financial-crime lens) on top of the summary;
- estimate `impact`; for lower-confidence items, say so in the `summary`
  ("Confidence: medium, …");
- label anything unverifiable `[Illustrative]`; never invent financings or
  enforcement actions.

## Scheduling

A daily run is a natural **scheduled routine** (cron). Because `feed.json`
is git-versioned, every run is an auditable diff. Two ways to run it:

| Mode | How | Notes |
|---|---|---|
| **Remote routine** | Push this repo to GitHub, then a scheduled agent runs [`INGEST.md`](INGEST.md) and commits `feed.json` | Runs even when the laptop is off; needs the repo on GitHub |
| **Local** | A local scheduled task runs the ingest prompt against the working copy | Simpler; only runs when this machine is on |

See [`INGEST.md`](INGEST.md) for the exact prompt the schedule executes.

## Source registry

See [`sources.ts`](sources.ts). Licensing rule: summarise and link, never
republish paywalled report bodies, store the takeaway, the "So what", and
the source URL.
