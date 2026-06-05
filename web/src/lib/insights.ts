import type { Item } from "../content/types";

// Pure derivations for the dashboards — keep views thin.

export function countBy(items: Item[], key: (i: Item) => string | undefined): { label: string; n: number }[] {
  const m = new Map<string, number>();
  for (const i of items) {
    const k = key(i);
    if (k) m.set(k, (m.get(k) ?? 0) + 1);
  }
  return [...m.entries()].map(([label, n]) => ({ label, n })).sort((a, b) => b.n - a.n);
}

export function impactMix(items: Item[]) {
  const high = items.filter((i) => i.impact === "high").length;
  const medium = items.filter((i) => i.impact === "medium").length;
  const low = items.length - high - medium;
  return { high, medium, low, total: items.length };
}
