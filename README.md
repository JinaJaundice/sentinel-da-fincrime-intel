# Sentinel — Digital-Asset Financial-Crime Intelligence

A single, agent-tended pane of glass for everything that matters at the
intersection of **digital assets** and **financial crime**: news and
regulation, ventures and funding, the vendor / build-vs-buy landscape, and
a library of laundering typologies mapped to controls and obligations.

Sentinel is a **personal / team intelligence tool** (v0.1) — a standalone
sibling of the Digital Asset Compliance Engine demo with its own identity:
**dark, neutral, violet-accented, DefiLlama-style structure**, kept entirely
separate so each stays focused. For the project map (architecture, design,
content, runbook) see [`CLAUDE.md`](CLAUDE.md).

> **It is not "another crypto news feed."** The value is the *bank
> financial-crime lens* — every item carries a **"So what"** that says what
> the development means for a regulated institution's posture. The agent does
> the monitoring and first-draft synthesis; human judgement is what makes it
> credible.

---

## The one idea that keeps it decluttered

**One content model, many views.** Every tracked thing — a signal, a
regulatory move, a funding round, a vendor, a typology — is the same
[`Item`](web/src/content/types.ts) shape with a `type` field. Each tab is
just a filtered view over that single store
([`web/src/content/items.ts`](web/src/content/items.ts)). Adding a tab later
is a nav entry + seed data — never new plumbing. The ingestion agent only
ever has to emit `Item`s.

```
web/src/
  content/      types.ts · taxonomy.ts · items.ts   ← the single source of truth
  lib/          ui.tsx · uiTokens.ts · store.ts · utils.ts
  components/    Header.tsx · ItemCard.tsx            ← the universal card
  views/         Brief · Collection · Intelligence · ReviewQueue
agent/          Phase-2 ingestion design (sources + scheduled-agent wiring)
```

## Human-in-the-loop, by design

Because this is a financial-crime domain, **nothing publishes itself.** The
agent drafts items as `status: "pending"`; they land in the **Review Queue**;
the reviewer approves (→ published) or rejects (→ hidden). Decisions persist
locally (`localStorage`) in v0.1 — see [`web/src/lib/store.ts`](web/src/lib/store.ts).

## Integrity rules (for humans and the agent)

- Cite a source for every factual claim.
- Never fabricate specific enforcement actions or financings.
- Label anything illustrative `[Illustrative]` (there is exactly one such
  seed item, a venture-card example).
- Summarise-and-link; never republish paywalled intel (Chainalysis / TRM /
  Elliptic reports, etc.) wholesale.

## Run it

```bash
cd web
npm install      # already run during scaffolding
npm run dev      # http://localhost:5174
```

## Roadmap

- **v0.1 (now)** — shell, design system, one content model, real seeded
  intelligence, working Review Queue (HITL loop live with pre-seeded drafts).
- **Phase 2** — scheduled ingestion agent appends `pending` items from a
  curated source set (see [`agent/README.md`](agent/README.md)); durable
  persistence replaces the localStorage overlay.
- **Phase 3** — analytics dashboard on real data sources (on-chain metrics,
  regulatory radar / key-date timeline).
- **Phase 4** — widen automation once the drafts have earned trust.
