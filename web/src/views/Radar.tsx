import { ExternalLink, MapPin } from "lucide-react";
import type { Item } from "../content/types";
import { MILESTONES } from "../content/milestones";
import { IMPACT_TONE } from "../lib/uiTokens";
import { Panel, SectionHeading, Tag } from "../lib/ui";
import { relativeDay, longDate } from "../lib/utils";
import { PageHeader } from "../components/PageHeader";

// Dates ahead: the deadlines and milestones coming, then the rules that
// recently landed (drawn from the regulation items).
export function Radar({ items }: { items: Item[] }) {
  const today = startOfToday();
  const upcoming = MILESTONES.filter((m) => dayMs(m.date) >= today).sort((a, b) => (a.date < b.date ? -1 : 1));
  const recent = items
    .filter((i) => i.status === "published" && i.type === "regulatory" && dayMs(i.date) < today)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 10);

  return (
    <div className="space-y-6">
      <PageHeader title="Dates ahead" lede="The compliance deadlines and milestones coming up, with a countdown to each, and the rules that landed most recently." />

      <section>
        <SectionHeading title="Coming up" sub={`${upcoming.length} dated deadlines and milestones, soonest first`} />
        {upcoming.length ? (
          <Panel className="overflow-hidden">
            {upcoming.map((m, i) => (
              <div key={m.id} className={cn2("grid sm:grid-cols-[9rem_1fr] gap-x-4 gap-y-1 px-4 py-3", i > 0 && "border-t border-rule")}>
                <div>
                  <div className="text-small font-semibold text-ink num">{longDate(m.date)}</div>
                  <div className="mt-1 flex items-center flex-wrap gap-1.5">
                    <Countdown date={m.date} today={today} />
                    {m.tentative && <Tag>estimated</Tag>}
                  </div>
                </div>
                <div className="min-w-0">
                  <div className="flex items-start gap-2">
                    <h3 className="text-small font-semibold text-ink leading-snug flex-1">{m.title}</h3>
                    {m.impact && (
                      <Tag tone={IMPACT_TONE[m.impact].tone} className="shrink-0">
                        {IMPACT_TONE[m.impact].label}
                      </Tag>
                    )}
                  </div>
                  <p className="mt-1 serif text-small text-ink-soft">{m.blurb}</p>
                  <div className="mt-1.5 flex items-center flex-wrap gap-x-3 gap-y-1 text-tiny text-ink-faint">
                    {m.region && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3 w-3" aria-hidden /> {m.region}
                      </span>
                    )}
                    {m.source && (
                      <a href={m.source.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-ink-soft hover:text-signal hover:underline underline-offset-2">
                        <ExternalLink className="h-3 w-3" aria-hidden /> {m.source.name}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </Panel>
        ) : (
          <p className="text-small text-ink-faint">No dated milestones ahead.</p>
        )}
      </section>

      <section>
        <SectionHeading title="Recently landed" sub="Rules now in force or proposed, newest first" />
        <Panel className="overflow-hidden">
          {recent.map((i, idx) => (
            <div key={i.id} className={cn2("grid sm:grid-cols-[9rem_1fr] gap-x-4 gap-y-1 px-4 py-3", idx > 0 && "border-t border-rule")}>
              <div>
                <div className="text-small text-ink num">{longDate(i.date)}</div>
                <div className="text-tiny text-ink-faint">{relativeDay(i.date)}</div>
              </div>
              <div className="min-w-0">
                <div className="flex items-start gap-2">
                  <h3 className="text-small font-semibold text-ink leading-snug flex-1">{i.title}</h3>
                  {i.impact && (
                    <Tag tone={IMPACT_TONE[i.impact].tone} className="shrink-0">
                      {IMPACT_TONE[i.impact].label}
                    </Tag>
                  )}
                </div>
                {i.soWhat && (
                  <p className="mt-1 serif text-small text-ink-soft">
                    <span className="font-semibold text-ink">So what for a bank: </span>
                    {i.soWhat}
                  </p>
                )}
                {i.region && (
                  <div className="mt-1.5 inline-flex items-center gap-1 text-tiny text-ink-faint">
                    <MapPin className="h-3 w-3" aria-hidden /> {i.region}
                  </div>
                )}
              </div>
            </div>
          ))}
        </Panel>
      </section>
    </div>
  );
}

function Countdown({ date, today }: { date: string; today: number }) {
  const days = Math.round((dayMs(date) - today) / 86_400_000);
  const label = days <= 0 ? "today" : days === 1 ? "tomorrow" : days < 14 ? `in ${days} days` : days < 60 ? `in ${Math.round(days / 7)} weeks` : `in ${Math.round(days / 30)} months`;
  return <Tag tone={days <= 30 ? "signal" : "neutral"}>{label}</Tag>;
}

function cn2(...c: (string | false | undefined)[]) {
  return c.filter(Boolean).join(" ");
}
function dayMs(date: string) {
  return new Date(date + "T00:00:00").getTime();
}
function startOfToday() {
  const n = new Date();
  return new Date(n.getFullYear(), n.getMonth(), n.getDate()).getTime();
}
