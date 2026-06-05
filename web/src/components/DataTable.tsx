import { useState, type ReactNode } from "react";
import { ChevronDown, MapPin, Search, ArrowUp, ArrowDown } from "lucide-react";
import type { Item } from "../content/types";
import { TYPE_META, STANCE_META } from "../content/taxonomy";
import { IMPACT_TONE } from "../lib/uiTokens";
import { Panel } from "../lib/ui";
import { ItemDetail } from "./ItemDetail";
import { relativeDay, cn } from "../lib/utils";

type Variant = "signal" | "venture" | "solution";
type Col = { label: string; width: string; render: (i: Item) => ReactNode; sortValue?: (i: Item) => string | number };

const impactRank = (i: Item) => (i.impact === "high" ? 3 : i.impact === "medium" ? 2 : i.impact === "low" ? 1 : 0);

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
    { label: "Kind", width: "w-24", render: (i) => <span className="text-neutral-400">{TYPE_META[i.type].label}</span>, sortValue: (i) => TYPE_META[i.type].label },
    { label: "Impact", width: "w-20", render: impactCell, sortValue: impactRank },
    { label: "Date", width: "w-16", render: dateCell, sortValue: (i) => i.date },
  ],
  venture: [
    { label: "Round", width: "w-28", render: (i) => <span className="text-neutral-400">{i.venture?.round ?? "—"}</span> },
    { label: "Amount", width: "w-24", render: (i) => <span className="text-neutral-200 font-medium">{i.venture?.amount ?? "—"}</span> },
    { label: "Date", width: "w-16", render: dateCell, sortValue: (i) => i.date },
  ],
  solution: [
    { label: "Category", width: "w-40", render: (i) => <span className="text-neutral-400">{i.solution?.category ?? "—"}</span>, sortValue: (i) => i.solution?.category ?? "" },
    {
      label: "Stance",
      width: "w-24",
      render: (i) =>
        i.solution ? (
          <span className={cn("rounded px-1.5 py-0.5 text-[10px] font-medium", STANCE_META[i.solution.stance].chip)}>
            {STANCE_META[i.solution.stance].label}
          </span>
        ) : null,
      sortValue: (i) => i.solution?.stance ?? "",
    },
    { label: "Date", width: "w-16", render: dateCell, sortValue: (i) => i.date },
  ],
};

// Dense, DefiLlama-style table with search + sortable columns. Each row
// expands in place to reveal the full summary, "So what", and sources.
export function DataTable({ items, variant }: { items: Item[]; variant: Variant }) {
  const cols = COLS[variant];
  const [open, setOpen] = useState<Set<string>>(() => new Set());
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<{ key: string; dir: "asc" | "desc" }>({ key: "Date", dir: "desc" });

  const toggle = (id: string) =>
    setOpen((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  const valueFor = (i: Item, key: string): string | number => {
    if (key === "Name") return i.title.toLowerCase();
    const c = cols.find((col) => col.label === key);
    return c?.sortValue ? c.sortValue(i) : "";
  };
  const toggleSort = (key: string) =>
    setSort((s) => (s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: key === "Name" ? "asc" : "desc" }));

  const q = query.trim().toLowerCase();
  const filtered = q
    ? items.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.summary.toLowerCase().includes(q) ||
          i.tags.some((t) => t.toLowerCase().includes(q)),
      )
    : items;
  const rows = [...filtered].sort((a, b) => {
    const va = valueFor(a, sort.key);
    const vb = valueFor(b, sort.key);
    const c = va < vb ? -1 : va > vb ? 1 : 0;
    return sort.dir === "asc" ? c : -c;
  });

  const SortArrow = ({ active }: { active: boolean }) =>
    active ? (sort.dir === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : null;

  return (
    <Panel className="overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-neutral-800">
        <Search className="h-3.5 w-3.5 text-neutral-500 shrink-0" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search title, summary, tags…"
          className="flex-1 bg-transparent text-[13px] text-neutral-200 placeholder:text-neutral-600 focus:outline-none"
        />
        <span className="text-[10px] text-neutral-600 tabular-nums shrink-0">
          {rows.length}/{items.length}
        </span>
      </div>

      <div className="flex items-center gap-3 px-4 py-2 text-[10px] uppercase tracking-wide text-neutral-600 border-b border-neutral-800">
        <span className="w-4 shrink-0" aria-hidden />
        <button
          onClick={() => toggleSort("Name")}
          className="flex-1 flex items-center gap-1 text-left hover:text-neutral-300 transition-colors"
        >
          Name <SortArrow active={sort.key === "Name"} />
        </button>
        {cols.map((c) =>
          c.sortValue ? (
            <button
              key={c.label}
              onClick={() => toggleSort(c.label)}
              className={cn(c.width, "hidden sm:flex items-center justify-end gap-1 hover:text-neutral-300 transition-colors")}
            >
              {c.label} <SortArrow active={sort.key === c.label} />
            </button>
          ) : (
            <span key={c.label} className={cn(c.width, "text-right hidden sm:block")}>
              {c.label}
            </span>
          ),
        )}
        <span className="w-4 shrink-0" aria-hidden />
      </div>

      {rows.length === 0 ? (
        <div className="px-4 py-6 text-center text-xs text-neutral-500">No matches.</div>
      ) : (
        rows.map((item) => {
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
                <ChevronDown className={cn("h-4 w-4 text-neutral-600 shrink-0 transition-transform", isOpen && "rotate-180")} />
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
        })
      )}
    </Panel>
  );
}

function shortTeaser(i: Item) {
  const s = i.summary.split(/[.;:]/)[0];
  return s.length > 90 ? s.slice(0, 90) + "…" : s;
}
