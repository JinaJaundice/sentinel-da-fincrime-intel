import type { Item } from "../content/types";
import { impactMix } from "../lib/insights";
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

function Legend({ dot, label, n }: { dot: string; label: string; n: number }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={cn("w-2 h-2 rounded-full", dot)} />
      {label} <span className="tabular-nums text-neutral-500">{n}</span>
    </span>
  );
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
