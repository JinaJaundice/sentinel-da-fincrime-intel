import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import type { Item, ItemType } from "../content/types";
import { SectionHeading } from "../lib/ui";
import { DataTable } from "../components/DataTable";
import { cn } from "../lib/utils";

// Generic dense list — reused by Signals, Ventures and Solutions. Adding
// a future tab is another instance of this, never new plumbing.
export function Collection({
  items,
  types,
  title,
  blurb,
  Icon,
  variant,
}: {
  items: Item[];
  types: ItemType[];
  title: string;
  blurb: string;
  Icon: LucideIcon;
  variant: "signal" | "venture" | "solution";
}) {
  const inScope = items
    .filter((i) => i.status === "published" && types.includes(i.type))
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  const regions = ["all", ...Array.from(new Set(inScope.map((i) => i.region).filter(Boolean) as string[]))];
  const [region, setRegion] = useState("all");
  const shown = region === "all" ? inScope : inScope.filter((i) => i.region === region);

  return (
    <div className="space-y-4">
      <SectionHeading
        Icon={Icon}
        title={title}
        sub={blurb}
        right={<span className="text-xs text-neutral-500 tabular-nums">{shown.length} item{shown.length === 1 ? "" : "s"}</span>}
      />

      {regions.length > 2 && (
        <div className="flex items-center flex-wrap gap-1.5">
          {regions.map((r) => (
            <button
              key={r}
              onClick={() => setRegion(r)}
              className={cn(
                "rounded-md px-2.5 py-1 text-[11px] font-medium ring-1 transition-colors",
                region === r
                  ? "bg-violet-500/15 text-violet-200 ring-violet-500/30"
                  : "bg-neutral-900 text-neutral-400 ring-neutral-800 hover:text-neutral-200 hover:bg-neutral-800",
              )}
            >
              {r === "all" ? "All regions" : r}
            </button>
          ))}
        </div>
      )}

      {shown.length > 0 ? (
        <DataTable items={shown} variant={variant} />
      ) : (
        <p className="text-sm text-neutral-500">No items in this view yet.</p>
      )}
    </div>
  );
}
