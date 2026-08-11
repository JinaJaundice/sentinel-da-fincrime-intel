# Design system

## Identity

**Dark, neutral, violet**: deliberately distinct from the Compliance Engine
(light + blue). The goal is "snazzy intelligence terminal," structurally
inspired by DefiLlama.

- **Base:** near-black neutral, `neutral-950` (page), `neutral-900` (surfaces),
  `neutral-800` (borders/rings). Text: `neutral-100 / 400 / 500`.
- **Accent:** a single **violet** (`violet-400/500`) for active nav, key
  numbers, links, the "So what" rule, primary buttons.
- **Risk bands:** amber (medium) / rose (high) / neutral (low), kept semantic.
- **Types are monochrome**: told apart by icon + label, with colour kept out of it. This
  keeps the violet meaningful and the UI calm.

## Tokens: one place for colour

All colour is enumerated in [`web/src/lib/uiTokens.ts`](../web/src/lib/uiTokens.ts)
(+ stance chips in [`taxonomy.ts`](../web/src/content/taxonomy.ts)). **Tailwind
v4 only sees literal class strings**, so never build colour by interpolation
(`bg-${x}-500` will not generate). Use:

- `ACCENT`: violet fragments (text/bg/dot/soft/bar).
- `TONE` (`brand | amber | rose | neutral`): tiles/text/dots/bars for `IconTile`, `Stat`, `Badge`.
- `IMPACT_TONE`: the impact chips.
- `STANCE_META[stance].chip`: Solutions stance chips.

**To change the accent:** edit `ACCENT` and `TONE.brand` (and the few inline
`violet-*` literals in `Sidebar`, `ItemDetail` buttons, `Collection` chips,
`Intelligence` bars). Search `violet-` to find them.

## Layout (DefiLlama-inspired)

- **Left sidebar** ([`Sidebar.tsx`](../web/src/components/Sidebar.tsx)) on
  desktop; collapses to a horizontal scrolling bar on mobile (`md:` breakpoints).
  Active item = violet left-border + violet icon + raised bg.
- **Stat tiles** (`Stat`): small uppercase label over a big tabular number.
- **Dense expandable tables** ([`DataTable.tsx`](../web/src/components/DataTable.tsx))
, header row + rows that expand in place to reveal `ItemDetail`. Columns are
  configured per `variant` (signal/venture/solution).
- Content max-width `max-w-5xl`, generous padding.

## Components

`IconTile`, `Panel`, `Badge`, `Stat`, `SectionHeading`, `EmptyState`
([`lib/ui.tsx`](../web/src/lib/ui.tsx)); `ItemDetail` (the shared content
block), `ItemCard` (Panel + ItemDetail), `DataTable`, `Sidebar`.

## Accessibility

- Landmarks: sidebar is `<aside>` (complementary), nav is `<nav aria-label="Primary">`,
  content is `<main>`.
- Table rows are `<button aria-expanded>`; chevron rotates on open.
- Focus-visible rings (`focus-visible:ring-violet-500/40`).
- Verify structure with preview **snapshots** (see [RUNBOOK](RUNBOOK.md)).

## Motion

`.rise` (view/card entrance) and `.expand` (row reveal) keyframes in
[`index.css`](../web/src/index.css). Keep motion subtle.
