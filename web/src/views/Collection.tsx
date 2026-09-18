import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import type { Item, ItemType } from "../content/types";
import { PageHeader } from "../components/PageHeader";
import { DataTable, type Variant } from "../components/DataTable";
import { ExportMenu } from "../components/ExportMenu";
import { VendorMatrix } from "../components/VendorMatrix";
import { Chip, Segmented } from "../lib/ui";
import { IMPACT_ORDER, IMPACT_TONE, type Impact } from "../lib/uiTokens";
import { withinDays } from "../lib/utils";

// One list page, reused by News and regulation, Funding and deals and
// Vendors. The filters carry their counts, so the page reads as a summary
// before anything is clicked. Adding a future page is another instance of
// this, never new plumbing.
export function Collection({
  items,
  types,
  title,
  lede,
  variant,
  exportName,
}: {
  items: Item[];
  types: ItemType[];
  title: string;
  lede: string;
  variant: Exclude<Variant, "fca">;
  exportName: string;
}) {
  const inScope = items.filter((i) => i.status === "published" && types.includes(i.type)).sort((a, b) => (a.date < b.date ? 1 : -1));

  const [impact, setImpact] = useState<Impact | "all">("all");
  const [region, setRegion] = useState("all");
  const [recent, setRecent] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [mode, setMode] = useState<"table" | "matrix">("table");

  // Region chips for the regions that recur; a one-off region (the agent
  // writes combinations like "Iran / Strait of Hormuz") is found by search.
  const regionCount = new Map<string, number>();
  for (const i of inScope) if (i.region) regionCount.set(i.region, (regionCount.get(i.region) ?? 0) + 1);
  const regions = [...regionCount.entries()]
    .filter(([, n]) => n >= 2)
    .sort((a, b) => b[1] - a[1])
    .map(([r]) => r);
  const hasVerified = inScope.some((i) => i.verified);
  const hasImpact = inScope.some((i) => i.impact);
  const canCompare = variant === "solution";

  const shown = inScope
    .filter((i) => impact === "all" || i.impact === impact)
    .filter((i) => region === "all" || i.region === region)
    .filter((i) => !recent || withinDays(i.addedAt, 7))
    .filter((i) => !verifiedOnly || i.verified);

  const countImpact = (k: Impact) => inScope.filter((i) => i.impact === k).length;
  const recentCount = inScope.filter((i) => withinDays(i.addedAt, 7)).length;

  return (
    <div className="space-y-4">
      <PageHeader
        title={title}
        lede={lede}
        right={
          <>
            <span className="text-tiny text-ink-faint num">{shown.length === inScope.length ? `${inScope.length} items` : `${shown.length} of ${inScope.length} items`}</span>
            <ExportMenu items={shown} docTitle={`Sentinel: ${exportName}`} filenameBase={`sentinel-${exportName}`} />
          </>
        }
      />

      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex flex-col gap-2">
          {hasImpact && (
            <div className="flex items-center flex-wrap gap-1.5" role="group" aria-label="Filter by impact">
              <span className="label mr-1">Impact</span>
              <Chip on={impact === "all"} onClick={() => setImpact("all")} count={inScope.length}>
                All
              </Chip>
              {IMPACT_ORDER.map((k) => (
                <Chip key={k} on={impact === k} onClick={() => setImpact(impact === k ? "all" : k)} count={countImpact(k)}>
                  {IMPACT_TONE[k].label}
                </Chip>
              ))}
              <Chip on={recent} onClick={() => setRecent((v) => !v)} count={recentCount}>
                New this week
              </Chip>
              {hasVerified && (
                <Chip on={verifiedOnly} onClick={() => setVerifiedOnly((v) => !v)} count={inScope.filter((i) => i.verified).length}>
                  <ShieldCheck className="h-3 w-3" aria-hidden /> Verified only
                </Chip>
              )}
            </div>
          )}
          {regions.length > 1 && (
            <div className="flex items-center flex-wrap gap-1.5" role="group" aria-label="Filter by region">
              <span className="label mr-1">Region</span>
              <Chip on={region === "all"} onClick={() => setRegion("all")}>
                All
              </Chip>
              {regions.map((r) => (
                <Chip key={r} on={region === r} onClick={() => setRegion(region === r ? "all" : r)} count={regionCount.get(r)}>
                  {r}
                </Chip>
              ))}
            </div>
          )}
        </div>
        {canCompare && (
          <Segmented
            ariaLabel="View"
            value={mode}
            onChange={setMode}
            options={[
              { value: "table", label: "List" },
              { value: "matrix", label: "Matrix by category" },
            ]}
          />
        )}
      </div>

      {shown.length === 0 ? (
        <p className="text-small text-ink-faint">Nothing matches these filters.</p>
      ) : canCompare && mode === "matrix" ? (
        <VendorMatrix items={shown} />
      ) : (
        <DataTable items={shown} variant={variant} />
      )}
    </div>
  );
}
