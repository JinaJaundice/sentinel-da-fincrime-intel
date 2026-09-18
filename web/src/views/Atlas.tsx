import { useState } from "react";
import { ExternalLink, CalendarClock } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { Panel, Chip, Dot, Tag } from "../lib/ui";
import { WorldMap } from "../components/WorldMap";
import { JURISDICTIONS, STATUS_META, type Jurisdiction, type RegStatus } from "../content/jurisdictions";
import { longDate } from "../lib/utils";

const STATUS_ORDER: RegStatus[] = ["implemented", "in-progress", "none"];

// Rules by country: a world map of crypto regulation status. Click a dot
// or a country for the status, the summary and the sources.
export function Atlas() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = JURISDICTIONS.find((j) => j.id === selectedId) ?? null;

  const counts: Record<RegStatus, number> = { implemented: 0, "in-progress": 0, none: 0 };
  for (const j of JURISDICTIONS) counts[j.status]++;

  return (
    <div className="space-y-4">
      <PageHeader
        title="Rules by country"
        lede={`Crypto regulation status in ${JURISDICTIONS.length} jurisdictions. Click a dot on the map, or a name below it, to read the status, what it means for a bank, and the sources.`}
      />

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-2.5 min-w-0">
          <WorldMap jurisdictions={JURISDICTIONS} selectedId={selectedId} onSelect={setSelectedId} />
          <div className="flex items-center flex-wrap gap-x-4 gap-y-1.5 text-tiny text-ink-soft">
            {STATUS_ORDER.map((s) => (
              <span key={s} className="inline-flex items-center gap-1.5">
                <Dot tone={STATUS_META[s].tone} />
                {STATUS_META[s].label}
                <span className="text-ink-faint num">{counts[s]}</span>
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
              <div className="flex items-center gap-1.5 label mb-1.5">
                <Dot tone={STATUS_META[status].tone} />
                {STATUS_META[status].label}
                <span className="num">{list.length}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {list.map((j) => (
                  <Chip key={j.id} on={j.id === selectedId} onClick={() => setSelectedId(j.id)}>
                    {j.name}
                  </Chip>
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
        <div className="text-small font-semibold text-ink">Pick a jurisdiction</div>
        <div className="mt-1 text-tiny text-ink-faint max-w-[14rem]">Click a dot on the map, or a name below it, to read its regulation status and sources.</div>
      </div>
    </div>
  );
}

function Detail({ j }: { j: Jurisdiction }) {
  const s = STATUS_META[j.status];
  return (
    <div>
      <div className="flex items-center gap-2 flex-wrap">
        <h3 className="text-body font-semibold text-ink">{j.name}</h3>
        <Tag tone={s.tone}>{s.label}</Tag>
      </div>
      <p className="mt-1.5 text-small font-medium text-ink-soft">{j.headline}</p>
      <p className="mt-2 serif text-small text-ink-soft">{j.summary}</p>

      {j.soWhat && (
        <div className="mt-3 border-l-2 border-signal pl-3">
          <div className="label text-signal">So what for a bank</div>
          <p className="serif text-small text-ink mt-1">{j.soWhat}</p>
        </div>
      )}

      {j.keyDates && j.keyDates.length > 0 && (
        <div className="mt-3 space-y-1.5">
          {j.keyDates.map((d) => (
            <div key={d.label} className="flex items-center gap-2 text-tiny">
              <CalendarClock className="h-3 w-3 text-ink-faint shrink-0" aria-hidden />
              <span className="text-ink num">{longDate(d.date)}</span>
              <span className="text-ink-faint">{d.label}</span>
            </div>
          ))}
        </div>
      )}

      <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5 border-t border-rule pt-2.5">
        <span className="label">Sources</span>
        {j.sources.map((src) => (
          <a key={src.url} href={src.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-tiny text-ink-soft hover:text-signal hover:underline underline-offset-2 transition-colors">
            <ExternalLink className="h-3 w-3" aria-hidden /> {src.name}
          </a>
        ))}
      </div>
    </div>
  );
}
