import { useState } from "react";
import { Landmark, FileText, ShieldAlert, CalendarClock } from "lucide-react";
import type { Item } from "../content/types";
import { PageHeader } from "../components/PageHeader";
import { DataTable } from "../components/DataTable";
import { ExportMenu } from "../components/ExportMenu";
import { Panel, Stat, SectionHeading } from "../lib/ui";
import { ImpactMix, MiniBars } from "../components/viz";
import { countBy } from "../lib/insights";
import { relativeDay, cn } from "../lib/utils";

// FCA publications tracker — a filtered lens over the one store: published
// items carrying a `publication` from the FCA (consultation / discussion
// papers, policy statements, etc.). They also surface in Signals as
// regulatory items; this is the focused, paper-type-aware view.
export function FCA({ items }: { items: Item[] }) {
  const all = items
    .filter((i) => i.status === "published" && i.publication?.issuer === "FCA")
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  const kinds = ["all", ...Array.from(new Set(all.map((i) => i.publication!.kind)))];
  const [kind, setKind] = useState("all");
  const shown = kind === "all" ? all : all.filter((i) => i.publication!.kind === kind);

  const byKind = countBy(all, (i) => i.publication?.kind);
  const latest = all[0];

  return (
    <div className="space-y-4">
      <PageHeader
        Icon={Landmark}
        title="FCA"
        subtitle="FCA publications across crypto and financial crime — consultation & discussion papers, policy statements and more."
        right={
          <div className="flex items-center gap-3">
            <span className="text-xs text-neutral-500 tabular-nums">
              {shown.length} item{shown.length === 1 ? "" : "s"}
            </span>
            <ExportMenu items={shown} docTitle="Sentinel — FCA publications" filenameBase="sentinel-fca" />
          </div>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat Icon={Landmark} tone="brand" label="Publications" value={all.length} />
        <Stat Icon={FileText} tone="neutral" label="Paper types" value={byKind.length} />
        <Stat Icon={ShieldAlert} tone="rose" label="High impact" value={all.filter((i) => i.impact === "high").length} />
        <Stat Icon={CalendarClock} tone="neutral" label="Latest" value={latest ? relativeDay(latest.date) : "—"} />
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <Panel className="p-4">
          <SectionHeading Icon={ShieldAlert} title="Risk mix" />
          <ImpactMix items={all} />
        </Panel>
        <Panel className="p-4">
          <SectionHeading Icon={FileText} title="By paper type" />
          <MiniBars data={byKind} />
        </Panel>
      </div>

      {kinds.length > 2 && (
        <div className="flex items-center flex-wrap gap-1.5">
          {kinds.map((k) => (
            <button
              key={k}
              onClick={() => setKind(k)}
              className={cn(
                "rounded-md px-2.5 py-1 text-[11px] font-medium ring-1 transition-colors",
                kind === k
                  ? "bg-violet-500/15 text-violet-200 ring-violet-500/30"
                  : "bg-neutral-900 text-neutral-400 ring-neutral-800 hover:text-neutral-200 hover:bg-neutral-800",
              )}
            >
              {k === "all" ? "All types" : k}
            </button>
          ))}
        </div>
      )}

      {shown.length > 0 ? (
        <DataTable items={shown} variant="fca" />
      ) : (
        <p className="text-sm text-neutral-500">No FCA publications in this view yet.</p>
      )}
    </div>
  );
}
