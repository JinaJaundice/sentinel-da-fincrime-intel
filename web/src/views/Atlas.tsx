import { useState } from "react";
import { Globe, ExternalLink, CalendarClock, Lightbulb, MousePointerClick } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { Panel, Stat } from "../lib/ui";
import { WorldMap } from "../components/WorldMap";
import { JURISDICTIONS, STATUS_META, type Jurisdiction, type RegStatus } from "../content/jurisdictions";
import { longDate, cn } from "../lib/utils";

const STATUS_ORDER: RegStatus[] = ["implemented", "in-progress", "none"];

export function Atlas() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = JURISDICTIONS.find((j) => j.id === selectedId) ?? null;

  const counts: Record<RegStatus, number> = { implemented: 0, "in-progress": 0, none: 0 };
  for (const j of JURISDICTIONS) counts[j.status]++;

  return (
    <div className="space-y-4">
      <PageHeader
        Icon={Globe}
        title="Atlas"
        subtitle="Crypto regulation worldwide: click a marker or country to read the status and sources."
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat Icon={Globe} tone="brand" label="Tracked" value={JURISDICTIONS.length} />
        <Stat Icon={Globe} tone="brand" label="Implemented" value={counts.implemented} />
        <Stat Icon={Globe} tone="amber" label="In progress" value={counts["in-progress"]} />
        <Stat Icon={Globe} tone="neutral" label="None / restrictive" value={counts.none} />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-3">
          <WorldMap jurisdictions={JURISDICTIONS} selectedId={selectedId} onSelect={setSelectedId} />
          <div className="flex items-center flex-wrap gap-x-4 gap-y-1.5 text-[11px] text-neutral-400">
            {STATUS_ORDER.map((s) => (
              <span key={s} className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: STATUS_META[s].dot }} />
                {STATUS_META[s].label}
                <span className="text-neutral-600 tabular-nums">{counts[s]}</span>
              </span>
            ))}
          </div>
        </div>

        <Panel className="p-4">{selected ? <Detail j={selected} /> : <EmptyDetail />}</Panel>
      </div>

      <div className="space-y-3">
        {STATUS_ORDER.map((status) => {
          const list = JURISDICTIONS.filter((j) => j.status === status).sort((a, b) => a.name.localeCompare(b.name));
          return (
            <div key={status}>
              <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 mb-1.5">
                <span className="w-2 h-2 rounded-full" style={{ background: STATUS_META[status].dot }} />
                {STATUS_META[status].label}
                <span className="text-neutral-600 tabular-nums">{list.length}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {list.map((j) => (
                  <button
                    key={j.id}
                    onClick={() => setSelectedId(j.id)}
                    className={cn(
                      "rounded-md px-2.5 py-1 text-[11px] font-medium ring-1 transition-colors",
                      j.id === selectedId
                        ? "bg-violet-500/15 text-violet-200 ring-violet-500/30"
                        : "bg-neutral-900 text-neutral-400 ring-neutral-800 hover:text-neutral-200 hover:bg-neutral-800",
                    )}
                  >
                    {j.name}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EmptyDetail() {
  return (
    <div className="h-full grid place-items-center text-center py-8">
      <div>
        <MousePointerClick className="h-5 w-5 text-neutral-600 mx-auto" />
        <div className="mt-2 text-sm font-medium text-neutral-300">Pick a jurisdiction</div>
        <div className="mt-1 text-xs text-neutral-500 font-light max-w-[14rem]">
          Click a pulsing marker on the map, or a name below, to read its crypto-regulation status and sources.
        </div>
      </div>
    </div>
  );
}

function Detail({ j }: { j: Jurisdiction }) {
  const s = STATUS_META[j.status];
  return (
    <div>
      <div className="flex items-center gap-2 flex-wrap">
        <span className={cn("rounded-md px-1.5 py-0.5 text-[11px] font-medium", s.chip)}>{s.label}</span>
        <h3 className="text-sm font-semibold text-neutral-100">{j.name}</h3>
      </div>
      <p className="mt-1.5 text-[12px] font-medium text-violet-300/90">{j.headline}</p>
      <p className="mt-2 text-[13px] text-neutral-400 leading-relaxed font-light">{j.summary}</p>

      {j.soWhat && (
        <div className="mt-3 flex gap-2 rounded-lg bg-neutral-800/40 border-l-2 border-violet-500/50 px-3 py-2">
          <Lightbulb className="h-3.5 w-3.5 text-violet-300 mt-0.5 shrink-0" />
          <p className="text-[12px] text-neutral-300 leading-relaxed">
            <span className="font-semibold text-neutral-100">So what: </span>
            {j.soWhat}
          </p>
        </div>
      )}

      {j.keyDates && j.keyDates.length > 0 && (
        <div className="mt-3 space-y-1.5">
          {j.keyDates.map((d) => (
            <div key={d.label} className="flex items-center gap-2 text-[11px]">
              <CalendarClock className="h-3 w-3 text-neutral-500 shrink-0" />
              <span className="text-neutral-300 tabular-nums">{longDate(d.date)}</span>
              <span className="text-neutral-500">{d.label}</span>
            </div>
          ))}
        </div>
      )}

      <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5 border-t border-neutral-800 pt-2.5">
        {j.sources.map((src) => (
          <a
            key={src.url}
            href={src.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-[10px] text-neutral-500 hover:text-violet-300 transition-colors"
          >
            <ExternalLink className="h-3 w-3" /> {src.name}
          </a>
        ))}
      </div>
    </div>
  );
}
