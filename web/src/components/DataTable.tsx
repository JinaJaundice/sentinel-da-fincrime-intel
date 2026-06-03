import { useState, type ReactNode } from "react";
import { ChevronDown, MapPin } from "lucide-react";
import type { Item } from "../content/types";
import { TYPE_META, STANCE_META } from "../content/taxonomy";
import { IMPACT_TONE } from "../lib/uiTokens";
import { Panel } from "../lib/ui";
import { ItemDetail } from "./ItemDetail";
import { relativeDay, cn } from "../lib/utils";

type Variant = "signal" | "venture" | "solution";
type Col = { label: string; width: string; render: (i: Item) => ReactNode };

function impactCell(i: Item) {
  if (!i.impact) return <span className="text-neutral-600">—</span>;
  return (
    <span className={cn("rounded px-1.5 py-0.5 text-[10px] font-medium", IMPACT_TONE[i.impact].chip)}>
      {IMPACT_TONE[i.impact].label}
    </span>
  );
}

const dateCell = (i: Item) => <span className="text-neutral-500 tabular-nums">{relativeDay(i.date)}</span>;

const COLS: Record<Variant, Col[]> = {
  signal: [
    { label: "Kind", width: "w-24", render: (i) => <span className="text-neutral-400">{TYPE_META[i.type].label}</span> },
    { label: "Impact", width: "w-20", render: impactCell },
    { label: "Date", width: "w-16", render: dateCell },
  ],
  venture: [
    { label: "Round", width: "w-28", render: (i) => <span className="text-neutral-400">{i.venture?.round ?? "—"}</span> },
    { label: "Amount", width: "w-24", render: (i) => <span className="text-neutral-200 font-medium">{i.venture?.amount ?? "—"}</span> },
    { label: "Date", width: "w-16", render: dateCell },
  ],
  solution: [
    { label: "Category", width: "w-40", render: (i) => <span className="text-neutral-400">{i.solution?.category ?? "—"}</span> },
    {
      label: "Stance",
      width: "w-24",
      render: (i) =>
        i.solution ? (
          <span className={cn("rounded px-1.5 py-0.5 text-[10px] font-medium", STANCE_META[i.solution.stance].chip)}>
            {STANCE_META[i.solution.stance].label}
          </span>
        ) : null,
    },
    { label: "Date", width: "w-16", render: dateCell },
  ],
};

// Dense, DefiLlama-style table. Each row expands in place to reveal the
// full summary, "So what", and sources.
export function DataTable({ items, variant }: { items: Item[]; variant: Variant }) {
  const cols = COLS[variant];
  const [open, setOpen] = useState<Set<string>>(() => new Set());
  const toggle = (id: string) =>
    setOpen((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  return (
    <Panel className="overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-2 text-[10px] uppercase tracking-wide text-neutral-600 border-b border-neutral-800">
        <span className="w-4 shrink-0" aria-hidden />
        <span className="flex-1">Name</span>
        {cols.map((c) => (
          <span key={c.label} className={cn(c.width, "text-right hidden sm:block")}>
            {c.label}
          </span>
        ))}
        <span className="w-4 shrink-0" aria-hidden />
      </div>

      {items.map((item) => {
        const isOpen = open.has(item.id);
        const Icon = TYPE_META[item.type].Icon;
        return (
          <div key={item.id} className="border-b border-neutral-800 last:border-0">
            <button
              onClick={() => toggle(item.id)}
              aria-expanded={isOpen}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-neutral-800/30 transition-colors"
            >
              <Icon className="h-4 w-4 text-neutral-500 shrink-0" strokeWidth={2} />
              <div className="min-w-0 flex-1">
                <div className="text-[13px] text-neutral-100 truncate">{item.title}</div>
                <div className="text-[10px] text-neutral-500 flex items-center gap-1 mt-0.5">
                  {item.region && (
                    <>
                      <MapPin className="h-2.5 w-2.5" />
                      {item.region}
                      <span className="text-neutral-700">·</span>
                    </>
                  )}
                  <span className="sm:hidden tabular-nums">{relativeDay(item.date)}</span>
                  <span className="hidden sm:inline text-neutral-600 truncate">{shortTeaser(item)}</span>
                </div>
              </div>
              {cols.map((c) => (
                <span key={c.label} className={cn(c.width, "text-right text-[11px] hidden sm:block shrink-0")}>
                  {c.render(item)}
                </span>
              ))}
              <ChevronDown
                className={cn("h-4 w-4 text-neutral-600 shrink-0 transition-transform", isOpen && "rotate-180")}
              />
            </button>
            {isOpen && (
              <div className="px-4 pb-4 pt-1 expand bg-neutral-900/40">
                <div className="sm:pl-7">
                  <ItemDetail item={item} header={false} />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </Panel>
  );
}

function shortTeaser(i: Item) {
  const s = i.summary.split(/[.;:]/)[0];
  return s.length > 90 ? s.slice(0, 90) + "…" : s;
}
