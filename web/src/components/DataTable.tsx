import { useState, type ReactNode } from "react";
import { ChevronDown, MapPin, Search, ArrowUp, ArrowDown, ShieldCheck } from "lucide-react";
import type { Item } from "../content/types";
import { TYPE_META, STANCE_META } from "../content/taxonomy";
import { IMPACT_TONE } from "../lib/uiTokens";
import { Panel, ShowMore, Tag } from "../lib/ui";
import { ItemDetail } from "./ItemDetail";
import { relativeDay, longDate, cn } from "../lib/utils";

export type Variant = "signal" | "venture" | "solution" | "fca" | "typology";
type Col = { label: string; width: string; render: (i: Item) => ReactNode; sortValue?: (i: Item) => string | number };

const PAGE = 30;

const impactRank = (i: Item) => (i.impact === "high" ? 3 : i.impact === "medium" ? 2 : i.impact === "low" ? 1 : 0);

function impactCell(i: Item) {
  if (!i.impact) return <span className="text-ink-faint">none</span>;
  return <Tag tone={IMPACT_TONE[i.impact].tone}>{IMPACT_TONE[i.impact].label}</Tag>;
}

const dateCell = (i: Item) => (
  <span className="text-ink-faint num" title={longDate(i.date)}>
    {relativeDay(i.date)}
  </span>
);

const COLS: Record<Variant, Col[]> = {
  signal: [
    { label: "Kind", width: "w-24", render: (i) => <span className="text-ink-soft">{TYPE_META[i.type].label}</span>, sortValue: (i) => TYPE_META[i.type].label },
    { label: "Impact", width: "w-20", render: impactCell, sortValue: impactRank },
    { label: "Date", width: "w-16", render: dateCell, sortValue: (i) => i.date },
  ],
  venture: [
    { label: "Round", width: "w-28", render: (i) => <span className="text-ink-soft">{i.venture?.round ?? "unknown"}</span> },
    { label: "Amount", width: "w-24", render: (i) => <span className="text-ink font-semibold num">{i.venture?.amount ?? "undisclosed"}</span> },
    { label: "Date", width: "w-16", render: dateCell, sortValue: (i) => i.date },
  ],
  solution: [
    { label: "Category", width: "w-40", render: (i) => <span className="text-ink-soft">{i.solution?.category ?? ""}</span>, sortValue: (i) => i.solution?.category ?? "" },
    {
      label: "Stance",
      width: "w-24",
      render: (i) => (i.solution ? <Tag className={STANCE_META[i.solution.stance].chip}>{STANCE_META[i.solution.stance].label}</Tag> : null),
      sortValue: (i) => i.solution?.stance ?? "",
    },
    { label: "Date", width: "w-16", render: dateCell, sortValue: (i) => i.date },
  ],
  fca: [
    { label: "Paper", width: "w-36", render: (i) => <span className="text-ink-soft">{i.publication?.kind ?? ""}</span>, sortValue: (i) => i.publication?.kind ?? "" },
    { label: "Ref", width: "w-20", render: (i) => <span className="text-ink-faint num">{i.publication?.ref ?? ""}</span>, sortValue: (i) => i.publication?.ref ?? "" },
    { label: "Date", width: "w-16", render: dateCell, sortValue: (i) => i.date },
  ],
  typology: [
    { label: "Controls", width: "w-20", render: (i) => <span className="text-ink-soft num">{i.typology?.controls.length ?? 0}</span>, sortValue: (i) => i.typology?.controls.length ?? 0 },
    { label: "Impact", width: "w-20", render: impactCell, sortValue: impactRank },
    { label: "Date", width: "w-16", render: dateCell, sortValue: (i) => i.date },
  ],
};

