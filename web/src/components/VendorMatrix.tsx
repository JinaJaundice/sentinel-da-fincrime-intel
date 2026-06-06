import { ExternalLink } from "lucide-react";
import type { Item, SolutionStance } from "../content/types";
import { STANCE_META } from "../content/taxonomy";
import { Panel } from "../lib/ui";
import { cn } from "../lib/utils";

// Build-vs-buy ordering: what we already lean on first, watchlist last.
const STANCE_ORDER: Record<SolutionStance, number> = {
  "in-use": 0,
  shortlist: 1,
  evaluate: 2,
  watch: 3,
};

// Side-by-side vendor comparison for the Solutions tab — the same solution
// Items as the table, pivoted into a category-grouped grid that leads with
// our stance (the decision-relevant attribute for build-vs-buy).
export function VendorMatrix({ items }: { items: Item[] }) {
  const vendors = items.filter((i) => i.solution);
  const categories = Array.from(new Set(vendors.map((i) => i.solution!.category))).sort();

  if (vendors.length === 0) {
    return <p className="text-sm text-neutral-500">No vendors in this view yet.</p>;
  }

  return (
    <Panel className="overflow-hidden">
      <div className="hidden sm:flex items-center gap-3 px-4 py-2 text-[10px] uppercase tracking-wide text-neutral-600 border-b border-neutral-800">
        <span className="flex-1">Vendor</span>
        <span className="w-24 shrink-0">Stance</span>
        <span className="w-20 shrink-0">Region</span>
        <span className="flex-[1.4] hidden md:block">Positioning</span>
        <span className="w-8 shrink-0 text-right">Src</span>
      </div>

      {categories.map((cat) => {
        const group = vendors
          .filter((i) => i.solution!.category === cat)
          .sort((a, b) => STANCE_ORDER[a.solution!.stance] - STANCE_ORDER[b.solution!.stance]);
        return (
          <div key={cat}>
            <div className="px-4 py-1.5 bg-neutral-900/50 text-[11px] font-medium text-neutral-300 border-b border-neutral-800">
              {cat} <span className="text-neutral-600 tabular-nums">· {group.length}</span>
            </div>
            {group.map((item) => {
              const s = item.solution!;
              const src = item.sources[0];
              return (
                <div
                  key={item.id}
                  className="flex items-start gap-3 px-4 py-2.5 border-b border-neutral-800 last:border-0 hover:bg-neutral-800/20 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] text-neutral-100 font-medium truncate">{s.vendor}</div>
                    <div className="text-[11px] text-neutral-500 truncate">{item.title}</div>
                    <div className="sm:hidden mt-1.5 flex items-center flex-wrap gap-2 text-[10px]">
                      <StanceChip stance={s.stance} />
                      {item.region && <span className="text-neutral-500">{item.region}</span>}
                    </div>
                    <div className="md:hidden mt-1 text-[11px] text-neutral-400 leading-snug">{s.note ?? firstSentence(item.summary)}</div>
                  </div>
                  <span className="w-24 shrink-0 hidden sm:block">
                    <StanceChip stance={s.stance} />
                  </span>
                  <span className="w-20 shrink-0 hidden sm:block text-[11px] text-neutral-400">{item.region ?? "—"}</span>
                  <span className="flex-[1.4] hidden md:block min-w-0 text-[11px] text-neutral-400 leading-snug">
                    {s.note ?? firstSentence(item.summary)}
                  </span>
                  <span className="w-8 shrink-0 hidden sm:flex justify-end pt-0.5">
                    {src?.url ? (
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Source: ${src.name}`}
                        className="text-neutral-500 hover:text-violet-300 transition-colors"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    ) : (
                      <span className="text-neutral-700">—</span>
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

function StanceChip({ stance }: { stance: SolutionStance }) {
  return (
    <span className={cn("rounded px-1.5 py-0.5 text-[10px] font-medium", STANCE_META[stance].chip)}>
      {STANCE_META[stance].label}
    </span>
  );
}

function firstSentence(s: string): string {
  const out = s.split(/(?<=[.;])\s/)[0];
  return out.length > 120 ? out.slice(0, 120) + "…" : out;
}
