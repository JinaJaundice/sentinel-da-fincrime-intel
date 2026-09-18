import { ArrowRight, Download } from "lucide-react";
import type { Item } from "../content/types";
import type { Page } from "../lib/nav";
import { MILESTONES } from "../content/milestones";
import { Panel, FigureStrip, SectionHeading, Tag } from "../lib/ui";
import { DataTable } from "../components/DataTable";
import { CopyButton } from "../components/CopyButton";
import { PageHeader } from "../components/PageHeader";
import { ImpactMix, MiniBars } from "../components/viz";
import { countBy } from "../lib/insights";
import { weeklyDigest, weeklyMovers } from "../lib/digest";
import { downloadText } from "../lib/export";
import { withinDays, longDate } from "../lib/utils";

// The morning read: the figures, what moved this week by topic, the latest
// items, and at a glance the next deadline, the risk mix and the regions.
export function Brief({ items, setPage, setTheme, lastUpdated }: { items: Item[]; setPage: (p: Page) => void; setTheme: (id: string) => void; lastUpdated: string }) {
  const published = items.filter((i) => i.status === "published");
  const agentSourced = published.filter((i) => i.addedBy === "agent");
  const highImpact = published.filter((i) => i.impact === "high");
  const thisWeek = published.filter((i) => withinDays(i.addedAt, 7));
  const latest = [...published].sort(byAddedDesc).slice(0, 12);

  const today = startOfToday();
  const nextMs = [...MILESTONES].filter((m) => dayMs(m.date) >= today).sort((a, b) => (a.date < b.date ? -1 : 1))[0];
  const regions = countBy(published, (i) => i.region);

  const todayLabel = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  const movers = weeklyMovers(published).slice(0, 6);
  const digest = weeklyDigest(published);
  const openTheme = (id: string) => {
    setPage("themes"); // setPage clears the topic, so set it after
    setTheme(id);
  };
  const downloadDigest = () => downloadText(`sentinel-weekly-digest-${new Date().toISOString().slice(0, 10)}.md`, digest, "text/markdown");

  return (
    <div className="space-y-6">
      <PageHeader
        kicker={todayLabel}
        title="Today's briefing"
        lede={`What changed across digital assets and financial crime, and what it means for a bank. The agent adds sourced items every day; its last run was ${longDate(lastUpdated)}.`}
        right={
          <>
            <CopyButton text={digest} label="Copy digest" className="btn text-small" />
            <button onClick={downloadDigest} className="btn" title="Download the weekly digest as Markdown">
              <Download className="h-3.5 w-3.5" /> Download digest
            </button>
          </>
        }
      />

      <FigureStrip
        figures={[
          { label: "Items tracked", value: published.length },
          { label: "Added by the agent", value: agentSourced.length },
          { label: "High impact", value: highImpact.length, tone: "high" },
          { label: "New this week", value: thisWeek.length, tone: "signal" },
        ]}
      />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6 min-w-0">
          <section className="min-w-0">
            <SectionHeading title="New this week, by topic" sub="Which topic briefings gained items in the last seven days" />
            {movers.length > 0 ? (
              <Panel>
                {movers.map((m, i) => (
                  <button key={m.id} onClick={() => openTheme(m.id)} className={i === 0 ? "w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-sunken" : "row w-full flex items-center gap-3 px-4 py-2.5 text-left"}>
                    <span className="flex-1 text-small text-ink font-medium">{m.label}</span>
                    <span className="text-tiny text-ink-faint num">{m.n} new</span>
                    <ArrowRight className="h-3.5 w-3.5 text-ink-faint" aria-hidden />
                  </button>
                ))}
              </Panel>
            ) : (
              <p className="text-small text-ink-faint">No new items in the last seven days.</p>
            )}
          </section>

          <section className="min-w-0">
            <SectionHeading title="Latest items" sub="The twelve most recently added, across every kind" right={<button onClick={() => setPage("signals")} className="btn btn-quiet text-tiny">All news and regulation <ArrowRight className="h-3 w-3" /></button>} />
            <DataTable items={latest} variant="signal" initialSort={{ key: "Added", dir: "desc" }} />
          </section>
        </div>

        <div className="space-y-4 min-w-0">
          {nextMs && (
            <Panel className="p-4">
              <div className="label">Next deadline</div>
              <div className="mt-1.5 text-small font-semibold text-ink leading-snug">{nextMs.title}</div>
              <div className="mt-2 flex items-center gap-2 text-tiny">
                <Tag tone="signal">{countdown(nextMs.date, today)}</Tag>
                <span className="text-ink-faint num">{longDate(nextMs.date)}</span>
              </div>
              <button onClick={() => setPage("radar")} className="mt-2.5 btn btn-quiet text-tiny -ml-1.5">
                All dates ahead <ArrowRight className="h-3 w-3" />
              </button>
            </Panel>
          )}
          <Panel className="p-4">
            <div className="label mb-2">Risk mix of everything tracked</div>
            <ImpactMix items={published} />
          </Panel>
          <Panel className="p-4">
            <div className="label mb-2">Items by region</div>
            <MiniBars data={regions.slice(0, 6)} />
          </Panel>
        </div>
      </div>
    </div>
  );
}

function byAddedDesc(a: Item, b: Item) {
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
function countdown(date: string, today: number) {
  const days = Math.round((dayMs(date) - today) / 86_400_000);
  if (days <= 0) return "today";
  if (days === 1) return "tomorrow";
  if (days < 14) return `in ${days} days`;
  if (days < 60) return `in ${Math.round(days / 7)} weeks`;
  return `in ${Math.round(days / 30)} months`;
}
