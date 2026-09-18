import type { Item } from "../content/types";
import { EmptyState, FigureStrip } from "../lib/ui";
import { DataTable } from "../components/DataTable";
import { PageHeader } from "../components/PageHeader";
import { withinDays, longDate } from "../lib/utils";

// What the agent added: the log of every item the agent published, grouped
// by the day it ran. The agent publishes without a human gate, so this is
// the place to see what it did.
export function Activity({ items, lastUpdated }: { items: Item[]; lastUpdated: string }) {
  const agent = items.filter((i) => i.addedBy === "agent" && i.status === "published");
  const runs = new Set(agent.map((i) => i.addedAt)).size;

  return (
    <div className="space-y-4">
      <PageHeader
        title="What the agent added"
        lede="Every item the agent published, grouped by the day it ran. It runs daily, reads the news, the regulators and the vendors, and publishes without a human gate, so each item must carry a real source."
      />

      <FigureStrip
        figures={[
          { label: "Items from the agent", value: agent.length },
          { label: "Added in the last 7 days", value: agent.filter((i) => withinDays(i.addedAt, 7)).length, tone: "signal" },
          { label: "Days it has run", value: runs },
          { label: "Last run", value: longDate(lastUpdated) },
        ]}
      />

      {agent.length === 0 ? (
        <EmptyState title="Nothing from the agent yet" body="When the scheduled agent runs, the items it publishes appear here." />
      ) : (
        <DataTable items={agent} variant="signal" groupBy={(i) => `Added ${longDate(i.addedAt)}`} initialSort={{ key: "Added", dir: "desc" }} />
      )}
    </div>
  );
}
