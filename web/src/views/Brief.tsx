import {
  Bot,
  ShieldAlert,
  Layers,
  Sparkles,
  ArrowRight,
  Newspaper,
  TrendingUp,
  Boxes,
  Crosshair,
  CalendarClock,
  Globe,
  LayoutDashboard,
  Flame,
  Download,
} from "lucide-react";
import type { Item, ItemType } from "../content/types";
import type { Page } from "../components/Sidebar";
import { MILESTONES } from "../content/milestones";
import { Panel, Stat, SectionHeading } from "../lib/ui";
import { ItemCard } from "../components/ItemCard";
import { StreamCard } from "../components/StreamCard";
import { CopyButton } from "../components/CopyButton";
import { PageHeader } from "../components/PageHeader";
import { ImpactMix, MiniBars } from "../components/viz";
import { countBy } from "../lib/insights";
import { weeklyDigest, weeklyMovers } from "../lib/digest";
import { downloadText } from "../lib/export";
import { withinDays } from "../lib/utils";

// The command center: headline metrics, a clickable summary of every
// stream, an "at a glance" panel, and the latest few items.
export function Brief({
  items,
  setPage,
  setTheme,
  lastUpdated,
}: {
  items: Item[];
  setPage: (p: Page) => void;
  setTheme: (id: string) => void;
  lastUpdated: string;
}) {
  const published = items.filter((i) => i.status === "published");
  const agentSourced = published.filter((i) => i.addedBy === "agent");
  const highImpact = published.filter((i) => i.impact === "high");
  const thisWeek = published.filter((i) => withinDays(i.addedAt, 7));
  const latest = [...published].sort(byIngestedDesc).slice(0, 3);

  const stream = (types: ItemType[]) => published.filter((i) => types.includes(i.type)).sort(byIngestedDesc);
  const signals = stream(["signal", "regulatory"]);
  const ventures = stream(["venture"]);
  const solutions = stream(["solution"]);
  const typologies = stream(["typology"]);
  const shortlisted = solutions.filter((i) => i.solution?.stance === "evaluate" || i.solution?.stance === "shortlist").length;

  const today = startOfToday();
  const nextMs = [...MILESTONES].filter((m) => dayMs(m.date) >= today).sort((a, b) => (a.date < b.date ? -1 : 1))[0];
  const regions = countBy(published, (i) => i.region);

  const todayLabel = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  // "This week" pulse — reuses the digest machinery.
  const movers = weeklyMovers(published).slice(0, 4);
  const digest = weeklyDigest(published);
  const openTheme = (id: string) => {
    setPage("themes"); // setPage clears the theme, so set it after
    setTheme(id);
  };
  const downloadDigest = () =>
    downloadText(`sentinel-weekly-digest-${new Date().toISOString().slice(0, 10)}.md`, digest, "text/markdown");

  return (
    <div className="space-y-5">
      <PageHeader
        Icon={LayoutDashboard}
        eyebrow={todayLabel}
        title="Overview"
        subtitle="A single, agent-tended pane of glass for financial crime across digital assets — what changed, and what it means."
      />

      <Panel className="p-3 flex items-center gap-3">
        <span className="relative grid place-items-center w-8 h-8 rounded-lg bg-violet-500/15 ring-1 ring-violet-500/30 text-violet-300 shrink-0">
          <Bot className="h-4 w-4" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-violet-400 ring-2 ring-neutral-900" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium text-neutral-200">The intelligence agent is publishing automatically</div>
          <div className="text-xs text-neutral-500">
            Last updated <span className="text-neutral-300 tabular-nums">{lastUpdated}</span> · auto-publish, no human-in-the-loop
          </div>
        </div>
        <button
          onClick={() => setPage("activity")}
          className="inline-flex items-center gap-1.5 rounded-full bg-white/5 text-neutral-200 ring-1 ring-white/10 text-xs font-medium px-3.5 py-1.5 hover:bg-white/10 transition-colors shrink-0"
        >
          View activity <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </Panel>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat Icon={Layers} tone="brand" label="Tracked" value={published.length} />
        <Stat Icon={Bot} tone="brand" label="Agent-sourced" value={agentSourced.length} />
        <Stat Icon={ShieldAlert} tone="rose" label="High impact" value={highImpact.length} />
        <Stat Icon={Sparkles} tone="neutral" label="Added this week" value={thisWeek.length} />
      </div>

      <Panel className="p-4">
        <SectionHeading
          Icon={Flame}
          title="This week"
          sub="What moved in the last 7 days"
          right={
            <div className="flex items-center gap-2">
              <CopyButton
                text={digest}
                label="Copy digest"
                className="rounded-lg px-2.5 py-1.5 text-[11px] font-medium bg-neutral-900 ring-1 ring-neutral-800 hover:bg-neutral-800"
              />
              <button
                onClick={downloadDigest}
                className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-medium bg-neutral-900 text-neutral-300 ring-1 ring-neutral-800 hover:text-neutral-100 hover:bg-neutral-800 transition-colors"
              >
                <Download className="h-3.5 w-3.5" /> .md
              </button>
            </div>
          }
        />
        {movers.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {movers.map((m) => (
              <button
                key={m.id}
                onClick={() => openTheme(m.id)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-violet-500/10 text-violet-200 ring-1 ring-violet-500/25 px-2.5 py-1 text-[12px] hover:bg-violet-500/20 transition-colors"
              >
                {m.label} <span className="text-violet-300/70 tabular-nums">{m.n} new</span>
              </button>
            ))}
          </div>
        ) : (
          <p className="text-xs text-neutral-500">No new items in the last 7 days.</p>
        )}
      </Panel>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <SectionHeading Icon={LayoutDashboard} title="Streams" sub="Jump into any view" />
          <div className="grid sm:grid-cols-2 gap-3">
            <StreamCard
              Icon={Newspaper}
              name="Signals"
              count={signals.length}
              latest={signals[0]?.title}
              meta={`${signals.filter((i) => i.impact === "high").length} high-impact`}
              onClick={() => setPage("signals")}
            />
            <StreamCard
              Icon={TrendingUp}
              name="Ventures"
              count={ventures.length}
              latest={ventures[0]?.title}
              meta="Funding, M&A & market moves"
              onClick={() => setPage("ventures")}
            />
            <StreamCard
              Icon={Boxes}
              name="Solutions"
              count={solutions.length}
              latest={solutions[0]?.title}
              meta={`${shortlisted} on the shortlist`}
              onClick={() => setPage("solutions")}
            />
            <StreamCard
              Icon={Crosshair}
              name="Intelligence"
              count={typologies.length}
              latest={typologies[0]?.title}
              meta="Laundering typologies"
              onClick={() => setPage("intelligence")}
            />
            <StreamCard
              Icon={CalendarClock}
              name="Radar"
              count={MILESTONES.length}
              latest={nextMs?.title}
              meta={nextMs ? `Next: ${countdown(nextMs.date, today)}` : "Key compliance dates"}
              onClick={() => setPage("radar")}
            />
          </div>
        </div>

        <div className="space-y-3">
          <SectionHeading Icon={Globe} title="At a glance" />
          {nextMs && (
            <Panel className="p-4">
              <div className="text-[11px] uppercase tracking-wide text-neutral-500">Next deadline</div>
              <div className="mt-1 text-sm font-semibold text-neutral-100 leading-snug">{nextMs.title}</div>
              <div className="mt-1.5 inline-flex items-center gap-1.5 text-[12px]">
                <span className="rounded bg-violet-500/15 text-violet-200 ring-1 ring-violet-500/30 px-1.5 py-0.5 font-medium">{countdown(nextMs.date, today)}</span>
                <span className="text-neutral-500 tabular-nums">{fmt(nextMs.date)}</span>
              </div>
            </Panel>
          )}
          <Panel className="p-4">
            <SectionHeading Icon={ShieldAlert} title="Risk mix" />
            <ImpactMix items={published} />
          </Panel>
          <Panel className="p-4">
            <SectionHeading Icon={Globe} title="Top regions" />
            <MiniBars data={regions.slice(0, 5)} />
          </Panel>
        </div>
      </div>

      <div>
        <SectionHeading Icon={Sparkles} title="Latest intelligence" sub="Most recently ingested, across every stream" />
        <div className="space-y-3">
          {latest.map((i) => (
            <div key={i.id} className="rise">
              <ItemCard item={i} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function byIngestedDesc(a: Item, b: Item) {
  if (a.addedAt !== b.addedAt) return a.addedAt < b.addedAt ? 1 : -1;
  return a.date < b.date ? 1 : -1;
}
function startOfToday() {
  const n = new Date();
  return new Date(n.getFullYear(), n.getMonth(), n.getDate()).getTime();
}
function dayMs(date: string) {
  return new Date(date + "T00:00:00").getTime();
}
function fmt(date: string) {
  return new Date(date + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}
function countdown(date: string, today: number) {
  const days = Math.round((dayMs(date) - today) / 86_400_000);
  if (days <= 0) return "today";
  if (days === 1) return "tomorrow";
  if (days < 14) return `in ${days} days`;
  if (days < 60) return `in ${Math.round(days / 7)} weeks`;
  return `in ${Math.round(days / 30)} months`;
}
