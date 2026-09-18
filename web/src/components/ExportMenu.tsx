import { useEffect, useRef, useState } from "react";
import { Download, FileText, FileSpreadsheet, ClipboardCopy, Check, ChevronDown, type LucideIcon } from "lucide-react";
import type { Item } from "../content/types";
import { itemsToMarkdown, itemsToCsv, copyText, downloadText, slugify } from "../lib/export";
import { cn } from "../lib/utils";

// Export the items a page is showing: copy as Markdown, or download a
// Markdown or CSV file. Lives in the page header and exports exactly the
// items in scope, so filters carry through.
export function ExportMenu({
  items,
  docTitle,
  filenameBase,
  intro,
}: {
  items: Item[];
  docTitle: string;
  filenameBase: string;
  /** Optional lead paragraph for the Markdown export (a topic primer). */
  intro?: string;
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const base = `${slugify(filenameBase)}-${new Date().toISOString().slice(0, 10)}`;
  const disabled = items.length === 0;

  const flash = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  const copyMd = async () => {
    if (await copyText(itemsToMarkdown(items, docTitle, { intro }))) flash();
    setOpen(false);
  };
  const dlMd = () => {
    downloadText(`${base}.md`, itemsToMarkdown(items, docTitle, { intro }), "text/markdown");
    setOpen(false);
  };
  const dlCsv = () => {
    downloadText(`${base}.csv`, itemsToCsv(items), "text/csv");
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button type="button" disabled={disabled} onClick={() => setOpen((o) => !o)} aria-haspopup="menu" aria-expanded={open} className="btn">
        {copied ? <Check className="h-3.5 w-3.5 text-signal" /> : <Download className="h-3.5 w-3.5" />}
        {copied ? "Copied" : "Export"}
        <ChevronDown className={cn("h-3 w-3 text-ink-faint transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div role="menu" className="absolute right-0 z-30 mt-1 w-60 panel p-1 rise">
          <MenuRow Icon={ClipboardCopy} label="Copy as Markdown" hint={`${items.length} items`} onClick={copyMd} />
          <MenuRow Icon={FileText} label="Download Markdown" hint=".md" onClick={dlMd} />
          <MenuRow Icon={FileSpreadsheet} label="Download CSV" hint=".csv" onClick={dlCsv} />
        </div>
      )}
    </div>
  );
}

function MenuRow({ Icon, label, hint, onClick }: { Icon: LucideIcon; label: string; hint?: string; onClick: () => void }) {
  return (
    <button type="button" role="menuitem" onClick={onClick} className="w-full flex items-center gap-2.5 rounded-sm px-2.5 py-2 text-left text-small text-ink-soft hover:bg-sunken hover:text-ink transition-colors">
      <Icon className="h-3.5 w-3.5 text-ink-faint shrink-0" strokeWidth={1.75} />
      <span className="flex-1">{label}</span>
      {hint && <span className="text-micro text-ink-faint num">{hint}</span>}
    </button>
  );
}
