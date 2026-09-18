import type { Item } from "../content/types";
import { FigureStrip } from "../lib/ui";
import { DataTable } from "../components/DataTable";
import { Term } from "../components/Term";
import { TYPOLOGY_PRIMERS } from "../content/primers";
import { PageHeader } from "../components/PageHeader";
import { withinDays } from "../lib/utils";

// Crime patterns: how the money moves, which controls catch it, and which
// obligations it touches. Open a pattern for its detail and, where one is
// written, a plain-language primer on how it works.
export function Intelligence({ items }: { items: Item[] }) {
  const patterns = items.filter((i) => i.status === "published" && i.type === "typology");
  const withPrimer = patterns.filter((i) => TYPOLOGY_PRIMERS[i.id]).length;

  return (
    <div className="space-y-5">
      <PageHeader title="Crime patterns" lede="How criminals move value through digital assets, mapped to the controls that catch each pattern and the obligations it touches. Open a pattern for the detail and, where one is written, a primer on how it works." />

      <FigureStrip
        figures={[
          { label: "Patterns", value: patterns.length },
          { label: "High impact", value: patterns.filter((i) => i.impact === "high").length, tone: "high" },
          { label: "New this week", value: patterns.filter((i) => withinDays(i.addedAt, 7)).length, tone: "signal" },
          { label: "With a primer", value: withPrimer },
        ]}
      />

      <DataTable items={patterns} variant="typology" renderExtra={(i) => <Primer id={i.id} />} />
    </div>
  );
}

function Primer({ id }: { id: string }) {
  const primer = TYPOLOGY_PRIMERS[id];
  if (!primer) return null;
  return (
    <div className="mt-3 border-t border-rule pt-3">
      <div className="label">How it works</div>
      <p className="serif text-ink-soft mt-1">{primer.how}</p>
      {primer.terms && primer.terms.length > 0 && (
        <div className="mt-2.5 flex items-center flex-wrap gap-x-3 gap-y-1.5">
          <span className="label">Terms</span>
          {primer.terms.map((t) => (
            <Term key={t} id={t} className="text-tiny text-ink-soft" />
          ))}
        </div>
      )}
    </div>
  );
}
