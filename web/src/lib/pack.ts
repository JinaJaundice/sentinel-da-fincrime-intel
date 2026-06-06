import { useSyncExternalStore } from "react";

// ---------------------------------------------------------------
// Briefing pack — a curated, ordered selection of items the user is
// assembling into a one-pager / export. Same shape as the review
// overlay (store.ts): an ordered list of item ids in a localStorage
// overlay, exposed through useSyncExternalStore so the toggle on each
// item and the floating drawer stay in lockstep without a backend.
//
// Order matters here (unlike the review overlay set): the pack is a
// curated narrative, so it's an array and supports reordering.
// ---------------------------------------------------------------

const KEY = "sentinel.pack.v1";

let ids: string[] = load();
const listeners = new Set<() => void>();

function load(): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(v) ? (v as string[]) : [];
  } catch {
    return [];
  }
}

function emit() {
  try {
    localStorage.setItem(KEY, JSON.stringify(ids));
  } catch {
    /* private mode / quota — keep working in-memory */
  }
  listeners.forEach((l) => l());
}

function set(next: string[]) {
  ids = next;
  emit();
}

export function togglePack(id: string) {
  set(ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]);
}

export function removeFromPack(id: string) {
  set(ids.filter((x) => x !== id));
}

export function clearPack() {
  set([]);
}

// Move an item one slot up (dir -1) or down (dir +1) within the pack.
export function movePack(id: string, dir: -1 | 1) {
  const i = ids.indexOf(id);
  if (i === -1) return;
  const j = i + dir;
  if (j < 0 || j >= ids.length) return;
  const next = [...ids];
  [next[i], next[j]] = [next[j], next[i]];
  set(next);
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

// The ordered list of packed item ids.
export function usePack(): string[] {
  return useSyncExternalStore(subscribe, () => ids, () => ids);
}
