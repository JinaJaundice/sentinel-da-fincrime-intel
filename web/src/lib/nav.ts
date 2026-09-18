import { LayoutList, Newspaper, TrendingUp, Boxes, Crosshair, CalendarClock, Shapes, Bot, BookOpen, LineChart, Landmark, Globe, type LucideIcon } from "lucide-react";

export type Page = "brief" | "learn" | "trends" | "themes" | "signals" | "fca" | "atlas" | "ventures" | "solutions" | "intelligence" | "radar" | "activity";

export interface NavItem {
  id: Page;
  label: string;
  Icon: LucideIcon;
}

// Every label says what the page shows, in plain words. Three groups: the
// pages that read the whole picture, the pages that track one kind of
// thing, and the two pages about the tool itself.
export const NAV_GROUPS: { label: string; items: NavItem[] }[] = [
  {
    label: "Briefings",
    items: [
      { id: "brief", label: "Today's briefing", Icon: LayoutList },
      { id: "trends", label: "What is moving", Icon: LineChart },
      { id: "themes", label: "Topic briefings", Icon: Shapes },
    ],
  },
  {
    label: "Track",
    items: [
      { id: "signals", label: "News and regulation", Icon: Newspaper },
      { id: "fca", label: "FCA papers", Icon: Landmark },
      { id: "radar", label: "Dates ahead", Icon: CalendarClock },
      { id: "atlas", label: "Rules by country", Icon: Globe },
      { id: "ventures", label: "Funding and deals", Icon: TrendingUp },
      { id: "solutions", label: "Vendors", Icon: Boxes },
      { id: "intelligence", label: "Crime patterns", Icon: Crosshair },
    ],
  },
  {
    label: "About",
    items: [
      { id: "learn", label: "How to use this", Icon: BookOpen },
      { id: "activity", label: "What the agent added", Icon: Bot },
    ],
  },
];

export const NAV_ITEMS: NavItem[] = NAV_GROUPS.flatMap((g) => g.items);
export const PAGE_LABEL: Record<Page, string> = Object.fromEntries(NAV_ITEMS.map((n) => [n.id, n.label])) as Record<Page, string>;

export type Counts = Partial<Record<Page, number>>;
