import { Radar, LayoutDashboard, Newspaper, TrendingUp, Boxes, Crosshair, CalendarClock, Radio, type LucideIcon } from "lucide-react";
import { cn } from "../lib/utils";

export type Page = "brief" | "signals" | "ventures" | "solutions" | "intelligence" | "radar" | "activity";

const NAV: { id: Page; label: string; Icon: LucideIcon }[] = [
  { id: "brief", label: "Overview", Icon: LayoutDashboard },
  { id: "signals", label: "Signals", Icon: Newspaper },
  { id: "ventures", label: "Ventures", Icon: TrendingUp },
  { id: "solutions", label: "Solutions", Icon: Boxes },
  { id: "intelligence", label: "Intelligence", Icon: Crosshair },
  { id: "radar", label: "Radar", Icon: CalendarClock },
  { id: "activity", label: "Activity", Icon: Radio },
];

// Fixed left sidebar on desktop; a horizontal scrolling bar on mobile.
// `badgeCount` = items the agent published recently (a "new" indicator).
export function Sidebar({
  page,
  setPage,
  badgeCount,
}: {
  page: Page;
  setPage: (p: Page) => void;
  badgeCount: number;
}) {
  return (
    <aside className="md:w-56 md:shrink-0 md:h-screen md:sticky md:top-0 border-b md:border-b-0 md:border-r border-neutral-800 bg-neutral-950 z-20">
      <div className="px-4 py-4 flex md:flex-col md:h-full gap-3 md:gap-5 items-center md:items-stretch">
        <div className="flex items-center gap-2.5 shrink-0">
          <span className="grid place-items-center w-8 h-8 rounded-xl bg-violet-500/15 ring-1 ring-violet-500/30 text-violet-300">
            <Radar className="h-4 w-4" />
          </span>
          <div className="hidden md:block">
            <div className="font-semibold text-neutral-100 text-sm leading-none">Sentinel</div>
            <div className="text-[10px] text-neutral-500 leading-none mt-1">DA financial-crime intel</div>
          </div>
        </div>

        <nav aria-label="Primary" className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible">
          {NAV.map(({ id, label, Icon }) => {
            const active = page === id;
            const showCount = id === "activity" && badgeCount > 0;
            return (
              <button
                key={id}
                onClick={() => setPage(id)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium shrink-0 whitespace-nowrap transition-colors md:border-l-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-violet-500/40",
                  active
                    ? "bg-neutral-800/60 text-neutral-100 md:border-violet-500"
                    : "text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800/40 md:border-transparent",
                )}
              >
                <Icon
                  className={cn("h-4 w-4 shrink-0", active ? "text-violet-400" : "text-neutral-500 group-hover:text-neutral-300")}
                  strokeWidth={2}
                />
                <span className="md:flex-1 text-left">{label}</span>
                {showCount && (
                  <span className="grid place-items-center min-w-4 h-4 px-1 rounded-full bg-violet-500/20 text-violet-200 ring-1 ring-violet-500/30 text-[10px] font-semibold tabular-nums">
                    {badgeCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="hidden md:block md:mt-auto pt-4 text-[10px] text-neutral-600 leading-relaxed">
          v0.1 · phase 3
          <br />
          auto-publish
        </div>
      </div>
    </aside>
  );
}
