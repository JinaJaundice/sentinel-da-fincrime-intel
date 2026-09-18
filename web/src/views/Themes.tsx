import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Item } from "../content/types";
import { THEMES, themeItems, themeMilestones, type Theme } from "../content/themes";
import { PageHeader } from "../components/PageHeader";
import { DataTable } from "../components/DataTable";
import { ExportMenu } from "../components/ExportMenu";
import { Panel, FigureStrip, SectionHeading, Tag } from "../lib/ui";
import { ImpactMix } from "../components/viz";
import { longDate } from "../lib/utils";

// Topic briefings: one page per topic that gathers every kind of item on
// it, with a primer a reader can lift into a client briefing.
export function Themes({ items, theme, setTheme }: { items: Item[]; theme: string | null; setTheme: (id: string | null) => void }) {
  const current = theme ? (THEMES.find((t) => t.id === theme) ?? null) : null;
  if (current) return <ThemeDetail items={items} theme={current} onBack={() => setTheme(null)} />;

  return (
    <div className="space-y-5">
      <PageHeader title="Topic briefings" lede="The picture organised by topic. Each briefing gathers the news, rules, crime patterns, vendors and deals on one subject, with a primer at the top." />
      <Panel className="overflow-hidden">
        {THEMES.map((t, i) => {
          const list = themeItems(items, t);
          const high = list.filter((x) => x.impact === "high").length;
          return (
            <button key={t.id} onClick={() => setTheme(t.id)} className={i === 0 ? "w-full flex items-center gap-4 px-4 py-3.5 text-left hover:bg-sunken" : "row w-full flex items-center gap-4 px-4 py-3.5 text-left"}>
              <t.Icon className="h-5 w-5 text-ink-faint shrink-0" strokeWidth={1.5} aria-hidden />
              <span className="flex-1 min-w-0">
                <span className="block text-body font-semibold text-ink">{t.label}</span>
                <span className="block text-small text-ink-soft mt-0.5">{t.tagline}</span>
              </span>
              <span className="hidden sm:block text-right shrink-0 text-tiny text-ink-faint num">
                <span className="block text-ink">{list.length} items</span>
                <span className="block">{high} high impact</span>
              </span>
              <ArrowRight className="h-4 w-4 text-ink-faint shrink-0" aria-hidden />
            </button>
          );
        })}
      </Panel>
    </div>
  );
}

function ThemeDetail({ items, theme, onBack }: { items: Item[]; theme: Theme; onBack: () => void }) {
  const list = themeItems(items, theme);
  const high = list.filter((i) => i.impact === "high").length;
  const milestones = themeMilestones(theme).sort((a, b) => (a.date < b.date ? -1 : 1));
  const today = startOfToday();

  return (
    <div className="space-y-5">
      <PageHeader
        kicker="Topic briefing"
        title={theme.label}
        lede={theme.tagline}
        right={
          <>
            <ExportMenu items={list} docTitle={theme.label} filenameBase={`sentinel-topic-${theme.id}`} intro={theme.primer} />
            <button onClick={onBack} className="btn">
              <ArrowLeft className="h-3.5 w-3.5" /> All topics
            </button>
          </>
        }
      />

      <div className="border-l-2 border-signal pl-4">
        <div className="label text-signal">What you need to know</div>
        <p className="serif text-ink mt-1.5 max-w-3xl">{theme.primer}</p>
      </div>

      <FigureStrip
        figures={[
          { label: "Items on this topic", value: list.length },
          { label: "High impact", value: high, tone: "high" },
          { label: "Regulation", value: list.filter((i) => i.type === "regulatory").length },
          { label: "Dates ahead", value: milestones.filter((m) => dayMs(m.date) >= today).length },
        ]}
      />

      <div className="grid lg:grid-cols-3 gap-4">
        <Panel className="p-4">
          <div className="label mb-2">Risk mix on this topic</div>
          <ImpactMix items={list} />
        </Panel>
        {milestones.length > 0 && (
          <Panel className="p-4 lg:col-span-2">
            <div className="label mb-2">Key dates</div>
            <div className="divide-y divide-rule">
              {milestones.map((m) => {
                const upcoming = dayMs(m.date) >= today;
                return (
                  <div key={m.id} className="flex items-center gap-3 py-1.5 text-tiny first:pt-0 last:pb-0">
                    <span className="text-ink num w-24 shrink-0">{longDate(m.date)}</span>
                    <span className="text-ink-soft truncate flex-1">{m.title}</span>
                    <Tag tone={upcoming ? "signal" : "neutral"}>{upcoming ? "ahead" : "passed"}</Tag>
                  </div>
                );
              })}
            </div>
          </Panel>
        )}
      </div>

      <section>
        <SectionHeading title="Everything on this topic" sub="News, rules, crime patterns, vendors and deals, newest first" />
        {list.length > 0 ? <DataTable items={list} variant="signal" /> : <p className="text-small text-ink-faint">This topic has no items yet and will fill as the agent publishes.</p>}
      </section>
    </div>
  );
}

function dayMs(date: string) {
  return new Date(date + "T00:00:00").getTime();
}
function startOfToday() {
  const n = new Date();
  return new Date(n.getFullYear(), n.getMonth(), n.getDate()).getTime();
}
