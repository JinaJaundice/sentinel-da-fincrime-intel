# Design system: the watch desk

Rebuilt 18 September 2026 (v0.2). Sooraj's brief: bring Sentinel to the
same standard as the engine, Touchstone and Postern (light and dark themes,
a token layer, a gate that enforces it), make the tab labels say what each
page shows, and make it look like a professional horizon-scanning tool.

## The point of view

A horizon-scanning tool a financial-crime team reads every morning. The
chrome is a newsroom desk: one plain grotesque, hairlines, counts beside
every list, filters that carry their counts, and a page that opens with the
figures. The written parts, the summary and the "So what for a bank", are
set in a text serif, because they are the two things a person wrote to be
read. Nothing is a card for its own sake, nothing floats, nothing glows.

The identity is deliberately unlike the siblings: the engine is Plex and
blue, Touchstone is Bitter and Archivo on ledger paper, Postern is
Newsreader and Public Sans. Sentinel keeps its violet from v0.1 as the one
accent, and takes Libre Franklin and Source Serif 4.

## The token layer

Everything visual is a token in [`web/src/index.css`](../web/src/index.css)
under `@theme`. Tailwind v4 turns the names into utilities, so
`--color-ink-faint` gives `text-ink-faint` and `--text-small` gives
`text-small`. No component names a raw colour, a family, a radius or a size;
[`scripts/design-check.mjs`](../web/scripts/design-check.mjs) fails the build
on any default Tailwind palette class, arbitrary font size or hex literal in
`src/`.

- **Type.** Libre Franklin (variable) for the interface, headings and
  figures; Source Serif 4 (variable) for summaries, the "So what", primers
  and glossary definitions. Both OFL, self-hosted from
  `@fontsource-variable/*`, imported in `main.tsx`. No CDN, no mono face.
  Ladder: `micro` 11 / `tiny` 12 / `small` 13 / `body` 14 / `lead` 16 /
  `head` 20 / `title` 26 / `hero` 40. **11px is the floor and the gate
  enforces it.** Use a step, never `text-[10px]`.
- **Surfaces.** `surface` (the page), `raised` (paper on it, white in the
  light theme), `sunken` (a well: input bars, group heads, hover).
- **Ink.** `ink`, `ink-soft`, `ink-faint`. Every step clears WCAG AA as
  normal text on all three surfaces; `ink-faint` is set against `sunken`,
  the darkest of them (4.7:1 light, 5.0:1 dark).
- **Rules.** `rule`, `rule-strong`. Hairlines do the separating.
- **Signal.** One accent, `signal`, with `signal-soft` for a tint and
  `on-signal` for text ON a filled accent (white in light, near-black in
  dark, because the dark accent is lightened to read as text). Never pair
  `text-white` with `bg-signal`.
- **Risk.** `high` (claret) and `medium` (amber), each with a `-soft`, and
  `low` (the faint ink). Impact is always a word with the colour as the
  second cue. Nothing else gets a colour: a kind of item is told apart by
  icon and word; confidence is a dot from the accent to grey; a vendor
  stance reuses the accent for "in use" and amber for "evaluating".
- **Map.** `map-land`, `map-border`. The status fills are the accent, amber
  and the faint ink at 38% opacity, so the map follows the theme.
- **Radii.** 2 / 3 / 4 / 6px. Nothing above 6; the gate fails on it.

## Two themes, one block of variables

The dark theme is a block of `--color-*` overrides under
`:root[data-theme="dark"]`. No `dark:` variant on any element. `lib/theme.ts`
holds the state (system, light, dark; system is the default),
`components/ThemeToggle.tsx` is the control (in the rail foot on desktop, the
top bar on a phone), and an inline script in `index.html` resolves the theme
before first paint so a dark-theme reader never sees a light flash. Keep the
script and `theme.ts` in step. Storage key: `sentinel:theme`.

## The utilities

In `index.css`, inside `@layer components` so a Tailwind utility on the same
element still wins (a `pl-8` on a `.field`, a `text-high` on a `.tag`):

- `.label`: the small-caps band (11px, 600, tracked, faint ink).
- `.serif`: the reading face at 14px / 1.55.
- `.num`: tabular figures.
- `.panel`: paper on the page (raised, one hairline, 6px). `min-width: 0`
  so a grid child can shrink; a long title once widened the phone page.
