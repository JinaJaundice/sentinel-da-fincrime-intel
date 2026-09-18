import { useEffect, useState } from "react";
import { Layers, Check, Plus, X, ArrowUp, ArrowDown, Trash2, ClipboardCopy, FileText, FileSpreadsheet, type LucideIcon } from "lucide-react";
import type { Item } from "../content/types";
import { TYPE_META } from "../content/taxonomy";
import { usePack, togglePack, removeFromPack, movePack, clearPack } from "../lib/pack";
import { itemsToMarkdown, itemsToCsv, copyText, downloadText, slugify } from "../lib/export";
import { longDate, cn } from "../lib/utils";

// Per-item toggle: adds or removes the item from the briefing pack.
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
      className={cn("btn btn-quiet text-tiny", inPack && "text-signal")}
    >
      {inPack ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
      {inPack ? "In the pack" : "Add to pack"}
    </button>
  );
}

// The briefing pack: nothing until the pack has an item, then a corner
// control that opens into a panel for ordering and exporting a one-pager.
export function BriefingPackDrawer({ items }: { items: Item[] }) {
  const ids = usePack();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [title, setTitle] = useState(`Sentinel briefing: ${longDate(today())}`);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

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
      <button type="button" onClick={() => setOpen(true)} className="fixed bottom-4 right-4 z-40 btn border-rule-strong py-2 px-3">
        <Layers className="h-4 w-4 text-signal" strokeWidth={1.75} aria-hidden />
        Briefing pack
        <span className="text-micro font-semibold num rounded-sm px-1.5 py-0.5 bg-signal text-on-signal">{packed.length}</span>
      </button>
    );
  }

  return (
    <div role="dialog" aria-label="Briefing pack" className="fixed bottom-4 right-4 left-4 sm:left-auto sm:w-[380px] z-40 panel border-rule-strong rise flex flex-col max-h-[78vh]">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-rule">
        <Layers className="h-4 w-4 text-signal shrink-0" strokeWidth={1.75} aria-hidden />
        <span className="text-small font-semibold text-ink">Briefing pack</span>
        <span className="text-tiny text-ink-faint num">{packed.length} items</span>
        <button type="button" onClick={() => setOpen(false)} aria-label="Close the briefing pack" className="ml-auto btn btn-quiet p-1">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="px-4 pt-3 pb-2">
        <label className="label" htmlFor="pack-title">
          Pack title
        </label>
        <input id="pack-title" value={title} onChange={(e) => setTitle(e.target.value)} className="field mt-1" placeholder="Briefing title" />
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-1 min-h-0">
        {packed.map((item, idx) => (
          <div key={item.id} className="flex items-start gap-2 rounded-sm px-2 py-2 hover:bg-sunken">
            <div className="flex flex-col -my-0.5 shrink-0">
              <button type="button" onClick={() => movePack(item.id, -1)} disabled={idx === 0} aria-label="Move up" className="text-ink-faint hover:text-ink disabled:opacity-30">
                <ArrowUp className="h-3 w-3" />
              </button>
              <button type="button" onClick={() => movePack(item.id, 1)} disabled={idx === packed.length - 1} aria-label="Move down" className="text-ink-faint hover:text-ink disabled:opacity-30">
                <ArrowDown className="h-3 w-3" />
              </button>
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-tiny text-ink leading-snug line-clamp-2">{item.title}</div>
              <div className="text-micro text-ink-faint mt-0.5">
                {TYPE_META[item.type].label}
                {item.region ? ` · ${item.region}` : ""}
              </div>
            </div>
            <button type="button" onClick={() => removeFromPack(item.id)} aria-label="Remove from the pack" className="shrink-0 text-ink-faint hover:text-high transition-colors">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>

      <div className="border-t border-rule p-2">
        <div className="grid grid-cols-3 gap-1.5">
          <PackAction Icon={copied ? Check : ClipboardCopy} label={copied ? "Copied" : "Copy"} onClick={copyMd} accent={copied} />
          <PackAction Icon={FileText} label="Markdown" onClick={dlMd} />
          <PackAction Icon={FileSpreadsheet} label="CSV" onClick={dlCsv} />
        </div>
        <button type="button" onClick={clearPack} className="mt-1.5 w-full btn btn-quiet text-tiny justify-center hover:text-high">
          <Trash2 className="h-3 w-3" /> Empty the pack
        </button>
      </div>
    </div>
  );
}

function PackAction({ Icon, label, onClick, accent }: { Icon: LucideIcon; label: string; onClick: () => void; accent?: boolean }) {
  return (
    <button type="button" onClick={onClick} className={cn("btn justify-center text-tiny", accent && "text-signal border-signal")}>
      <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
      {label}
    </button>
  );
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}
