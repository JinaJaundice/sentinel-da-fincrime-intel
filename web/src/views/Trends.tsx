import { useState } from "react";
import { Download } from "lucide-react";
import type { Item } from "../content/types";
import type { Page } from "../lib/nav";
import { PageHeader } from "../components/PageHeader";
import { Panel, FigureStrip, SectionHeading, Segmented } from "../lib/ui";
import { CopyButton } from "../components/CopyButton";
import { MonthlyImpactChart, MomentumList, MiniBars } from "../components/viz";
import { monthlyByImpact, momentum, countByMulti } from "../lib/insights";
import { weeklyDigest } from "../lib/digest";
import { downloadText } from "../lib/export";
import { THEMES, itemMatchesTheme } from "../content/themes";

// What is moving: items per month by impact, the topics gaining or losing,
// the most-used tags, and the weekly digest. A range scopes the period;
// momentum compares the recent half of the range with the half before.
type RangeId = "all" | "12m" | "90d" | "30d";
const RANGES: { id: RangeId; label: string; days: number }[] = [
  { id: "all", label: "All time", days: 0 },
  { id: "12m", label: "12 months", days: 365 },
  { id: "90d", label: "90 days", days: 90 },
  { id: "30d", label: "30 days", days: 30 },
];

export function Trends({ items, setPage, setTheme }: { items: Item[]; setPage: (p: Page) => void; setTheme: (id: string) => void }) {
  const [range, setRange] = useState<RangeId>("all");
  const published = items.filter((i) => i.status === "published");

  const now = new Date();
  const days = RANGES.find((r) => r.id === range)!.days;
  const inRange = days === 0 ? published : published.filter((i) => new Date(i.date + "T00:00:00").getTime() >= now.getTime() - days * 86_400_000);

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
      setPage("themes"); // setPage clears the topic, so set it after
      setTheme(t.id);
    }
  };

  const digest = weeklyDigest(published, now);
  const downloadDigest = () => downloadText(`sentinel-weekly-digest-${now.toISOString().slice(0, 10)}.md`, digest, "text/markdown");

  return (
    <div className="space-y-5">
      <PageHeader
        title="What is moving"
        lede="How the picture changes over time: items per month by impact, which topics are gaining, and the most-used tags."
        right={<Segmented ariaLabel="Period" value={range} onChange={setRange} options={RANGES.map((r) => ({ value: r.id, label: r.label }))} />}
      />

      <FigureStrip
        figures={[
          { label: "This month", value: thisMonth?.total ?? 0, hint: thisMonth ? `${thisMonth.label}, ${monthDelta >= 0 ? "+" : ""}${monthDelta} on the month before` : undefined },
          { label: "High impact in range", value: inRange.filter((i) => i.impact === "high").length, tone: "high" },
          { label: "Topic rising most", value: topRising ? `+${topRising.delta}` : "none", tone: "signal", hint: topRising ? topRising.label : "no clear riser" },
          { label: "Items in range", value: inRange.length },
        ]}
      />

      <Panel className="p-4">
        <SectionHeading title="Items per month, by impact" sub="Dated by the event, not by when the agent added it" />
        <MonthlyImpactChart data={months} />
      </Panel>

      <div className="grid lg:grid-cols-2 gap-4">
        <Panel className="p-4">
          <SectionHeading title="Topics gaining or losing" sub={`New items in the last ${momWindow} days against the ${momWindow} before. Click a topic to open its briefing.`} />
          <MomentumList rows={themeMomentum} onSelect={openTheme} empty="Not enough dated items in this range to compare." />
        </Panel>
        <Panel className="p-4">
          <SectionHeading title="Most-used tags" sub="Across the items in range" />
          <MiniBars data={topTags} />
        </Panel>
      </div>

      <Panel className="p-4 flex items-center gap-4 flex-wrap">
        <div className="min-w-0 flex-1">
          <div className="text-small font-semibold text-ink">Weekly digest</div>
          <div className="text-tiny text-ink-faint">One page of what moved in the last seven days, ready to forward. Always the last seven days, whatever period is chosen above.</div>
        </div>
        <CopyButton text={digest} label="Copy" className="btn text-small" />
        <button onClick={downloadDigest} className="btn">
          <Download className="h-3.5 w-3.5" /> Download Markdown
        </button>
      </Panel>
    </div>
  );
}
