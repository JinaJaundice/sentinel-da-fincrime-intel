import { CalendarClock, History, ExternalLink, MapPin } from "lucide-react";
import type { ReactNode } from "react";
import type { Item } from "../content/types";
import { MILESTONES } from "../content/milestones";
import { IMPACT_TONE } from "../lib/uiTokens";
import { Panel, SectionHeading } from "../lib/ui";
import { relativeDay, cn } from "../lib/utils";

// Phase 3: a forward-looking timeline of key compliance dates plus the
// regulatory developments that recently landed (derived from the items).
export function Radar({ items }: { items: Item[] }) {
  const today = startOfToday();
  const upcoming = MILESTONES.filter((m) => dayMs(m.date) >= today).sort((a, b) => (a.date < b.date ? -1 : 1));
  const recent = items
    .filter((i) => i.status === "published" && i.type === "regulatory" && dayMs(i.date) < today)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 8);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-100 tracking-tight">Regulatory radar</h1>
        <p className="text-sm text-neutral-500">Key compliance dates — what's coming, and what just landed.</p>
      </div>

      <div>
        <SectionHeading Icon={CalendarClock} title="Upcoming" sub="Forward-looking deadlines & milestones" />
        {upcoming.length ? (
          <Timeline>
            {upcoming.map((m) => (
              <TimelineItem key={m.id} accent="violet">
                <Panel className="p-3">
                  <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-[11px] text-neutral-500">
                    <span className="text-neutral-300 tabular-nums">{fmt(m.date)}</span>
                    <Countdown date={m.date} today={today} />
                    {m.tentative && (
                      <span className="rounded bg-neutral-800 text-neutral-400 ring-1 ring-neutral-700 px-1.5 py-0.5">estimated</span>
                    )}
                    {m.region && (
                      <span className="inline-flex items-center gap-0.5">
                        <MapPin className="h-3 w-3" />
                        {m.region}
                      </span>
                    )}
                    {m.impact && (
                      <span className={cn("ml-auto rounded px-1.5 py-0.5 font-medium", IMPACT_TONE[m.impact].chip)}>
                        {IMPACT_TONE[m.impact].label}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-1.5 text-sm font-semibold text-neutral-100">{m.title}</h3>
                  <p className="mt-1 text-[13px] text-neutral-400 leading-relaxed">{m.blurb}</p>
                  {m.source && (
                    <a
                      href={m.source.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-flex items-center gap-1 text-[10px] text-neutral-500 hover:text-violet-300"
                    >
                      <ExternalLink className="h-3 w-3" /> {m.source.name}
                    </a>
                  )}
                </Panel>
              </TimelineItem>
            ))}
          </Timeline>
        ) : (
          <p className="text-sm text-neutral-500">No upcoming milestones tracked.</p>
        )}
      </div>

      <div>
        <SectionHeading Icon={History} title="Recently landed" sub="Regulatory developments now in force or proposed" />
        <Timeline>
          {recent.map((i) => (
            <TimelineItem key={i.id} accent="neutral">
              <Panel className="p-3">
                <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-[11px] text-neutral-500">
                  <span className="text-neutral-300 tabular-nums">{fmt(i.date)}</span>
                  <span>· {relativeDay(i.date)}</span>
                  {i.region && (
                    <span className="inline-flex items-center gap-0.5">
                      <MapPin className="h-3 w-3" />
                      {i.region}
                    </span>
                  )}
                  {i.impact && (
                    <span className={cn("ml-auto rounded px-1.5 py-0.5 font-medium", IMPACT_TONE[i.impact].chip)}>
                      {IMPACT_TONE[i.impact].label}
                    </span>
                  )}
                </div>
                <h3 className="mt-1.5 text-sm font-semibold text-neutral-100">{i.title}</h3>
                {i.soWhat && (
                  <p className="mt-1 text-[12px] text-neutral-400 leading-relaxed">
                    <span className="text-neutral-300 font-medium">So what — </span>
                    {i.soWhat}
                  </p>
                )}
              </Panel>
            </TimelineItem>
          ))}
        </Timeline>
      </div>
    </div>
  );
}

function Timeline({ children }: { children: ReactNode }) {
  return <ol className="relative border-l border-neutral-800 ml-2 space-y-3">{children}</ol>;
}

function TimelineItem({ children, accent }: { children: ReactNode; accent: "violet" | "neutral" }) {
  return (
    <li className="ml-5 relative">
      <span
        className={cn(
          "absolute -left-[23px] top-3 w-2.5 h-2.5 rounded-full ring-4 ring-neutral-950",
          accent === "violet" ? "bg-violet-500" : "bg-neutral-600",
        )}
      />
      {children}
    </li>
  );
}

function Countdown({ date, today }: { date: string; today: number }) {
  const days = Math.round((dayMs(date) - today) / 86_400_000);
  const label =
    days <= 0 ? "today" : days === 1 ? "tomorrow" : days < 14 ? `in ${days} days` : days < 60 ? `in ${Math.round(days / 7)} weeks` : `in ${Math.round(days / 30)} months`;
  const soon = days <= 30;
  return (
    <span
      className={cn(
        "rounded px-1.5 py-0.5 font-medium",
        soon ? "bg-violet-500/15 text-violet-200 ring-1 ring-violet-500/30" : "bg-neutral-800 text-neutral-400 ring-1 ring-neutral-700",
      )}
    >
      {label}
    </span>
  );
}

function fmt(date: string) {
  return new Date(date + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}
function dayMs(date: string) {
  return new Date(date + "T00:00:00").getTime();
}
function startOfToday() {
  const n = new Date();
  return new Date(n.getFullYear(), n.getMonth(), n.getDate()).getTime();
}
