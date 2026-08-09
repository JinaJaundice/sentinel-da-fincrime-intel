# Sentinel — Digital-Asset Financial-Crime Intelligence

A single, agent-tended pane of glass for everything that matters at the
intersection of **digital assets** and **financial crime**: news and
regulation, ventures and funding, the vendor / build-vs-buy landscape, and a
library of laundering typologies mapped to controls and obligations.

**Live:** https://sentinel-da-fincrime-intel.vercel.app · Built for a bank
financial-crime team for **(a) knowledge building** and **(b) client-delivery
support**. Dark, neutral, violet-accented, DefiLlama-style. For the full
project map (architecture, design, content, runbook) see [`CLAUDE.md`](CLAUDE.md).

> **It is not "another crypto news feed."** The value is the *bank
> financial-crime lens* — every item carries a **"So what"** that says what
> the development means for a regulated institution's posture. The agent does
> the monitoring and first-draft synthesis; human judgement is what makes it
> credible.

---

## The one idea that keeps it decluttered

**One content model, many views.** Every tracked thing — a signal, a
regulatory move, a funding round, a vendor, a typology — is the same
[`Item`](web/src/content/types.ts) shape with a `type` field. Each tab is just
a filtered view over a single store ([`items.ts`](web/src/content/items.ts)
seed + the agent's [`feed.json`](web/src/content/feed.json), merged in
[`content/index.ts`](web/src/content/index.ts)). Adding a tab is a nav entry +
seed data — never new plumbing.

Tabs: **Overview · Learn · Trends · Themes · Signals · FCA · Atlas · Ventures ·
Solutions · Intelligence · Radar · Activity.**

## What it does

- **Aggregate** — dense, searchable, sortable tables per stream, with per-tab
  dashboards and a command-center Overview (with a "This week" pulse). An
  **FCA** tab filters signals to regulator publications, keyed on each item's
  issuer, kind and reference.
- **Understand** — a **Learn** hub (guided start-here + a searchable glossary
  with inline tooltips) and a "how it works" primer on every typology.
- **Trust** — client-ready signals on each item: a human **Verified** flag, a
  **confidence** level, and **primary / secondary** source badges.
- **Deliver** — copy a citation or a deck bullet, export any stream or theme to
  Markdown / CSV, or build a **briefing pack** across views into a one-pager.
- **Track** — a **Trends** tab (volume × risk over time, theme momentum) and a
  **Radar** of key regulatory dates, plus a forwardable **weekly digest**.
- **Map** — an **Atlas** world map of crypto-regulation status by jurisdiction
  (around 40 sourced entries: a curated seed plus agent-maintained updates).

## The ingestion agent — auto-publish

The agent runs on a daily local schedule: it web-searches new developments,
drafts them as `Item`s (**every item must carry a real source URL**), appends
`feed.json`, keeps the Atlas jurisdictions current (`jurisdictions.json`),
regenerates [`DIGEST.md`](DIGEST.md), and commits + pushes — which
auto-deploys the live site. **It auto-publishes (no human-in-the-loop)**; the
**Activity** tab is the transparency log. See
[`agent/INGEST.md`](agent/INGEST.md).

## Integrity rules (for humans and the agent)

- Cite a source for every factual claim — no source, no publish.
- Never fabricate specific enforcement actions or financings.
- Label anything illustrative `[Illustrative]`.
- Summarise-and-link; never republish paywalled intel (Chainalysis / TRM /
  Elliptic, etc.) wholesale.

## Run it

```bash
cd web
npm install
npm run dev      # http://localhost:5174
npm run lint     # ESLint
npm run prose    # plain-language gate on hand-authored copy (feed.json exempt)
npm test         # Vitest
npm run digest   # regenerate DIGEST.md
npm run build    # tsc + vite build  (CI runs lint + prose + test + build on every push)
```

## Status

The roadmap is delivered — foundation, the auto-publish agent, analytics,
delivery & export, a knowledge layer, a verified tier, trends + digest,
dev-infra (lint / prose / test / CI), an FCA publications tab, and a
regulatory Atlas. See [`ROADMAP.md`](ROADMAP.md) for the phase log
and [`HANDOFF.md`](HANDOFF.md) for a session-to-session snapshot.
