import type { Item } from "../content/types";
import { THEMES, itemMatchesTheme } from "../content/themes";
import { longDate } from "./utils";

// A weekly "what moved + so what" one-pager, derived from the last 7 days of
// ingestion (by `addedAt`). Pure markdown — used by the in-app "Weekly
// digest" export and by the agent's `npm run digest` (scripts/digest.ts).

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const impactRank = (i: Item) => (i.impact === "high" ? 3 : i.impact === "medium" ? 2 : 1);

// Most client-relevant first: vouched, then higher impact, then most recent.
function byNotable(a: Item, b: Item): number {
  if (!!a.verified !== !!b.verified) return a.verified ? -1 : 1;
  if (impactRank(a) !== impactRank(b)) return impactRank(b) - impactRank(a);
  return a.addedAt < b.addedAt ? 1 : -1;
}

export function weeklyDigest(items: Item[], now = new Date()): string {
  const weekAgo = now.getTime() - 7 * 86_400_000;
  const pub = items.filter((i) => i.status === "published");
  const fresh = pub.filter((i) => new Date(i.addedAt + "T00:00:00").getTime() >= weekAgo);

  const lines: string[] = [
    `# Sentinel weekly digest — ${longDate(now.toISOString().slice(0, 10))}`,
    "",
    `_${fresh.length} new item${fresh.length === 1 ? "" : "s"} in the last 7 days · Sentinel — DA financial-crime intel_`,
  ];

  if (fresh.length === 0) {
    lines.push("", "_No new items surfaced this week._");
    return lines.join("\n");
  }

  // What moved — themes ranked by how many fresh items they drew this week.
  const themeCounts = THEMES.map((t) => ({ t, items: fresh.filter((i) => itemMatchesTheme(i, t)) }))
    .filter((x) => x.items.length > 0)
    .sort((a, b) => b.items.length - a.items.length)
    .slice(0, 5);
  if (themeCounts.length > 0) {
    lines.push("", "## What moved");
    for (const { t, items: ti } of themeCounts) {
      const top = [...ti].sort(byNotable)[0];
      lines.push(`- **${t.label}** — ${ti.length} new item${ti.length === 1 ? "" : "s"}; latest: ${top.title}`);
    }
  }

  // Notable this week — the items worth reading, with the bank lens + a source.
  const notable = [...fresh].sort(byNotable).slice(0, 6);
  lines.push("", "## Notable this week");
  for (const i of notable) {
    const flags = [i.verified ? "✓ Verified" : null, i.impact ? `${cap(i.impact)} impact` : null]
      .filter(Boolean)
      .join(" · ");
    const meta = [i.region, longDate(i.date), flags].filter(Boolean).join(" · ");
    lines.push("", `### ${i.title}`, `*${meta}*`);
    if (i.soWhat) lines.push(`> **So what:** ${i.soWhat}`);
    const src = i.sources.find((s) => s.kind === "primary") ?? i.sources[0];
    if (src) lines.push(`Source: ${src.url ? `[${src.name}](${src.url})` : src.name}`);
  }

  const high = fresh.filter((i) => i.impact === "high").length;
  const verified = fresh.filter((i) => i.verified).length;
  lines.push("", "## By the numbers", `${fresh.length} new · ${high} high-impact · ${verified} verified`);

  return lines.join("\n");
}
