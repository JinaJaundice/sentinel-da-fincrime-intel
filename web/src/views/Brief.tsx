import { CalendarDays, Bot, ShieldAlert, Layers, Sparkles, ArrowRight } from "lucide-react";
import type { Item } from "../content/types";
import type { Page } from "../components/Sidebar";
import { Panel, Stat, SectionHeading } from "../lib/ui";
import { ItemCard } from "../components/ItemCard";

// The landing view: that the agent is live, the headline numbers, and the
// most recently ingested intelligence.
export function Brief({
  items,
  setPage,
  lastUpdated,
}: {
  items: Item[];
  setPage: (p: Page) => void;
  lastUpdated: string;
}) {
  const published = items.filter((i) => i.status === "published");
  const agentSourced = published.filter((i) => i.addedBy === "agent");
  const highImpact = published.filter((i) => i.impact === "high");
  const thisWeek = published.filter((i) => withinDays(i.addedAt, 7));
  // Newest-ingested first (surfaces what the agent just published).
  const latest = [...published].sort(byIngestedDesc).slice(0, 5);

  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center gap-1.5 text-xs text-neutral-500">
          <CalendarDays className="h-3.5 w-3.5" /> {today}
        </div>
        <h1 className="mt-1 text-2xl font-semibold text-neutral-100 tracking-tight">Overview</h1>
        <p className="text-sm text-neutral-500">
          The financial-crime picture across digital assets — what changed, and what it means.
        </p>
      </div>

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
          className="inline-flex items-center gap-1.5 rounded-lg bg-neutral-800 text-neutral-200 ring-1 ring-neutral-700 text-xs font-medium px-3 py-1.5 hover:bg-neutral-700 transition-colors shrink-0"
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

function withinDays(iso: string, days: number, now = new Date()) {
  const d = new Date(iso + "T00:00:00").getTime();
  return now.getTime() - d <= days * 86_400_000;
}
function byIngestedDesc(a: Item, b: Item) {
  if (a.addedAt !== b.addedAt) return a.addedAt < b.addedAt ? 1 : -1;
  return a.date < b.date ? 1 : -1;
}
