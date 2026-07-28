import { Shapes, ArrowLeft, Layers, ShieldAlert, Scale, CalendarClock } from "lucide-react";
import type { Item, ItemType } from "../content/types";
import { THEMES, themeItems, themeMilestones, type Theme } from "../content/themes";
import { TYPE_META } from "../content/taxonomy";
import { PageHeader } from "../components/PageHeader";
import { StreamCard } from "../components/StreamCard";
import { ItemCard } from "../components/ItemCard";
import { ExportMenu } from "../components/ExportMenu";
import { Panel, Stat, SectionHeading } from "../lib/ui";
import { ImpactMix } from "../components/viz";
import { cn } from "../lib/utils";

// A curated lens over the items. Theme overview = a grid of briefings;
// a selected theme = an aggregated, grouped, client-ready briefing page.
export function Themes({
  items,
  theme,
  setTheme,
}: {
  items: Item[];
  theme: string | null;
  setTheme: (id: string | null) => void;
}) {
  const current = theme ? (THEMES.find((t) => t.id === theme) ?? null) : null;
  if (current) return <ThemeDetail items={items} theme={current} onBack={() => setTheme(null)} />;

  return (
    <div className="space-y-5">
      <PageHeader
        Icon={Shapes}
        title="Themes"
        subtitle="The digital-asset × financial-crime picture, organised by topic, each one a ready-made briefing for learning or client delivery."
      />
      <div className="grid sm:grid-cols-2 gap-3">
        {THEMES.map((t) => {
          const list = themeItems(items, t);
          const high = list.filter((i) => i.impact === "high").length;
          return (
            <StreamCard
              key={t.id}
              Icon={t.Icon}
              name={t.label}
              count={list.length}
              latest={t.tagline}
              meta={`${high} high-impact · ${list.length} item${list.length === 1 ? "" : "s"}`}
              onClick={() => setTheme(t.id)}
            />
          );
        })}
      </div>
    </div>
  );
}

const GROUPS: { type: ItemType; label: string }[] = [
  { type: "regulatory", label: "Regulatory" },
  { type: "signal", label: "Signals" },
  { type: "typology", label: "Typologies" },
  { type: "solution", label: "Solutions" },
  { type: "venture", label: "Ventures" },
];

function ThemeDetail({ items, theme, onBack }: { items: Item[]; theme: Theme; onBack: () => void }) {
  const list = themeItems(items, theme);
  const high = list.filter((i) => i.impact === "high").length;
  const milestones = themeMilestones(theme).sort((a, b) => (a.date < b.date ? -1 : 1));
  const today = startOfToday();

  return (
    <div className="space-y-5">
      <PageHeader
        Icon={theme.Icon}
        title={theme.label}
        subtitle={theme.tagline}
        right={
          <div className="flex items-center gap-2">
            <ExportMenu
              items={list}
              docTitle={theme.label}
              filenameBase={`sentinel-theme-${theme.id}`}
              intro={theme.primer}
            />
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/5 text-neutral-300 ring-1 ring-white/10 text-xs font-medium px-3 py-1.5 hover:bg-white/10 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> All themes
            </button>
          </div>
        }
      />

      <Panel className="p-4 border-l-2 border-violet-500/50">
        <div className="text-[11px] uppercase tracking-[0.14em] text-violet-300/80 font-medium mb-1.5">What you need to know</div>
        <p className="text-[13px] sm:text-sm text-neutral-300 leading-relaxed font-light">{theme.primer}</p>
      </Panel>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat Icon={Layers} tone="brand" label="On this theme" value={list.length} />
        <Stat Icon={ShieldAlert} tone="rose" label="High impact" value={high} />
        <Stat Icon={Scale} tone="neutral" label="Regulatory" value={list.filter((i) => i.type === "regulatory").length} />
        <Stat Icon={CalendarClock} tone="neutral" label="Key dates" value={milestones.length} />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <Panel className="p-4">
          <SectionHeading Icon={ShieldAlert} title="Risk mix" />
          <ImpactMix items={list} />
        </Panel>
        {milestones.length > 0 && (
          <Panel className="p-4 lg:col-span-2">
            <SectionHeading Icon={CalendarClock} title="Key dates" />
            <div className="space-y-2">
              {milestones.map((m) => {
                const upcoming = dayMs(m.date) >= today;
                return (
                  <div key={m.id} className="flex items-center gap-2 text-[12px]">
                    <span className="text-neutral-300 tabular-nums w-20 shrink-0">{fmt(m.date)}</span>
                    <span className="text-neutral-400 truncate flex-1">{m.title}</span>
                    <span
                      className={cn(
                        "rounded px-1.5 py-0.5 text-[10px] font-medium shrink-0",
                        upcoming
                          ? "bg-violet-500/15 text-violet-200 ring-1 ring-violet-500/30"
                          : "bg-neutral-800 text-neutral-500 ring-1 ring-neutral-700",
                      )}
                    >
                      {upcoming ? "upcoming" : "passed"}
                    </span>
                  </div>
                );
              })}
            </div>
          </Panel>
        )}
      </div>

      {GROUPS.map((g) => {
        const groupItems = list.filter((i) => i.type === g.type);
        if (groupItems.length === 0) return null;
        return (
          <div key={g.type}>
            <SectionHeading
              Icon={TYPE_META[g.type].Icon}
              title={g.label}
              right={<span className="text-xs text-neutral-500 tabular-nums">{groupItems.length}</span>}
            />
            <div className="space-y-3">
              {groupItems.map((i) => (
                <div key={i.id} className="rise">
                  <ItemCard item={i} />
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {list.length === 0 && (
        <p className="text-sm text-neutral-500 font-light">No items match this theme yet; it will populate as the agent publishes relevant developments.</p>
      )}
    </div>
  );
}

function fmt(date: string) {
  return new Date(date + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "2-digit" });
}
function dayMs(date: string) {
  return new Date(date + "T00:00:00").getTime();
}
function startOfToday() {
  const n = new Date();
  return new Date(n.getFullYear(), n.getMonth(), n.getDate()).getTime();
}
