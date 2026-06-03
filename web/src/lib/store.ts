import { useSyncExternalStore } from "react";
import type { Status } from "../content/types";

// ---------------------------------------------------------------
// Human-in-the-loop review state.
//
// Seed items ship with a baseline status. The reviewer's approve/reject
// decisions are stored as a localStorage overlay keyed by item id, so
// they persist across reloads without a backend. In Phase 2 the
// scheduled ingestion agent appends new `pending` items and this same
// overlay records what the human published — at which point the overlay
// graduates to a small local API / file write.
// ---------------------------------------------------------------

const KEY = "sentinel.review.v1";
type Overlay = Record<string, Status>;

let overlay: Overlay = load();
const listeners = new Set<() => void>();

function load(): Overlay {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}") as Overlay;
  } catch {
    return {};
  }
}

function emit() {
  try {
    localStorage.setItem(KEY, JSON.stringify(overlay));
  } catch {
    /* private mode / quota — keep working in-memory */
  }
  listeners.forEach((l) => l());
}

export function setStatus(id: string, status: Status) {
  overlay = { ...overlay, [id]: status };
  emit();
}

export function resetReviewState() {
  overlay = {};
  emit();
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function useReviewOverlay(): Overlay {
  return useSyncExternalStore(subscribe, () => overlay, () => overlay);
}
