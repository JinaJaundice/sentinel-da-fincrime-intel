import { LineChart, ShieldAlert, Flame, CalendarRange } from "lucide-react";
import type { Item } from "../content/types";
import { PageHeader } from "../components/PageHeader";
import { Panel, Stat, SectionHeading } from "../lib/ui";
import { MonthlyImpactChart, MomentumList, MiniBars } from "../components/viz";
import { monthlyByImpact, momentum, countByMulti } from "../lib/insights";
import { THEMES, itemMatchesTheme } from "../content/themes";

// Analytics over the accumulating feed: how the picture moves over time
// (volume + risk mix per month) and what's gaining momentum (themes/tags,
// recent window vs the one before). All derived from the single store.
const WINDOW = 60;

export function Trends({ items }: { items: Item[] }) {
  const published = items.filter((i) => i.status === "published");

  const months = monthlyByImpact(published);
  const themeMomentum = momentum(published, (i) => THEMES.filter((t) => itemMatchesTheme(i, t)).map((t) => t.label), WINDOW).slice(0, 6);
  const topTags = countByMulti(published, (i) => i.tags).slice(0, 8);

  const thisMonth = months[months.length - 1];
  const lastMonth = months[months.length - 2];
  const monthDelta = thisMonth && lastMonth ? thisMonth.total - lastMonth.total : 0;
  const topRising = themeMomentum.filter((r) => r.delta > 0).sort((a, b) => b.delta - a.delta)[0];

  return (
    <div className="space-y-5">
      <PageHeader
        Icon={LineChart}
        title="Trends"
        subtitle="How the picture is moving over time — volume, risk mix, and what's gaining momentum across the feed."
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat
          Icon={CalendarRange}
          tone="brand"
          label="This month"
          value={thisMonth?.total ?? 0}
          hint={thisMonth ? `${thisMonth.label} · ${monthDelta >= 0 ? "+" : ""}${monthDelta} vs prev` : undefined}
        />
        <Stat Icon={ShieldAlert} tone="rose" label="High impact" value={published.filter((i) => i.impact === "high").length} />
        <Stat
          Icon={Flame}
          tone="brand"
          label="Rising theme"
          value={topRising ? `+${topRising.delta}` : "—"}
          hint={topRising ? topRising.label : "no clear riser"}
        />
        <Stat Icon={LineChart} tone="neutral" label="Tracked" value={published.length} />
      </div>

      <Panel className="p-4">
        <SectionHeading Icon={CalendarRange} title="Activity & risk over time" sub="New items per month, stacked by impact" />
        <MonthlyImpactChart data={months} />
      </Panel>

      <div className="grid lg:grid-cols-2 gap-5">
        <Panel className="p-4">
          <SectionHeading Icon={Flame} title="Gaining momentum" sub={`Themes by new items — last ${WINDOW}d vs the ${WINDOW}d before`} />
          <MomentumList rows={themeMomentum} empty="Not enough dated items yet to show momentum." />
        </Panel>
        <Panel className="p-4">
          <SectionHeading Icon={LineChart} title="Most active topics" sub="Most-tagged across the whole feed" />
          <MiniBars data={topTags} />
        </Panel>
      </div>
    </div>
  );
}
