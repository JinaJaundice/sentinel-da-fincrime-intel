import { Radar } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { NAV_GROUPS, type Page, type Counts } from "../lib/nav";
import { cn, shortDate } from "../lib/utils";

export type { Page, Counts } from "../lib/nav";

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5 min-w-0">
      <span className="grid place-items-center w-8 h-8 rounded-md bg-signal text-on-signal shrink-0" aria-hidden>
        <Radar className="h-4 w-4" strokeWidth={2} />
      </span>
      <div className="min-w-0">
        <div className="text-body font-semibold text-ink leading-none">Sentinel</div>
        {!compact && <div className="text-micro text-ink-faint leading-none mt-1 truncate">Digital-asset financial crime</div>}
      </div>
    </div>
  );
}

/** The left rail on desktop. Grouped links, a count beside each list page,
 *  the theme control and the feed's last update at the foot. */
export function Sidebar({
  page,
  setPage,
  counts,
  lastUpdated,
  fresh,
}: {
  page: Page;
  setPage: (p: Page) => void;
  counts: Counts;
  lastUpdated: string;
  /** Items the agent added in the last two days; shown beside its log. */
  fresh: number;
}) {
  return (
    <aside className="hidden md:flex md:flex-col w-64 shrink-0 h-screen sticky top-0 border-r border-rule bg-surface">
      <div className="px-4 pt-5 pb-4">
        <Brand />
      </div>

      <nav aria-label="Primary" className="flex-1 overflow-y-auto px-2 pb-4">
        {NAV_GROUPS.map((g) => (
          <div key={g.label} className="mb-4">
            <div className="label px-2.5 mb-1.5">{g.label}</div>
            <ul className="space-y-px">
              {g.items.map(({ id, label, Icon }) => {
                const active = page === id;
                const n = counts[id];
                const badge = id === "activity" && fresh > 0 ? fresh : undefined;
                return (
                  <li key={id}>
                    <button
                      type="button"
                      data-page={id}
                      onClick={() => setPage(id)}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "w-full flex items-center gap-2.5 pl-2.5 pr-2 py-1.5 rounded-md text-left text-small transition-colors border-l-2",
                        active ? "bg-signal-soft text-ink border-signal font-medium" : "text-ink-soft border-transparent hover:bg-sunken hover:text-ink",
                      )}
                    >
                      <Icon className={cn("h-4 w-4 shrink-0", active ? "text-signal" : "text-ink-faint")} strokeWidth={1.75} aria-hidden />
                      <span className="flex-1 min-w-0 truncate">{label}</span>
                      {badge !== undefined ? (
                        <span className="text-micro font-semibold num rounded-sm px-1.5 py-0.5 bg-signal text-on-signal" title={`${badge} added in the last two days`}>
                          {badge}
                        </span>
                      ) : (
                        n !== undefined && <span className="text-micro num text-ink-faint">{n}</span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="px-4 py-3 border-t border-rule flex items-center justify-between gap-3">
        <div className="text-micro text-ink-faint leading-snug min-w-0">
          <div className="text-ink-soft num">Updated {shortDate(lastUpdated)}</div>
          <div>by the agent, daily</div>
        </div>
        <ThemeToggle />
      </div>
    </aside>
  );
}

/** The top bar on a phone: the mark, a native page picker, the theme control. */
export function TopBar({ page, setPage }: { page: Page; setPage: (p: Page) => void }) {
  return (
    <header className="md:hidden sticky top-0 z-20 bg-surface border-b border-rule px-4 py-2.5 flex items-center gap-3">
      <Brand compact />
      <label className="flex-1 min-w-0">
        <span className="sr-only">Go to page</span>
        <select value={page} onChange={(e) => setPage(e.target.value as Page)} className="field py-1.5" aria-label="Go to page">
          {NAV_GROUPS.map((g) => (
            <optgroup key={g.label} label={g.label}>
              {g.items.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </label>
      <ThemeToggle />
    </header>
  );
}
