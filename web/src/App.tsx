import { lazy, Suspense, useState } from "react";
import { Sidebar, TopBar } from "./components/Sidebar";
import type { Page, Counts } from "./lib/nav";
import { ALL_ITEMS, FEED_META } from "./content";
import { MILESTONES } from "./content/milestones";
import { THEMES } from "./content/themes";
import { JURISDICTIONS } from "./content/jurisdictions";
import { Brief } from "./views/Brief";
import { Collection } from "./views/Collection";
import { Intelligence } from "./views/Intelligence";
import { Radar } from "./views/Radar";
import { Activity } from "./views/Activity";
import { Themes } from "./views/Themes";
import { Learn } from "./views/Learn";
import { Trends } from "./views/Trends";
import { FCA } from "./views/FCA";
import { BriefingPackDrawer } from "./components/BriefingPack";
import { withinDays } from "./lib/utils";

// The world map pulls in a topojson (about 100 kB), so it loads on demand.
const Atlas = lazy(() => import("./views/Atlas").then((m) => ({ default: m.Atlas })));

export function App() {
  const [page, setPageRaw] = useState<Page>("brief");
  const [theme, setTheme] = useState<string | null>(null);
  // Moving to any page clears the selected topic, so reopening Topic
  // briefings lands on the list, not a stale detail page.
  const setPage = (p: Page) => {
    setPageRaw(p);
    setTheme(null);
    window.scrollTo(0, 0);
  };

  // Single source of truth: hand-seeded items plus the agent feed.
  const items = ALL_ITEMS;
  const published = items.filter((i) => i.status === "published");
  const today = startOfToday();

  // The rail shows what each list page holds, like an inbox count.
  const counts: Counts = {
    signals: published.filter((i) => i.type === "signal" || i.type === "regulatory").length,
    fca: published.filter((i) => i.publication?.issuer === "FCA").length,
    ventures: published.filter((i) => i.type === "venture").length,
    solutions: published.filter((i) => i.type === "solution").length,
    intelligence: published.filter((i) => i.type === "typology").length,
    radar: MILESTONES.filter((m) => new Date(m.date + "T00:00:00").getTime() >= today).length,
    atlas: JURISDICTIONS.length,
    themes: THEMES.length,
    activity: published.filter((i) => i.addedBy === "agent").length,
  };
  // Items the agent added in the last two days, marked beside its log.
  const fresh = published.filter((i) => i.addedBy === "agent" && withinDays(i.addedAt, 2)).length;

  return (
    <div className="md:flex min-h-screen">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 btn">
        Skip to content
      </a>
      <TopBar page={page} setPage={setPage} />
      <Sidebar page={page} setPage={setPage} counts={counts} lastUpdated={FEED_META.lastUpdated} fresh={fresh} />
      <main id="main" className="flex-1 min-w-0">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-6 sm:py-8" key={page}>
          {page === "brief" && <Brief items={items} setPage={setPage} setTheme={setTheme} lastUpdated={FEED_META.lastUpdated} />}
          {page === "learn" && <Learn setPage={setPage} />}
          {page === "themes" && <Themes items={items} theme={theme} setTheme={setTheme} />}
          {page === "signals" && (
            <Collection
              items={items}
              types={["signal", "regulatory"]}
              title="News and regulation"
              lede="News, new rules and enforcement across digital assets and financial crime, newest first."
              variant="signal"
              exportName="News and regulation"
            />
          )}
          {page === "ventures" && (
            <Collection
              items={items}
              types={["venture"]}
              title="Funding and deals"
              lede="Funding rounds, acquisitions and market moves among the firms that build or sell financial-crime tooling for digital assets."
              variant="venture"
              exportName="Funding and deals"
            />
          )}
          {page === "solutions" && (
            <Collection
              items={items}
              types={["solution"]}
              title="Vendors"
              lede="The vendors a bank can buy from, our stance on each, and the build-or-buy call. Switch to the matrix to compare them by category."
              variant="solution"
              exportName="Vendors"
            />
          )}
          {page === "fca" && <FCA items={items} />}
          {page === "atlas" && (
            <Suspense fallback={<p className="text-small text-ink-faint">Loading the map.</p>}>
              <Atlas />
            </Suspense>
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

function startOfToday() {
  const n = new Date();
  return new Date(n.getFullYear(), n.getMonth(), n.getDate()).getTime();
}
