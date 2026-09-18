import { TrendingUp, TrendingDown } from "lucide-react";
import type { Item } from "../content/types";
import { impactMix, type MonthBucket, type Momentum } from "../lib/insights";
import { Dot } from "../lib/ui";
import { cn } from "../lib/utils";

// Chart primitives, all length-encoded (bars) because length is what people
// read fastest and most accurately. No pies, no gauges, no chart library.

/** One stacked bar of the high / medium / low mix, with the counts beside it. */
export function ImpactMix({ items }: { items: Item[] }) {
  const { high, medium, low, total } = impactMix(items);
  const pct = (n: number) => (total ? (n / total) * 100 : 0);
  return (
    <div>
      <div className="flex h-2 rounded-xs overflow-hidden bg-sunken" role="img" aria-label={`${high} high, ${medium} medium, ${low} low impact`}>
        {high > 0 && <div className="bg-high" style={{ width: `${pct(high)}%` }} />}
        {medium > 0 && <div className="bg-medium" style={{ width: `${pct(medium)}%` }} />}
        {low > 0 && <div className="bg-rule-strong" style={{ width: `${pct(low)}%` }} />}
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-tiny text-ink-soft">
        <Legend tone="high" label="High impact" n={high} />
        <Legend tone="medium" label="Medium" n={medium} />
        <Legend tone="low" label="Low" n={low} />
      </div>
    </div>
  );
}

function Legend({ tone, label, n }: { tone: "high" | "medium" | "low"; label: string; n?: number }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <Dot tone={tone} />
      {label} {n !== undefined && <span className="num text-ink-faint">{n}</span>}
    </span>
  );
}

/** Items per month, stacked by impact. Bars grow from the baseline; the
 *  tallest month sets the scale and is written at the top left. */
export function MonthlyImpactChart({ data }: { data: MonthBucket[] }) {
  if (data.length === 0) return <p className="text-tiny text-ink-faint">No data yet.</p>;
  const max = Math.max(...data.map((d) => d.total), 1);
  return (
    <div>
      <div className="flex items-center justify-between text-micro text-ink-faint mb-1">
        <span>
          Items per month, tallest <span className="num text-ink-soft">{max}</span>
        </span>
        <span className="inline-flex items-center gap-3">
          <Legend tone="high" label="High" />
          <Legend tone="medium" label="Medium" />
          <Legend tone="low" label="Low" />
        </span>
      </div>
      <div className="flex items-end gap-1 h-28 border-b border-rule-strong">
        {data.map((d) => (
          <div key={d.key} className="flex-1 h-full flex flex-col-reverse min-w-0" title={`${d.label}: ${d.total} (high ${d.high}, medium ${d.medium}, low ${d.low})`}>
            <div className="bg-high" style={{ height: `${(d.high / max) * 100}%` }} />
            <div className="bg-medium" style={{ height: `${(d.medium / max) * 100}%` }} />
            <div className="bg-rule-strong" style={{ height: `${(d.low / max) * 100}%` }} />
          </div>
        ))}
      </div>
      <div className="flex gap-1 mt-1">
        {data.map((d, i) => (
          <div key={d.key} className={cn("flex-1 text-center text-micro text-ink-faint truncate", data.length > 8 && i % 2 === 1 && "invisible")}>
            {d.label}
          </div>
        ))}
      </div>
    </div>
  );
}

/** A ranked list with a bar for volume and a rising or falling delta. */
export function MomentumList({ rows, empty = "No data yet.", onSelect }: { rows: Momentum[]; empty?: string; onSelect?: (label: string) => void }) {
  if (rows.length === 0) return <p className="text-tiny text-ink-faint">{empty}</p>;
  const max = Math.max(...rows.map((r) => r.total), 1);
  return (
    <div className="divide-y divide-rule">
      {rows.map((r) => {
        const inner = (
          <>
            <div className="flex items-center justify-between gap-2 text-small mb-1">
              <span className={cn("truncate", onSelect ? "text-ink group-hover:text-signal" : "text-ink")}>{r.label}</span>
              <span className="inline-flex items-center gap-2 shrink-0 text-tiny">
                <TrendDelta delta={r.delta} />
                <span className="num text-ink-faint w-6 text-right">{r.total}</span>
              </span>
            </div>
            <div className="h-1.5 rounded-xs bg-sunken overflow-hidden">
              <div className="h-full bg-signal" style={{ width: `${(r.total / max) * 100}%` }} />
            </div>
          </>
        );
        return onSelect ? (
          <button key={r.label} onClick={() => onSelect(r.label)} className="group w-full text-left py-2 first:pt-0 last:pb-0">
            {inner}
          </button>
        ) : (
          <div key={r.label} className="py-2 first:pt-0 last:pb-0">
            {inner}
          </div>
        );
      })}
    </div>
  );
}

function TrendDelta({ delta }: { delta: number }) {
  if (delta > 0)
    return (
      <span className="inline-flex items-center gap-0.5 text-signal num">
        <TrendingUp className="h-3 w-3" />+{delta}
      </span>
    );
  if (delta < 0)
    return (
      <span className="inline-flex items-center gap-0.5 text-ink-faint num">
        <TrendingDown className="h-3 w-3" />
        {delta}
      </span>
    );
  return <span className="text-ink-faint">level</span>;
}

/** Horizontal bars for a ranked distribution. */
export function MiniBars({ data, tone = "signal" }: { data: { label: string; n: number }[]; tone?: "signal" | "neutral" }) {
  if (data.length === 0) return <p className="text-tiny text-ink-faint">No data yet.</p>;
  const max = Math.max(...data.map((d) => d.n), 1);
  return (
    <div className="space-y-2">
      {data.map((d) => (
        <div key={d.label}>
          <div className="flex justify-between text-tiny text-ink-soft mb-1">
            <span className="truncate">{d.label}</span>
            <span className="num text-ink-faint">{d.n}</span>
          </div>
          <div className="h-1.5 rounded-xs bg-sunken overflow-hidden">
            <div className={cn("h-full", tone === "signal" ? "bg-signal" : "bg-rule-strong")} style={{ width: `${(d.n / max) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}
