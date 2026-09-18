import type { Item } from "../content/types";
import { Panel } from "../lib/ui";
import { ItemDetail } from "./ItemDetail";

// One item on its own paper. Lists use ItemDetail inside an expanded row.
export function ItemCard({ item }: { item: Item }) {
  return (
    <Panel className="p-4">
      <ItemDetail item={item} />
    </Panel>
  );
}
