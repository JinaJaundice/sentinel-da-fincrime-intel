import { useState } from "react";
import { Sidebar, type Page } from "./components/Sidebar";
import { ALL_ITEMS, FEED_META } from "./content";
import { TYPE_META } from "./content/taxonomy";
import { Brief } from "./views/Brief";
import { Collection } from "./views/Collection";
import { Intelligence } from "./views/Intelligence";
import { Radar } from "./views/Radar";
import { Activity } from "./views/Activity";
import { Themes } from "./views/Themes";
import { Learn } from "./views/Learn";
import { Trends } from "./views/Trends";
import { BriefingPackDrawer } from "./components/BriefingPack";

export function App() {
  const [page, setPageRaw] = useState<Page>("brief");
  const [theme, setTheme] = useState<string | null>(null);
  // Navigating to any tab clears the selected theme (so re-opening Themes
  // lands on the grid, not a stale detail page).
  const setPage = (p: Page) => {
    setPageRaw(p);
    setTheme(null);
  };
  // Single source of truth: hand-seeded items + the agent feed.
  const items = ALL_ITEMS;

  // "New" indicator: agent items published in the last 2 days.
  const badgeCount = items.filter(
    (i) => i.addedBy === "agent" && i.status === "published" && withinDays(i.addedAt, 2),
  ).length;

  return (
    <div className="md:flex min-h-screen text-neutral-100">
      <Sidebar page={page} setPage={setPage} badgeCount={badgeCount} />
      <main className="flex-1 min-w-0">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-8" key={page}>
          {page === "brief" && <Brief items={items} setPage={setPage} setTheme={setTheme} lastUpdated={FEED_META.lastUpdated} />}
          {page === "learn" && <Learn setPage={setPage} />}
          {page === "themes" && <Themes items={items} theme={theme} setTheme={setTheme} />}
          {page === "signals" && (
            <Collection
              items={items}
              types={["signal", "regulatory"]}
              title="Signals"
              blurb="News, regulation & enforcement across digital-asset financial crime"
              Icon={TYPE_META.signal.Icon}
              variant="signal"
            />
          )}
          {page === "ventures" && (
            <Collection
              items={items}
              types={["venture"]}
              title="Ventures"
              blurb={TYPE_META.venture.blurb}
              Icon={TYPE_META.venture.Icon}
              variant="venture"
            />
          )}
          {page === "solutions" && (
            <Collection
              items={items}
              types={["solution"]}
              title="Solutions"
              blurb={TYPE_META.solution.blurb}
              Icon={TYPE_META.solution.Icon}
              variant="solution"
            />
          )}
          {page === "intelligence" && <Intelligence items={items} />}
          {page === "trends" && <Trends items={items} setPage={setPage} setTheme={setTheme} />}
          {page === "radar" && <Radar items={items} />}
          {page === "activity" && <Activity items={items} lastUpdated={FEED_META.lastUpdated} />}
        </div>
      </main>
      <BriefingPackDrawer items={items} />
    </div>
  );
}

function withinDays(iso: string, days: number, now = new Date()) {
  const d = new Date(iso + "T00:00:00").getTime();
  return now.getTime() - d <= days * 86_400_000;
}
