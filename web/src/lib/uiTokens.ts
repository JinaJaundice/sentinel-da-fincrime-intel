// ---------------------------------------------------------------
// Visual tokens as class names. Every colour is a token in index.css
// (`--color-*`), which Tailwind v4 turns into utilities (`text-signal`,
// `bg-high-soft`). Tailwind only sees literal class strings, so the
// variants are enumerated here rather than built by interpolation, and
// no component names a raw palette colour. scripts/design-check.mjs fails
// the build on any default Tailwind palette class.
// ---------------------------------------------------------------

export type Tone = "signal" | "high" | "medium" | "low" | "neutral";

export const TONE: Record<Tone, { text: string; soft: string; fill: string; dot: string }> = {
  signal: { text: "text-signal", soft: "bg-signal-soft text-signal", fill: "bg-signal", dot: "bg-signal" },
  high: { text: "text-high", soft: "bg-high-soft text-high", fill: "bg-high", dot: "bg-high" },
  medium: { text: "text-medium", soft: "bg-medium-soft text-medium", fill: "bg-medium", dot: "bg-medium" },
  low: { text: "text-low", soft: "bg-low-soft text-low", fill: "bg-rule-strong", dot: "bg-rule-strong" },
  neutral: { text: "text-ink-soft", soft: "bg-sunken text-ink-soft", fill: "bg-rule-strong", dot: "bg-rule-strong" },
};

// Impact is the risk weight of an item for a bank. It is always shown as a
// word, with the colour as the second cue.
export type Impact = "low" | "medium" | "high";
export const IMPACT_TONE: Record<Impact, { label: string; tone: Tone; chip: string }> = {
  high: { label: "High", tone: "high", chip: TONE.high.soft },
  medium: { label: "Medium", tone: "medium", chip: TONE.medium.soft },
  low: { label: "Low", tone: "low", chip: TONE.low.soft },
};
export const IMPACT_ORDER: Impact[] = ["high", "medium", "low"];
