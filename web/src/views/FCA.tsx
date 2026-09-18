import { useState } from "react";
import type { Item } from "../content/types";
import { PageHeader } from "../components/PageHeader";
import { DataTable } from "../components/DataTable";
import { ExportMenu } from "../components/ExportMenu";
import { Chip, FigureStrip } from "../lib/ui";
import { countBy } from "../lib/insights";
import { relativeDay, longDate } from "../lib/utils";

// FCA papers: the items that carry a publication from the FCA (consultation
// papers, discussion papers, policy statements and the rest). They also
// appear under News and regulation; this is the paper-type view.
export function FCA({ items }: { items: Item[] }) {
  const all = items.filter((i) => i.status === "published" && i.publication?.issuer === "FCA").sort((a, b) => (a.date < b.date ? 1 : -1));

  const byKind = countBy(all, (i) => i.publication?.kind);
  const [kind, setKind] = useState("all");
  const shown = kind === "all" ? all : all.filter((i) => i.publication!.kind === kind);
  const latest = all[0];

  return (
    <div className="space-y-4">
      <PageHeader
        title="FCA papers"
        lede="What the Financial Conduct Authority has published on crypto and financial crime: consultation and discussion papers, policy statements, guidance and speeches, newest first."
        right={
          <>
            <span className="text-tiny text-ink-faint num">{shown.length === all.length ? `${all.length} papers` : `${shown.length} of ${all.length} papers`}</span>
            <ExportMenu items={shown} docTitle="Sentinel: FCA papers" filenameBase="sentinel-fca-papers" />
          </>
        }
      />

      <FigureStrip
        figures={[
          { label: "Papers", value: all.length },
          { label: "Paper types", value: byKind.length },
          { label: "High impact", value: all.filter((i) => i.impact === "high").length, tone: "high" },
          { label: "Latest paper", value: latest ? relativeDay(latest.date) : "none", hint: latest ? longDate(latest.date) : undefined },
        ]}
      />

      {byKind.length > 1 && (
        <div className="flex items-center flex-wrap gap-1.5" role="group" aria-label="Filter by paper type">
          <span className="label mr-1">Paper type</span>
          <Chip on={kind === "all"} onClick={() => setKind("all")} count={all.length}>
            All
          </Chip>
          {byKind.map((k) => (
            <Chip key={k.label} on={kind === k.label} onClick={() => setKind(kind === k.label ? "all" : k.label)} count={k.n}>
              {k.label}
            </Chip>
          ))}
        </div>
      )}

      {shown.length > 0 ? <DataTable items={shown} variant="fca" /> : <p className="text-small text-ink-faint">No FCA papers in this view yet.</p>}
    </div>
  );
}
