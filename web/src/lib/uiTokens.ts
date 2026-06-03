// ---------------------------------------------------------------
// Visual tokens — dark, neutral, violet-accented.
//
// Deliberately distinct from the Compliance Engine (light + blue): this
// is a near-black neutral base with a single electric-violet accent and
// amber/rose risk bands. DefiLlama-style density. Tailwind v4 only sees
// literal class strings, so every variant is enumerated here.
// ---------------------------------------------------------------

// Brand accent (violet) as raw class fragments, reused across components.
export const ACCENT = {
  text: "text-violet-400",
  textBright: "text-violet-300",
  bg: "bg-violet-500",
  dot: "bg-violet-400",
  soft: "bg-violet-500/10 text-violet-300 ring-1 ring-violet-500/25",
  bar: "bg-violet-500",
} as const;

// Coloured "tone" used by tiles, stats and badges. Most of the UI is
// monochrome neutral; tone adds meaning only where it earns it.
export type Tone = "brand" | "amber" | "rose" | "neutral";

export const TONE: Record<Tone, { tile: string; text: string; dot: string; bar: string }> = {
  brand: {
    tile: "bg-violet-500/10 text-violet-300 ring-1 ring-violet-500/25",
    text: "text-violet-300",
    dot: "bg-violet-400",
    bar: "bg-violet-500",
  },
  amber: {
    tile: "bg-amber-500/10 text-amber-300 ring-1 ring-amber-500/25",
    text: "text-amber-300",
    dot: "bg-amber-400",
    bar: "bg-amber-500",
  },
  rose: {
    tile: "bg-rose-500/10 text-rose-300 ring-1 ring-rose-500/25",
    text: "text-rose-300",
    dot: "bg-rose-400",
    bar: "bg-rose-500",
  },
  neutral: {
    tile: "bg-neutral-800 text-neutral-300 ring-1 ring-neutral-700",
    text: "text-neutral-300",
    dot: "bg-neutral-500",
    bar: "bg-neutral-600",
  },
};

// Impact bands keep amber/rose risk language on dark.
export type Impact = "low" | "medium" | "high";
export const IMPACT_TONE: Record<Impact, { label: string; chip: string }> = {
  high: { label: "High", chip: "bg-rose-500/10 text-rose-300 ring-1 ring-rose-500/30" },
  medium: { label: "Medium", chip: "bg-amber-500/10 text-amber-300 ring-1 ring-amber-500/30" },
  low: { label: "Low", chip: "bg-neutral-800 text-neutral-400 ring-1 ring-neutral-700" },
};
