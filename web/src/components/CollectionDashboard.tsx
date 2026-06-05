import { Layers, ShieldAlert, Sparkles, Globe } from "lucide-react";
import type { Item } from "../content/types";
import { STANCE_META } from "../content/taxonomy";
import { Panel, Stat, SectionHeading } from "../lib/ui";
import { ImpactMix, MiniBars } from "./viz";
import { countBy } from "../lib/insights";
import { withinDays } from "../lib/utils";

// Visual summary shown above each tab's dense list: headline stats + a
// risk-mix bar + a distribution (regions, or stance for Solutions).
export function CollectionDashboard({ items, variant }: { items: Item[]; variant: "signal" | "venture" | "solution" }) {
  const high = items.filter((i) => i.impact === "high").length;
  const thisWeek = items.filter((i) => withinDays(i.addedAt, 7)).length;
  const regions = countBy(items, (i) => i.region);
  const stances = countBy(items, (i) => (i.solution ? STANCE_META[i.solution.stance].label : undefined));

  const isSolution = variant === "solution";
  const dist = isSolution ? { title: "By stance", data: stances } : { title: "By region", data: regions };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat Icon={Layers} tone="brand" label="Tracked" value={items.length} />
        <Stat Icon={ShieldAlert} tone="rose" label="High impact" value={high} />
        <Stat Icon={Sparkles} tone="neutral" label="This week" value={thisWeek} />
        <Stat Icon={Globe} tone="neutral" label={isSolution ? "Stances" : "Regions"} value={dist.data.length} />
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <Panel className="p-4">
          <SectionHeading Icon={ShieldAlert} title="Risk mix" />
          <ImpactMix items={items} />
        </Panel>
        <Panel className="p-4">
          <SectionHeading Icon={Globe} title={dist.title} />
          <MiniBars data={dist.data.slice(0, 6)} />
        </Panel>
      </div>
    </div>
  );
}