- `.tag`: a small meaning tag; add a tone with `TONE[tone].soft`.
- `.chip`: a filter choice; filled with the accent when `aria-pressed`.
- `.btn`, `.btn-primary`, `.btn-quiet`: outlined, filled, text.
- `.field`: the themed form control (inputs and the phone page picker).
- `.link`, `.row`, `.sr-only`, `.rise` (one 220ms entrance; none under
  `prefers-reduced-motion`).

The base rules (`body`, `button`, `h1`) sit in `@layer base` for the same
reason: an unlayered `button { color: inherit }` once beat every
`text-on-signal` in the app, and the gate found it as a 2.45:1 contrast.

## The primitives

[`lib/ui.tsx`](../web/src/lib/ui.tsx): `Panel`, `Tag`, `Dot`, `FigureStrip`
(a ruled row of figures under a title), `SectionHeading`, `EmptyState`,
`Segmented`, `Chip`, `ShowMore`. [`lib/uiTokens.ts`](../web/src/lib/uiTokens.ts):
`TONE`, `IMPACT_TONE`, `IMPACT_ORDER`. [`lib/nav.ts`](../web/src/lib/nav.ts):
the rail, in three groups with plain labels.

## The pages

- **The rail** (`components/Sidebar.tsx`): three groups, Briefings / Track /
  About, every label a plain description of the page, an item count beside
  each list page like an inbox, a count of fresh agent items beside its log,
  the theme control and the feed's last update at the foot. On a phone it
  becomes a top bar with a native page picker.
- **Every page** opens with `PageHeader` (kicker, title, one plain sentence
  saying what the page shows, the page's controls on the right), then a
  `FigureStrip` where figures help, then the content.
- **Lists** (`components/DataTable.tsx`): a search bar on a sunken band, a
  label row with sortable heads, rows that open in place, and thirty rows at
  a time with "Show 30 more". The 173-row News page was a 10,604px page
  before; it is 2,142px now. Titles clamp to two lines. A `groupBy` gives the
  agent log a head per day; a `renderExtra` gives Crime patterns its primer.
- **Filters carry counts** (`views/Collection.tsx`): impact, new this week,
  verified only, and the regions that recur (a one-off region is found by
  search). The old per-page dashboard of four stat tiles and two bar charts
  was the same page architecture repeated seven times and is gone; the
  figures live in the chips.
- **Today's briefing** opens with the figures, then what moved this week by
  topic, the twelve latest items as a list, and at a glance the next
  deadline, the risk mix and the regions. The stream cards that duplicated
  the rail are gone.
- **Charts** (`components/viz.tsx`) are bars only: length is what people
  read fastest (Cleveland and McGill 1985, via NN/g). The monthly chart
  writes its scale at the top left.

## The gate

`npm run build && npm run design` runs `scripts/design-check.mjs`: the source
checks, the built-CSS checks (only the two faces named, no gradient, no
backdrop filter), then every page in both themes at 1440 and 390 wide: the
page's own `<h1>` is the one its route names, every text element is in one
of the two faces, nothing under 11px, every text element clears WCAG AA
against the surface it is painted on (alpha composited up the tree), no
horizontal overflow, none of the tells (a blurred shadow, a radius above 6px
on anything wider than 40px, a backdrop filter), no console error. It opens
the first row on the list pages so the detail block is audited too.

`npm run shots [outdir]` writes full-page screenshots of every page in both
themes at both widths plus five interaction states, for looking at. Look at
them; the gate cannot see taste.

## What the research decided

- **Tables over cards for scanning and comparing** (NN/g, Data Tables: Four
  Major User Tasks, 2022): a human-readable first column, the most
  important columns first, discoverable filters with a visible active state,
  and a row that opens in place. The card-per-item pages became lists.
- **Length encodes quantity; colour encodes category** (NN/g, Dashboards,
  2017, citing Cleveland and McGill): bars, no pies or gauges; the risk
  colours only ever reinforce a word.
- **A long list is paged** (GOV.UK Design System, Pagination): thirty rows
  and "Show 30 more" rather than the whole feed on one page.
- **Filters over facets for a set this size** (NN/g, Filters vs Facets):
  one row of impact chips and one of regions, each with its count.

## What NOT to bolt on

- A default Tailwind palette class, an arbitrary size, a hex literal.
- A gradient, a shadow, a blur, a glass panel, a pill button.
- `text-white` on a filled accent (use `text-on-signal`).
- A third face, or a CDN font link.
- A stat-tile row on a list page. Put the number in the filter chip.
- A colour on a category that carries no verdict.
