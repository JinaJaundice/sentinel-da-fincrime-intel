import { ExternalLink } from "lucide-react";
import type { Item, SolutionStance } from "../content/types";
import { STANCE_META } from "../content/taxonomy";
import { Panel, Tag } from "../lib/ui";

// Build-or-buy ordering: what we already lean on first, the watch list last.
const STANCE_ORDER: Record<SolutionStance, number> = {
  "in-use": 0,
  shortlist: 1,
  evaluate: 2,
  watch: 3,
};

// The same vendor items as the list, grouped by category and led by our
// stance, which is the fact the build-or-buy call turns on.
export function VendorMatrix({ items }: { items: Item[] }) {
  const vendors = items.filter((i) => i.solution);
  const categories = Array.from(new Set(vendors.map((i) => i.solution!.category))).sort();

  if (vendors.length === 0) {
    return <p className="text-small text-ink-faint">No vendors in this view yet.</p>;
  }

  return (
    <Panel className="overflow-hidden">
      <div className="hidden sm:flex items-center gap-3 px-4 py-1.5 label border-b border-rule">
        <span className="flex-1">Vendor</span>
        <span className="w-24 shrink-0">Stance</span>
        <span className="w-20 shrink-0">Region</span>
        <span className="flex-[1.4] hidden md:block">What it does</span>
        <span className="w-8 shrink-0 text-right">Source</span>
      </div>

      {categories.map((cat) => {
        const group = vendors.filter((i) => i.solution!.category === cat).sort((a, b) => STANCE_ORDER[a.solution!.stance] - STANCE_ORDER[b.solution!.stance]);
        return (
          <div key={cat}>
            <div className="px-4 py-1.5 bg-sunken text-tiny font-semibold text-ink border-t border-rule">
              {cat} <span className="text-ink-faint num font-normal">· {group.length}</span>
            </div>
            {group.map((item) => {
              const s = item.solution!;
              const src = item.sources[0];
              return (
                <div key={item.id} className="flex items-start gap-3 px-4 py-2.5 border-t border-rule hover:bg-sunken transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="text-small text-ink font-medium truncate">{s.vendor}</div>
                    <div className="text-tiny text-ink-faint truncate">{item.title}</div>
                    <div className="sm:hidden mt-1.5 flex items-center flex-wrap gap-2 text-micro">
                      <Tag className={STANCE_META[s.stance].chip}>{STANCE_META[s.stance].label}</Tag>
                      {item.region && <span className="text-ink-faint">{item.region}</span>}
                    </div>
                    <div className="md:hidden mt-1 text-tiny text-ink-soft leading-snug">{s.note ?? firstSentence(item.summary)}</div>
                  </div>
                  <span className="w-24 shrink-0 hidden sm:block">
                    <Tag className={STANCE_META[s.stance].chip}>{STANCE_META[s.stance].label}</Tag>
                  </span>
                  <span className="w-20 shrink-0 hidden sm:block text-tiny text-ink-soft">{item.region ?? ""}</span>
                  <span className="flex-[1.4] hidden md:block min-w-0 text-tiny text-ink-soft leading-snug">{s.note ?? firstSentence(item.summary)}</span>
                  <span className="w-8 shrink-0 hidden sm:flex justify-end pt-0.5">
                    {src?.url ? (
                      <a href={src.url} target="_blank" rel="noreferrer" aria-label={`Source: ${src.name}`} className="text-ink-faint hover:text-signal transition-colors">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    ) : (
                      <span className="text-ink-faint">none</span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        );
      })}
    </Panel>
  );
}

function firstSentence(s: string): string {
  const out = s.split(/(?<=[.;])\s/)[0];
  return out.length > 120 ? out.slice(0, 120) + "…" : out;
}
