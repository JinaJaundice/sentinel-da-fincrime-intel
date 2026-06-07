import type { Item } from "../content/types";
import { Panel } from "../lib/ui";
import { ItemDetail } from "./ItemDetail";

// A full item as a standalone card (used in Overview, Activity, Intelligence
// and Themes). Dense tables use ItemDetail directly in their expansion.
export function ItemCard({ item }: { item: Item }) {
  return (
    <Panel className="p-4">
      <ItemDetail item={item} />
    </Panel>
  );
}
