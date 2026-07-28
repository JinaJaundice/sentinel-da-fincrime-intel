import { useState } from "react";
import { Table2, LayoutGrid, ShieldCheck, type LucideIcon } from "lucide-react";
import type { Item, ItemType } from "../content/types";
import { PageHeader } from "../components/PageHeader";
import { DataTable } from "../components/DataTable";
import { CollectionDashboard } from "../components/CollectionDashboard";
import { ExportMenu } from "../components/ExportMenu";
import { VendorMatrix } from "../components/VendorMatrix";
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
  const byRegion = region === "all" ? inScope : inScope.filter((i) => i.region === region);

  // Verified-only filter (client-ready tier) — offered when any item in scope is vouched.
  const hasVerified = inScope.some((i) => i.verified);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const shown = verifiedOnly ? byRegion.filter((i) => i.verified) : byRegion;

  // Solutions can switch between the dense table and a vendor matrix.
  const canCompare = variant === "solution";
  const [mode, setMode] = useState<"table" | "matrix">("table");

  return (
    <div className="space-y-4">
      <PageHeader
        Icon={Icon}
        title={title}
        subtitle={blurb}
        right={
          <div className="flex items-center gap-3">
            <span className="text-xs text-neutral-500 tabular-nums">
              {shown.length} item{shown.length === 1 ? "" : "s"}
            </span>
            <ExportMenu items={shown} docTitle={`Sentinel: ${title}`} filenameBase={`sentinel-${title}`} />
          </div>
        }
      />

      <CollectionDashboard items={inScope} variant={variant} />

      {(regions.length > 2 || canCompare || hasVerified) && (
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center flex-wrap gap-1.5">
            {regions.length > 2 &&
              regions.map((r) => (
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
            {hasVerified && (
              <button
                onClick={() => setVerifiedOnly((v) => !v)}
                aria-pressed={verifiedOnly}
                className={cn(
                  "inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-medium ring-1 transition-colors",
                  verifiedOnly
                    ? "bg-violet-500/15 text-violet-200 ring-violet-500/30"
                    : "bg-neutral-900 text-neutral-400 ring-neutral-800 hover:text-neutral-200 hover:bg-neutral-800",
                )}
              >
                <ShieldCheck className="h-3 w-3" /> Verified only
              </button>
            )}
          </div>
          {canCompare && (
            <div className="flex items-center gap-0.5 rounded-lg bg-neutral-900 ring-1 ring-neutral-800 p-0.5">
              <ModeButton active={mode === "table"} onClick={() => setMode("table")} Icon={Table2} label="Table" />
              <ModeButton active={mode === "matrix"} onClick={() => setMode("matrix")} Icon={LayoutGrid} label="Matrix" />
            </div>
          )}
        </div>
      )}

      {shown.length === 0 ? (
        <p className="text-sm text-neutral-500">No items in this view yet.</p>
      ) : canCompare && mode === "matrix" ? (
        <VendorMatrix items={shown} />
      ) : (
        <DataTable items={shown} variant={variant} />
      )}
    </div>
  );
}

function ModeButton({
  active,
  onClick,
  Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  Icon: LucideIcon;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors",
        active ? "bg-violet-500/15 text-violet-200 ring-1 ring-violet-500/30" : "text-neutral-400 hover:text-neutral-200",
      )}
    >
      <Icon className="h-3.5 w-3.5" strokeWidth={1.75} /> {label}
    </button>
  );
}
