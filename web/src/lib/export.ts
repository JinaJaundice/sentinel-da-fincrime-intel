import type { Item, ItemType } from "../content/types";
import { TYPE_META } from "../content/taxonomy";
import { IMPACT_TONE } from "./uiTokens";
import { longDate } from "./utils";

// ---------------------------------------------------------------
// Delivery & export — turn Items into things you can paste into a
// deck, an email or a doc, or download for a client pack.
//
// One engine, many call sites: the per-item copy buttons, the
// collection Export menu and the briefing-pack builder all format
// through these pure functions. Side-effects (clipboard, download)
// are the two helpers at the bottom, kept apart so the formatters
// stay testable and reusable.
// ---------------------------------------------------------------

const sep = " · ";

function sourcesInline(item: Item): string {
  if (item.sources.length === 0) return "source not recorded";
  return item.sources.map((s) => (s.url ? `${s.name}, ${s.url}` : s.name)).join("; ");
}

// A pasteable citation for one item — title, source(s), absolute date.
// e.g.  "EU finalises MiCA stablecoin RTS", European Commission, https://… (3 June 2026).
export function citationText(item: Item): string {
  return `“${item.title}”, ${sourcesInline(item)} (${longDate(item.date)}).`;
}

// A slide-ready bullet: the headline as the top bullet, the bank lens
// ("So what") as the indented sub-bullet with attribution. Tabs map to
// PowerPoint/Keynote indent levels on paste.
export function deckBullet(item: Item): string {
  const point = item.soWhat ?? item.summary;
  const src = item.sources[0]?.name;
  const attribution = src ? `${src}, ${longDate(item.date)}` : longDate(item.date);
  return `${item.title}\n\t${point} (${attribution})`;
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// The compact meta line shared by the markdown renderers.
function metaLine(item: Item): string {
  const parts = [item.region, longDate(item.date)];
  if (item.impact) parts.push(`Impact: ${IMPACT_TONE[item.impact].label}`);
  if (item.confidence) parts.push(`Confidence: ${cap(item.confidence)}`);
  if (item.verified) parts.push("✓ Verified");
  return parts.filter(Boolean).join(sep);
}

// Type-specific extras as a single italic detail line, where present.
function extrasLine(item: Item): string | null {
  if (item.venture) {
    const v = item.venture;
    const bits = [
      v.company,
      v.round,
      v.amount,
      v.investors && v.investors.length ? v.investors.join(", ") : undefined,
    ].filter(Boolean);
    return bits.length ? bits.join(sep) : null;
  }
  if (item.solution) {
    const s = item.solution;
    return [`Vendor: ${s.vendor}`, `Category: ${s.category}`, `Stance: ${s.stance}`]
      .concat(s.note ? [s.note] : [])
      .join(sep);
  }
  if (item.typology) return `Vector: ${item.typology.vector}`;
  return null;
}

function sourcesMarkdown(item: Item): string {
  if (item.sources.length === 0) return "_Source not recorded._";
  const links = item.sources.map((s) => {
    const base = s.url ? `[${s.name}](${s.url})` : s.name;
    return s.kind ? `${base} (${s.kind})` : base;
  });
  return `Sources: ${links.join("; ")}`;
}

// Render a single item as a markdown block. `showType` prefixes the meta
// line with the item's kind — used in ungrouped (curated-order) docs where
// there are no type headings to lean on.
function renderItemMarkdown(item: Item, lines: string[], showType: boolean) {
  const meta = showType ? `${TYPE_META[item.type].label}${sep}${metaLine(item)}` : metaLine(item);
  lines.push("", `### ${item.title}`, `*${meta}*`, "", item.summary);
  const extras = extrasLine(item);
  if (extras) lines.push("", `*${extras}*`);
  if (item.soWhat) lines.push("", `> **So what:** ${item.soWhat}`);
  lines.push("", sourcesMarkdown(item));
}

// A markdown briefing of the given items. `grouped` (default) sections them
// by type in the canonical order — for a whole-view export. Pass
// `{ grouped: false }` for a curated one-pager that keeps the given order
// (the briefing-pack builder). Suitable for download (.md) or pasting.
export function itemsToMarkdown(
  items: Item[],
  title = "Sentinel briefing",
  opts: { grouped?: boolean; intro?: string } = {},
): string {
  const { grouped = true, intro } = opts;
  const lines: string[] = [
    `# ${title}`,
    "",
    `_Exported ${longDate(today())}${sep}${items.length} item${items.length === 1 ? "" : "s"}${sep}Sentinel · DA financial-crime intel_`,
  ];
  if (intro) lines.push("", intro);

  if (grouped) {
    const order: ItemType[] = ["signal", "regulatory", "venture", "solution", "typology"];
    for (const type of order) {
      const group = items.filter((i) => i.type === type);
      if (group.length === 0) continue;
      lines.push("", `## ${TYPE_META[type].plural}`);
      for (const item of group) renderItemMarkdown(item, lines, false);
    }
  } else {
    for (const item of items) renderItemMarkdown(item, lines, true);
  }
  return lines.join("\n");
}

// Items as CSV — one row per item, for a spreadsheet/data hand-off.
export function itemsToCsv(items: Item[]): string {
  const headers = ["Type", "Title", "Date", "Region", "Impact", "Confidence", "Verified", "Tags", "Summary", "So what", "Sources"];
  const rows = items.map((i) =>
    [
      TYPE_META[i.type].label,
      i.title,
      i.date,
      i.region ?? "",
      i.impact ? IMPACT_TONE[i.impact].label : "",
      i.confidence ? cap(i.confidence) : "",
      i.verified ? "Yes" : "",
      i.tags.join("; "),
      i.summary,
      i.soWhat ?? "",
      i.sources.map((s) => `${s.url ? `${s.name} (${s.url})` : s.name}${s.kind ? ` [${s.kind}]` : ""}`).join("; "),
    ].map(csvCell),
  );
  return [headers.map(csvCell), ...rows].map((r) => r.join(",")).join("\r\n");
}

function csvCell(value: string): string {
  const s = (value ?? "").replace(/\r?\n/g, " ").trim();
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

// ---- side-effects -------------------------------------------------

// Copy to clipboard with a legacy fallback (older/embedded webviews).
export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }
}

// Trigger a client-side file download. A UTF-8 BOM is prepended for CSV
// so Excel reads accented characters correctly.
export function downloadText(filename: string, text: string, mime = "text/plain") {
  const isCsv = mime.includes("csv");
  // Prepend a UTF-8 BOM for CSV so Excel reads accented characters correctly.
  const bom = String.fromCharCode(0xfeff);
  const blob = new Blob([isCsv ? bom + text : text], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// A filesystem-safe slug for export filenames.
export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}
