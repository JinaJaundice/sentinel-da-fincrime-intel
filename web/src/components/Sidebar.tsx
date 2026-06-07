import { Radar, LayoutDashboard, Newspaper, TrendingUp, Boxes, Crosshair, CalendarClock, Shapes, Radio, GraduationCap, LineChart, type LucideIcon } from "lucide-react";
import { cn } from "../lib/utils";

export type Page = "brief" | "learn" | "trends" | "themes" | "signals" | "ventures" | "solutions" | "intelligence" | "radar" | "activity";

// Each tab carries a plain-language descriptor so the punchy names aren't cryptic.
const NAV: { id: Page; label: string; desc: string; Icon: LucideIcon }[] = [
  { id: "brief", label: "Overview", desc: "Today's briefing", Icon: LayoutDashboard },
  { id: "learn", label: "Learn", desc: "Start here & glossary", Icon: GraduationCap },
  { id: "trends", label: "Trends", desc: "What's moving over time", Icon: LineChart },
  { id: "themes", label: "Themes", desc: "Topics & briefings", Icon: Shapes },
  { id: "signals", label: "Signals", desc: "News & regulation", Icon: Newspaper },
  { id: "ventures", label: "Ventures", desc: "Funding & M&A", Icon: TrendingUp },
  { id: "solutions", label: "Solutions", desc: "Vendors & build-vs-buy", Icon: Boxes },
  { id: "intelligence", label: "Intelligence", desc: "Laundering typologies", Icon: Crosshair },
  { id: "radar", label: "Radar", desc: "Key dates ahead", Icon: CalendarClock },
  { id: "activity", label: "Activity", desc: "What the agent published", Icon: Radio },
];

// Glassy left sidebar on desktop; a horizontal scrolling bar on mobile.
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
    <aside className="md:w-60 md:shrink-0 md:h-screen md:sticky md:top-0 border-b md:border-b-0 md:border-r border-white/[0.06] bg-neutral-950/50 backdrop-blur-xl z-20">
      <div className="px-4 py-4 flex md:flex-col md:h-full gap-3 md:gap-6 items-center md:items-stretch">
        <div className="flex items-center gap-2.5 shrink-0">
          <span className="grid place-items-center w-9 h-9 rounded-xl bg-violet-500/15 ring-1 ring-violet-500/30 text-violet-300 glow-violet">
            <Radar className="h-4 w-4" strokeWidth={1.75} />
          </span>
          <div className="hidden md:block">
            <div className="font-medium text-neutral-100 text-sm leading-none tracking-tight">Sentinel</div>
            <div className="text-[10px] text-neutral-500 leading-none mt-1 font-light">DA financial-crime intel</div>
          </div>
        </div>

        <nav aria-label="Primary" className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible">
          {NAV.map(({ id, label, desc, Icon }) => {
            const active = page === id;
            const showCount = id === "activity" && badgeCount > 0;
            return (
              <button
                key={id}
                onClick={() => setPage(id)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group flex items-center gap-2.5 px-2.5 py-2 rounded-xl shrink-0 whitespace-nowrap transition-colors md:border-l-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-violet-500/40",
                  active ? "bg-white/[0.04] md:border-violet-500" : "hover:bg-white/[0.03] md:border-transparent",
                )}
              >
                <Icon
                  className={cn("h-4 w-4 shrink-0", active ? "text-violet-300" : "text-neutral-500 group-hover:text-neutral-300")}
                  strokeWidth={1.75}
                />
                <span className="md:flex-1 min-w-0">
                  <span
                    className={cn(
                      "block text-left text-[13px] leading-none",
                      active ? "text-neutral-100 font-medium" : "text-neutral-300 font-normal group-hover:text-neutral-100",
                    )}
                  >
                    {label}
                  </span>
                  <span className="hidden md:block text-left text-[10px] leading-none mt-1 font-light text-neutral-500 truncate">{desc}</span>
                </span>
                {showCount && (
                  <span className="grid place-items-center min-w-4 h-4 px-1 rounded-full bg-violet-500/20 text-violet-200 ring-1 ring-violet-500/30 text-[10px] font-semibold tabular-nums">
                    {badgeCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="hidden md:block md:mt-auto pt-4 text-[10px] text-neutral-600 leading-relaxed font-light">
          v0.1 · live
          <br />
          auto-publish, no HITL
        </div>
      </div>
    </aside>
  );
}