// A ruled list with search and sortable heads. Each row opens in place to
// show the summary, the "So what" and the sources. Thirty rows show at a
// time; a long list grows by thirty on request, so a 170-row stream is not
// a 10,000-pixel page.
export function DataTable({
  items,
  variant,
  groupBy,
  initialSort = { key: "Date", dir: "desc" },
  renderExtra,
}: {
  items: Item[];
  variant: Variant;
  /** Optional: a heading above each run of rows that share this key (in sort order). */
  groupBy?: (i: Item) => string;
  initialSort?: { key: string; dir: "asc" | "desc" };
  /** Optional: more content under the item detail in an open row (a primer, say). */
  renderExtra?: (i: Item) => ReactNode;
}) {
  const cols = COLS[variant];
  const [open, setOpen] = useState<Set<string>>(() => new Set());
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState(initialSort);
  const [limit, setLimit] = useState(PAGE);

  const toggle = (id: string) =>
    setOpen((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  const valueFor = (i: Item, key: string): string | number => {
    if (key === "Name") return i.title.toLowerCase();
    if (key === "Added") return i.addedAt;
    const c = cols.find((col) => col.label === key);
    return c?.sortValue ? c.sortValue(i) : "";
  };
  const toggleSort = (key: string) => setSort((s) => (s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: key === "Name" ? "asc" : "desc" }));

  const q = query.trim().toLowerCase();
  const filtered = q
    ? items.filter((i) => i.title.toLowerCase().includes(q) || i.summary.toLowerCase().includes(q) || (i.region ?? "").toLowerCase().includes(q) || i.tags.some((t) => t.toLowerCase().includes(q)))
    : items;
  const rows = [...filtered].sort((a, b) => {
    const va = valueFor(a, sort.key);
    const vb = valueFor(b, sort.key);
    const c = va < vb ? -1 : va > vb ? 1 : 0;
    return sort.dir === "asc" ? c : -c;
  });
  const shown = rows.slice(0, limit);

  return (
    <Panel className="overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-rule bg-sunken">
        <Search className="h-3.5 w-3.5 text-ink-faint shrink-0" aria-hidden />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setLimit(PAGE);
          }}
          placeholder="Search titles, summaries, regions and tags"
          aria-label="Search this list"
          className="flex-1 bg-transparent text-small text-ink placeholder:text-ink-faint focus:outline-none min-w-0"
        />
        {q && (
          <span className="text-micro text-ink-faint num shrink-0">
            {rows.length} of {items.length} match
          </span>
        )}
      </div>

      <div className="flex items-center gap-3 px-4 py-1.5 label border-b border-rule">
        <span className="w-4 shrink-0" aria-hidden />
        <button onClick={() => toggleSort("Name")} className="flex-1 flex items-center gap-1 text-left hover:text-ink transition-colors label">
          Title <SortArrow active={sort.key === "Name"} dir={sort.dir} />
        </button>
        {cols.map((c) =>
          c.sortValue ? (
            <button key={c.label} onClick={() => toggleSort(c.label)} className={cn(c.width, "hidden sm:flex items-center justify-end gap-1 hover:text-ink transition-colors label")}>
              {c.label} <SortArrow active={sort.key === c.label} dir={sort.dir} />
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
        <div className="px-4 py-6 text-center text-small text-ink-faint">Nothing matches that search.</div>
      ) : (
        shown.map((item, idx) => {
          const isOpen = open.has(item.id);
          const Icon = TYPE_META[item.type].Icon;
          const group = groupBy ? groupBy(item) : undefined;
          const newGroup = group !== undefined && (idx === 0 || groupBy!(shown[idx - 1]) !== group);
          return (
            <div key={item.id}>
              {newGroup && <div className="px-4 py-1.5 label bg-sunken border-t border-rule">{group}</div>}
              <div className="border-t border-rule">
                <button onClick={() => toggle(item.id)} aria-expanded={isOpen} className={cn("w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-sunken", isOpen && "bg-sunken")}>
                  <Icon className="h-4 w-4 text-ink-faint shrink-0" strokeWidth={1.75} aria-hidden />
                  <div className="min-w-0 flex-1">
                    <div className="text-small text-ink font-medium leading-snug flex items-start gap-1.5">
                      {item.verified && <ShieldCheck className="h-3.5 w-3.5 text-signal shrink-0 mt-0.5" aria-label="Verified" />}
                      <span className="line-clamp-2">{item.title}</span>
                    </div>
                    <div className="text-micro text-ink-faint flex items-center gap-1 mt-0.5 min-w-0">
                      {item.region && (
                        <>
                          <MapPin className="h-2.5 w-2.5 shrink-0" aria-hidden />
                          <span className="shrink-0">{item.region}</span>
                          <span aria-hidden>·</span>
                        </>
                      )}
                      <span className="sm:hidden num shrink-0">{relativeDay(item.date)}</span>
                      {item.impact && <span className="sm:hidden shrink-0">· {IMPACT_TONE[item.impact].label} impact</span>}
                      <span className="hidden sm:inline truncate">{shortTeaser(item)}</span>
                    </div>
                  </div>
                  {cols.map((c) => (
                    <span key={c.label} className={cn(c.width, "text-right text-tiny hidden sm:block shrink-0")}>
                      {c.render(item)}
                    </span>
                  ))}
                  <ChevronDown className={cn("h-4 w-4 text-ink-faint shrink-0 transition-transform", isOpen && "rotate-180")} aria-hidden />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-2 rise border-t border-rule">
                    <div className="sm:pl-7">
                      <ItemDetail item={item} header={false} onTagClick={setQuery} />
                      {renderExtra?.(item)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })
      )}
      {rows.length > 0 && <ShowMore shown={shown.length} total={rows.length} step={PAGE} onMore={() => setLimit((l) => l + PAGE)} />}
    </Panel>
  );
}

function shortTeaser(i: Item) {
  const s = i.summary.split(/[.;:]/)[0];
  return s.length > 90 ? s.slice(0, 90) + "…" : s;
}

function SortArrow({ active, dir }: { active: boolean; dir: "asc" | "desc" }) {
  if (!active) return null;
  return dir === "asc" ? <ArrowUp className="h-3 w-3" aria-hidden /> : <ArrowDown className="h-3 w-3" aria-hidden />;
}
