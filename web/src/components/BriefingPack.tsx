import { useEffect, useState } from "react";
import {
  Layers,
  Check,
  Plus,
  X,
  ArrowUp,
  ArrowDown,
  Trash2,
  ClipboardCopy,
  FileText,
  FileSpreadsheet,
  type LucideIcon,
} from "lucide-react";
import type { Item } from "../content/types";
import { TYPE_META } from "../content/taxonomy";
import { usePack, togglePack, removeFromPack, movePack, clearPack } from "../lib/pack";
import { itemsToMarkdown, itemsToCsv, copyText, downloadText, slugify } from "../lib/export";
import { longDate, cn } from "../lib/utils";

// Per-item toggle — adds/removes the item from the briefing pack. Sits in
// the ItemDetail action row next to Citation / Deck bullet.
export function PackToggle({ id }: { id: string }) {
  const ids = usePack();
  const inPack = ids.includes(id);
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        togglePack(id);
      }}
      aria-pressed={inPack}
      className={cn(
        "inline-flex items-center gap-1 text-[10px] transition-colors",
        inPack ? "text-violet-300" : "text-neutral-500 hover:text-violet-300",
      )}
    >
      {inPack ? <Check className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
      {inPack ? "In pack" : "Add to pack"}
    </button>
  );
}

// Floating briefing-pack builder. Renders nothing until the pack has an
// item (zero footprint), then a corner pill that opens into a panel for
// reordering and exporting a curated one-pager.
export function BriefingPackDrawer({ items }: { items: Item[] }) {
  const ids = usePack();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [title, setTitle] = useState(`Sentinel briefing — ${longDate(today())}`);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Resolve ids → items in pack order (drop any that no longer exist).
  const packed = ids.map((id) => items.find((i) => i.id === id)).filter(Boolean) as Item[];
  if (packed.length === 0) return null;

  const base = `${slugify(title) || "sentinel-briefing"}-${today()}`;
  const flash = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  const copyMd = async () => {
    if (await copyText(itemsToMarkdown(packed, title, { grouped: false }))) flash();
  };
  const dlMd = () => downloadText(`${base}.md`, itemsToMarkdown(packed, title, { grouped: false }), "text/markdown");
  const dlCsv = () => downloadText(`${base}.csv`, itemsToCsv(packed), "text/csv");

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-40 inline-flex items-center gap-2 rounded-full surface surface-hover px-4 py-2.5 text-[13px] text-neutral-100 shadow-lg"
      >
        <Layers className="h-4 w-4 text-violet-300" strokeWidth={1.75} />
        Briefing pack
        <span className="grid place-items-center min-w-5 h-5 px-1.5 rounded-full bg-violet-500/20 text-violet-200 ring-1 ring-violet-500/30 text-[11px] font-semibold tabular-nums">
          {packed.length}
        </span>
      </button>
    );
  }

  return (
    <div
      role="dialog"
      aria-label="Briefing pack"
      className="fixed bottom-4 right-4 left-4 sm:left-auto sm:w-[380px] z-40 rounded-2xl surface rise flex flex-col max-h-[78vh]"
    >
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
        <Layers className="h-4 w-4 text-violet-300 shrink-0" strokeWidth={1.75} />
        <span className="text-[13px] font-medium text-neutral-100">Briefing pack</span>
        <span className="text-[11px] text-neutral-500 tabular-nums">{packed.length}</span>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close briefing pack"
          className="ml-auto grid place-items-center w-7 h-7 rounded-lg text-neutral-500 hover:text-neutral-200 hover:bg-neutral-800 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="px-4 pt-3 pb-2">
        <label className="text-[10px] uppercase tracking-[0.12em] text-neutral-500 font-medium">Pack title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 w-full bg-neutral-900/60 rounded-lg ring-1 ring-neutral-800 px-2.5 py-1.5 text-[12px] text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:ring-violet-500/40"
          placeholder="Briefing title"
        />
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-1 min-h-0">
        {packed.map((item, idx) => (
          <div key={item.id} className="group flex items-start gap-2 rounded-lg px-2 py-2 hover:bg-neutral-800/40">
            <div className="flex flex-col -my-0.5 shrink-0">
              <button
                type="button"
                onClick={() => movePack(item.id, -1)}
                disabled={idx === 0}
                aria-label="Move up"
                className="text-neutral-600 hover:text-neutral-300 disabled:opacity-30 disabled:hover:text-neutral-600"
              >
                <ArrowUp className="h-3 w-3" />
              </button>
              <button
                type="button"
                onClick={() => movePack(item.id, 1)}
                disabled={idx === packed.length - 1}
                aria-label="Move down"
                className="text-neutral-600 hover:text-neutral-300 disabled:opacity-30 disabled:hover:text-neutral-600"
              >
                <ArrowDown className="h-3 w-3" />
              </button>
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[12px] text-neutral-200 leading-snug line-clamp-2">{item.title}</div>
              <div className="text-[10px] text-neutral-500 mt-0.5">
                {TYPE_META[item.type].label}
                {item.region ? ` · ${item.region}` : ""}
              </div>
            </div>
            <button
              type="button"
              onClick={() => removeFromPack(item.id)}
              aria-label="Remove from pack"
              className="shrink-0 text-neutral-600 hover:text-rose-300 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>

      <div className="border-t border-white/[0.06] p-2">
        <div className="grid grid-cols-3 gap-1.5">
          <PackAction Icon={copied ? Check : ClipboardCopy} label={copied ? "Copied" : "Copy"} onClick={copyMd} accent={copied} />
          <PackAction Icon={FileText} label=".md" onClick={dlMd} />
          <PackAction Icon={FileSpreadsheet} label=".csv" onClick={dlCsv} />
        </div>
        <button
          type="button"
          onClick={clearPack}
          className="mt-1.5 w-full inline-flex items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-[11px] text-neutral-500 hover:text-rose-300 hover:bg-neutral-800/60 transition-colors"
        >
          <Trash2 className="h-3 w-3" /> Clear pack
        </button>
      </div>
    </div>
  );
}

function PackAction({
  Icon,
  label,
  onClick,
  accent,
}: {
  Icon: LucideIcon;
  label: string;
  onClick: () => void;
  accent?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-[11px] font-medium ring-1 transition-colors",
        accent
          ? "bg-violet-500/15 text-violet-200 ring-violet-500/30"
          : "bg-neutral-900 text-neutral-300 ring-neutral-800 hover:text-neutral-100 hover:bg-neutral-800",
      )}
    >
      <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
      {label}
    </button>
  );
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}
