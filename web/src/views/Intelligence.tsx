import { Crosshair, Scale, ShieldAlert, Globe, PieChart } from "lucide-react";
import type { Item, ItemType } from "../content/types";
import { Panel, Stat, SectionHeading } from "../lib/ui";
import { ItemCard } from "../components/ItemCard";
import { TYPE_META } from "../content/taxonomy";
import { cn } from "../lib/utils";

// The analytics-flavoured view: the typology library plus the shape of
// what we're tracking. Metrics are derived from the one content store.
export function Intelligence({ items }: { items: Item[] }) {
  const published = items.filter((i) => i.status === "published");
  const typologies = published.filter((i) => i.type === "typology");
  const regulatory = published.filter((i) => i.type === "regulatory");
  const highImpact = published.filter((i) => i.impact === "high");
  const regions = new Set(published.map((i) => i.region).filter(Boolean));

  const byType = (Object.keys(TYPE_META) as ItemType[])
    .map((t) => ({ t, n: published.filter((i) => i.type === t).length }))
    .filter((x) => x.n > 0);
  const maxType = Math.max(...byType.map((x) => x.n), 1);

  const byRegion = Array.from(new Set(published.map((i) => i.region).filter(Boolean) as string[]))
    .map((r) => ({ r, n: published.filter((i) => i.region === r).length }))
    .sort((a, b) => b.n - a.n);
  const maxRegion = Math.max(...byRegion.map((x) => x.n), 1);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-100 tracking-tight">Intelligence</h1>
        <p className="text-sm text-neutral-500">
          Laundering typologies for digital assets, mapped to controls and obligations — plus the shape of what we're tracking.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat Icon={Crosshair} tone="brand" label="Typologies" value={typologies.length} />
        <Stat Icon={Scale} tone="neutral" label="Regulatory" value={regulatory.length} />
        <Stat Icon={ShieldAlert} tone="rose" label="High impact" value={highImpact.length} />
        <Stat Icon={Globe} tone="neutral" label="Regions" value={regions.size} />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-3">
          <SectionHeading Icon={Crosshair} title="Typology library" sub="Vectors mapped to controls & obligations" />
          {typologies.map((i) => (
            <div key={i.id} className="rise">
              <ItemCard item={i} />
            </div>
          ))}
        </div>

        <div className="space-y-5">
          <Panel className="p-4">
            <SectionHeading Icon={PieChart} title="Coverage by stream" />
            <div className="space-y-2.5">
              {byType.map(({ t, n }) => (
                <Bar key={t} label={TYPE_META[t].plural} n={n} max={maxType} className="bg-violet-500" />
              ))}
            </div>
          </Panel>
          <Panel className="p-4">
            <SectionHeading Icon={Globe} title="Coverage by region" />
            <div className="space-y-2.5">
              {byRegion.map(({ r, n }) => (
                <Bar key={r} label={r} n={n} max={maxRegion} className="bg-neutral-600" />
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

function Bar({ label, n, max, className }: { label: string; n: number; max: number; className: string }) {
  const pct = Math.round((n / max) * 100);
  return (
    <div>
      <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1">
        <span className="truncate">{label}</span>
        <span className="tabular-nums text-neutral-500">{n}</span>
      </div>
      <div className="h-2 rounded-full bg-neutral-800 overflow-hidden">
        <div className={cn("h-full rounded-full", className)} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
