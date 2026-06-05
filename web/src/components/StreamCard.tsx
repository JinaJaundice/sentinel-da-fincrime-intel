import { ArrowUpRight, type LucideIcon } from "lucide-react";

// A clickable summary tile for the Overview "command center" — one per
// stream: icon, name, count, the latest headline, and a meta line.
export function StreamCard({
  Icon,
  name,
  count,
  latest,
  meta,
  onClick,
}: {
  Icon: LucideIcon;
  name: string;
  count: number | string;
  latest?: string;
  meta?: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group text-left w-full rounded-2xl surface surface-hover p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/40"
    >
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-violet-300 shrink-0" strokeWidth={1.75} />
        <span className="text-sm font-medium text-neutral-100">{name}</span>
        <span className="ml-auto inline-flex items-center gap-1 text-neutral-500 group-hover:text-violet-200 transition-colors">
          <span className="tabular-nums text-xs font-medium">{count}</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </div>
      {latest && <div className="mt-2 text-[12px] text-neutral-400 truncate font-light">{latest}</div>}
      {meta && <div className="mt-1 text-[11px] text-neutral-500 font-light">{meta}</div>}
    </button>
  );
}
