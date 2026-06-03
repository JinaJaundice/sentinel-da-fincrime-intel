import { ITEMS } from "./items";
import feedData from "./feed.json";
import type { Item } from "./types";

// Two sources, one list:
//   ITEMS    — hand-seeded baseline (items.ts)
//   FEED     — agent-published items (feed.json), appended each scheduled
//              run and auto-published (Phase 2; no human gate).
// Keeping the agent's output in plain JSON means it appends safely and
// provenance stays clean. Views consume ALL_ITEMS.
export const FEED = feedData.items as unknown as Item[];
export const FEED_META = { lastUpdated: feedData.lastUpdated };
export const ALL_ITEMS: Item[] = [...ITEMS, ...FEED];
