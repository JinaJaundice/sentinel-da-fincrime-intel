import { TrendingUp, TrendingDown } from "lucide-react";
import type { Item } from "../content/types";
import { impactMix, type MonthBucket, type Momentum } from "../lib/insights";
import { cn } from "../lib/utils";

// A single stacked bar showing the high/medium/low risk mix, with a legend.
export function ImpactMix({ items }: { items: Item[] }) {
  const { high, medium, low, total } = impactMix(items);
  const pct = (n: number) => (total ? (n / total) * 100 : 0);
  return (
    <div>
      <div className="flex h-2.5 rounded-full overflow-hidden bg-neutral-800">
        {high > 0 && <div className="bg-rose-500/80" style={{ width: `${pct(high)}%` }} />}
        {medium > 0 && <div className="bg-amber-500/80" style={{ width: `${pct(medium)}%` }} />}
        {low > 0 && <div className="bg-neutral-600" style={{ width: `${pct(low)}%` }} />}
      </div>
      <div className="mt-2 flex items-center gap-3 text-[11px] text-neutral-400">
        <Legend dot="bg-rose-500" label="High" n={high} />
        <Legend dot="bg-amber-500" label="Medium" n={medium} />
        <Legend dot="bg-neutral-600" label="Low" n={low} />
      </div>
    </div>
  );
}

function Legend({ dot, label, n }: { dot: string; label: string; n?: number }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={cn("w-2 h-2 rounded-full", dot)} />
      {label} {n !== undefined && <span className="tabular-nums text-neutral-500">{n}</span>}
    </span>
  );
}

// Monthly columns (by event date), stacked by impact (rose/amber/neutral),
// growing from the baseline. Empty months render as gaps.
export function MonthlyImpactChart({ data }: { data: MonthBucket[] }) {
  if (data.length === 0) return <p className="text-[11px] text-neutral-600">No data yet.</p>;
  const max = Math.max(...data.map((d) => d.total), 1);
  return (
    <div>
      <div className="flex items-end gap-1.5 h-28">
        {data.map((d) => (
          <div
            key={d.key}
            className="flex-1 h-full flex flex-col-reverse rounded-t-sm overflow-hidden min-w-0"
            title={`${d.label}: ${d.total}  ·  High ${d.high} / Med ${d.medium} / Low ${d.low}`}
          >
            <div className="bg-rose-500/75" style={{ height: `${(d.high / max) * 100}%` }} />
            <div className="bg-amber-500/75" style={{ height: `${(d.medium / max) * 100}%` }} />
            <div className="bg-neutral-600" style={{ height: `${(d.low / max) * 100}%` }} />
          </div>
        ))}
      </div>
      <div className="flex gap-1.5 mt-1.5">
        {data.map((d) => (
          <div key={d.key} className="flex-1 text-center text-[9px] text-neutral-500 truncate">
            {d.label}
          </div>
        ))}
      </div>
      <div className="mt-2.5 flex items-center gap-3 text-[11px] text-neutral-400">
        <Legend dot="bg-rose-500" label="High" />
        <Legend dot="bg-amber-500" label="Medium" />
        <Legend dot="bg-neutral-600" label="Low" />
      </div>
    </div>
  );
}

// Direction-of-travel list: a magnitude bar (overall volume) + a rising /
// cooling delta versus the previous window. Rows are clickable when
// `onSelect` is given (e.g. to drill into a theme).
export function MomentumList({
  rows,
  empty = "No data yet.",
  onSelect,
}: {
  rows: Momentum[];
  empty?: string;
  onSelect?: (label: string) => void;
}) {
  if (rows.length === 0) return <p className="text-[11px] text-neutral-600">{empty}</p>;
  const max = Math.max(...rows.map((r) => r.total), 1);
  return (
    <div className="space-y-2.5">
      {rows.map((r) => {
        const inner = (
          <>
            <div className="flex items-center justify-between gap-2 text-[11px] mb-1">
              <span className={cn("truncate", onSelect ? "text-neutral-200 group-hover:text-violet-300 transition-colors" : "text-neutral-300")}>
                {r.label}
              </span>
              <span className="inline-flex items-center gap-2 shrink-0">
                <TrendDelta delta={r.delta} />
                <span className="tabular-nums text-neutral-500">{r.total}</span>
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-neutral-800 overflow-hidden">
              <div className="h-full rounded-full bg-violet-500" style={{ width: `${(r.total / max) * 100}%` }} />
            </div>
          </>
        );
        return onSelect ? (
          <button key={r.label} onClick={() => onSelect(r.label)} className="group w-full text-left">
            {inner}
          </button>
        ) : (
          <div key={r.label}>{inner}</div>
        );
      })}
    </div>
  );
}

function TrendDelta({ delta }: { delta: number }) {
  if (delta > 0)
    return (
      <span className="inline-flex items-center gap-0.5 text-violet-300">
        <TrendingUp className="h-3 w-3" />+{delta}
      </span>
    );
  if (delta < 0)
    return (
      <span className="inline-flex items-center gap-0.5 text-neutral-500">
        <TrendingDown className="h-3 w-3" />
        {delta}
      </span>
    );
  return <span className="text-[10px] text-neutral-600">flat</span>;
}

// A titled set of horizontal distribution bars.
export function MiniBars({ data, accent = "violet" }: { data: { label: string; n: number }[]; accent?: "violet" | "neutral" }) {
  if (data.length === 0) return <p className="text-[11px] text-neutral-600">No data yet.</p>;
  const max = Math.max(...data.map((d) => d.n), 1);
  const fill = accent === "violet" ? "bg-violet-500" : "bg-neutral-600";
  return (
    <div className="space-y-2">
      {data.map((d) => (
        <div key={d.label}>
          <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
            <span className="truncate">{d.label}</span>
            <span className="tabular-nums text-neutral-500">{d.n}</span>
          </div>
          <div className="h-1.5 rounded-full bg-neutral-800 overflow-hidden">
            <div className={cn("h-full rounded-full", fill)} style={{ width: `${(d.n / max) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}
