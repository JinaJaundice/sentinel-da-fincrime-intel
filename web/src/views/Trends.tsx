import { useState } from "react";
import { LineChart, ShieldAlert, Flame, CalendarRange, FileText, Download } from "lucide-react";
import type { Item } from "../content/types";
import type { Page } from "../components/Sidebar";
import { PageHeader } from "../components/PageHeader";
import { Panel, Stat, SectionHeading, IconTile } from "../lib/ui";
import { CopyButton } from "../components/CopyButton";
import { MonthlyImpactChart, MomentumList, MiniBars } from "../components/viz";
import { monthlyByImpact, momentum, countByMulti } from "../lib/insights";
import { weeklyDigest } from "../lib/digest";
import { downloadText } from "../lib/export";
import { THEMES, itemMatchesTheme } from "../content/themes";
import { cn } from "../lib/utils";

// Analytics over the accumulating feed: volume + risk over time, what's
// gaining momentum (with theme drill-down), most-active topics, and a weekly
// digest you can forward. A date-range scopes the period; momentum compares
// the recent half of that range against the half before. All from the store.
type RangeId = "all" | "12m" | "90d" | "30d";
const RANGES: { id: RangeId; label: string; days: number }[] = [
  { id: "all", label: "All", days: 0 },
  { id: "12m", label: "12m", days: 365 },
  { id: "90d", label: "90d", days: 90 },
  { id: "30d", label: "30d", days: 30 },
];

export function Trends({ items, setPage, setTheme }: { items: Item[]; setPage: (p: Page) => void; setTheme: (id: string) => void }) {
  const [range, setRange] = useState<RangeId>("all");
  const published = items.filter((i) => i.status === "published");

  const now = new Date();
  const days = RANGES.find((r) => r.id === range)!.days;
  const inRange =
    days === 0 ? published : published.filter((i) => new Date(i.date + "T00:00:00").getTime() >= now.getTime() - days * 86_400_000);

  const months = monthlyByImpact(inRange);
  const momWindow = days === 0 ? 60 : Math.max(7, Math.round(days / 2));
  const themeMomentum = momentum(inRange, (i) => THEMES.filter((t) => itemMatchesTheme(i, t)).map((t) => t.label), momWindow, now).slice(0, 6);
  const topTags = countByMulti(inRange, (i) => i.tags).slice(0, 8);

  const thisMonth = months[months.length - 1];
  const lastMonth = months[months.length - 2];
  const monthDelta = thisMonth && lastMonth ? thisMonth.total - lastMonth.total : 0;
  const topRising = themeMomentum.filter((r) => r.delta > 0).sort((a, b) => b.delta - a.delta)[0];

  const openTheme = (label: string) => {
    const t = THEMES.find((x) => x.label === label);
    if (t) {
      // setPage clears the selected theme, so set the page first then the theme.
      setPage("themes");
      setTheme(t.id);
    }
  };

  // Weekly digest is always "last 7 days" — independent of the range filter.
  const digest = weeklyDigest(published, now);
  const downloadDigest = () => downloadText(`sentinel-weekly-digest-${now.toISOString().slice(0, 10)}.md`, digest, "text/markdown");

  return (
    <div className="space-y-5">
      <PageHeader
        Icon={LineChart}
        title="Trends"
        subtitle="How the picture is moving over time: volume, risk mix, and what's gaining momentum across the feed."
        right={
          <div className="flex items-center gap-0.5 rounded-lg bg-neutral-900 ring-1 ring-neutral-800 p-0.5">
            {RANGES.map((r) => (
              <button
                key={r.id}
                onClick={() => setRange(r.id)}
                aria-pressed={range === r.id}
                className={cn(
                  "rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors",
                  range === r.id ? "bg-violet-500/15 text-violet-200 ring-1 ring-violet-500/30" : "text-neutral-400 hover:text-neutral-200",
                )}
              >
                {r.label}
              </button>
            ))}
          </div>
        }
      />

      <Panel className="p-3 flex items-center gap-3">
        <IconTile Icon={FileText} tone="brand" size="sm" />
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium text-neutral-200">Weekly digest</div>
          <div className="text-xs text-neutral-500">A one-pager of what moved in the last 7 days; copy or download to forward.</div>
        </div>
        <CopyButton
          text={digest}
          label="Copy"
          className="rounded-lg px-2.5 py-1.5 text-[11px] font-medium bg-neutral-900 ring-1 ring-neutral-800 hover:bg-neutral-800"
        />
        <button
          onClick={downloadDigest}
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-medium bg-neutral-900 text-neutral-300 ring-1 ring-neutral-800 hover:text-neutral-100 hover:bg-neutral-800 transition-colors"
        >
          <Download className="h-3.5 w-3.5" /> .md
        </button>
      </Panel>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat
          Icon={CalendarRange}
          tone="brand"
          label="This month"
          value={thisMonth?.total ?? 0}
          hint={thisMonth ? `${thisMonth.label} · ${monthDelta >= 0 ? "+" : ""}${monthDelta} vs prev` : undefined}
        />
        <Stat Icon={ShieldAlert} tone="rose" label="High impact" value={inRange.filter((i) => i.impact === "high").length} />
        <Stat
          Icon={Flame}
          tone="brand"
          label="Rising theme"
          value={topRising ? `+${topRising.delta}` : "—"}
          hint={topRising ? topRising.label : "no clear riser"}
        />
        <Stat Icon={LineChart} tone="neutral" label="Items" value={inRange.length} />
      </div>

      <Panel className="p-4">
        <SectionHeading Icon={CalendarRange} title="Activity & risk over time" sub="New items per month, stacked by impact" />
        <MonthlyImpactChart data={months} />
      </Panel>

      <div className="grid lg:grid-cols-2 gap-5">
        <Panel className="p-4">
          <SectionHeading
            Icon={Flame}
            title="Gaining momentum"
            sub={`Themes by new items · recent vs prior ${momWindow}d · click to drill in`}
          />
          <MomentumList rows={themeMomentum} onSelect={openTheme} empty="Not enough dated items in range to show momentum." />
        </Panel>
        <Panel className="p-4">
          <SectionHeading Icon={LineChart} title="Most active topics" sub="Most-tagged across the selected range" />
          <MiniBars data={topTags} />
        </Panel>
      </div>
    </div>
  );
}
