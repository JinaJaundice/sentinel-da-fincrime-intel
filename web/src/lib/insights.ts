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

// Like countBy but for multi-valued keys (e.g. tags): one item can land in
// several buckets.
export function countByMulti(items: Item[], keys: (i: Item) => string[]): { label: string; n: number }[] {
  const m = new Map<string, number>();
  for (const i of items) for (const k of keys(i)) m.set(k, (m.get(k) ?? 0) + 1);
  return [...m.entries()].map(([label, n]) => ({ label, n })).sort((a, b) => b.n - a.n);
}

// ---- time-series (Trends view) ----

const monthIndex = (ym: string) => {
  const [y, m] = ym.split("-").map(Number);
  return y * 12 + (m - 1);
};

export interface MonthBucket {
  key: string; // "2026-04"
  label: string; // "Apr"
  total: number;
  high: number;
  medium: number;
  low: number;
}

// Items per calendar month (by event `date`), split by impact, with empty
// months filled so the axis is continuous. Capped to the last 12 months.
export function monthlyByImpact(items: Item[]): MonthBucket[] {
  if (items.length === 0) return [];
  const idxs = items.map((i) => monthIndex(i.date.slice(0, 7)));
  const min = Math.min(...idxs);
  const max = Math.max(...idxs);
  const buckets: MonthBucket[] = [];
  for (let n = min; n <= max; n++) {
    const y = Math.floor(n / 12);
    const m = n % 12;
    const key = `${y}-${String(m + 1).padStart(2, "0")}`;
    const inMonth = items.filter((i) => i.date.slice(0, 7) === key);
    const high = inMonth.filter((i) => i.impact === "high").length;
    const medium = inMonth.filter((i) => i.impact === "medium").length;
    buckets.push({
      key,
      label: new Date(y, m, 1).toLocaleDateString("en-GB", { month: "short" }),
      total: inMonth.length,
      high,
      medium,
      low: inMonth.length - high - medium,
    });
  }
  return buckets.slice(-12);
}

export interface Momentum {
  label: string;
  recent: number;
  prior: number;
  delta: number; // recent - prior (direction)
  total: number; // overall, for magnitude
}

// Direction-of-travel per category: how many new items (by event `date`)
// landed in the last `windowDays` vs the window before. `classify` maps an
// item to zero or more category labels (themes, tags, …). Sorted by recent.
export function momentum(
  items: Item[],
  classify: (i: Item) => string[],
  windowDays = 60,
  now = new Date(),
): Momentum[] {
  const day = 86_400_000;
  const t = now.getTime();
  const recentFrom = t - windowDays * day;
  const priorFrom = t - 2 * windowDays * day;
  const map = new Map<string, { recent: number; prior: number; total: number }>();
  for (const i of items) {
    const labels = classify(i);
    if (labels.length === 0) continue;
    const time = new Date(i.date + "T00:00:00").getTime();
    const isRecent = time >= recentFrom && time <= t;
    const isPrior = time >= priorFrom && time < recentFrom;
    for (const label of labels) {
      const cur = map.get(label) ?? { recent: 0, prior: 0, total: 0 };
      cur.total += 1;
      if (isRecent) cur.recent += 1;
      else if (isPrior) cur.prior += 1;
      map.set(label, cur);
    }
  }
  return [...map.entries()]
    .map(([label, v]) => ({ label, recent: v.recent, prior: v.prior, delta: v.recent - v.prior, total: v.total }))
    .sort((a, b) => b.recent - a.recent || b.total - a.total);
}
