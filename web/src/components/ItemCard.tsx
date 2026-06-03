import type { Item } from "../content/types";
import { Panel } from "../lib/ui";
import { ItemDetail } from "./ItemDetail";

// A full item as a standalone card (used in the Overview brief and the
// Review queue). Dense tables use ItemDetail directly in their expansion.
export function ItemCard({ item, review = false }: { item: Item; review?: boolean }) {
  return (
    <Panel className="p-4">
      <ItemDetail item={item} review={review} />
    </Panel>
  );
}
