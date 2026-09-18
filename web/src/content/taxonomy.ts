import { Newspaper, Scale, TrendingUp, Boxes, Crosshair, type LucideIcon } from "lucide-react";
import type { ItemType, SolutionStance, Confidence } from "./types";
import { TONE, type Tone } from "../lib/uiTokens";

// Label + icon metadata per content type. Types are told apart by icon and
// word, never by colour, so the one accent keeps its meaning.
export const TYPE_META: Record<ItemType, { label: string; plural: string; Icon: LucideIcon; blurb: string }> = {
  signal: { label: "News", plural: "News", Icon: Newspaper, blurb: "News and market developments" },
  regulatory: { label: "Regulation", plural: "Regulation", Icon: Scale, blurb: "Rules, supervision and enforcement" },
  venture: { label: "Funding", plural: "Funding and deals", Icon: TrendingUp, blurb: "Funding rounds, acquisitions and market moves" },
  solution: { label: "Vendor", plural: "Vendors", Icon: Boxes, blurb: "Vendors and the build-or-buy landscape" },
  typology: { label: "Crime pattern", plural: "Crime patterns", Icon: Crosshair, blurb: "How the money moves and which controls catch it" },
};

// Stance on a vendor, for the build-or-buy call. "In use" carries the
// accent because it is the one that describes a decision already made.
export const STANCE_META: Record<SolutionStance, { label: string; tone: Tone; chip: string }> = {
  "in-use": { label: "In use", tone: "signal", chip: TONE.signal.soft },
  shortlist: { label: "Shortlisted", tone: "neutral", chip: "bg-sunken text-ink" },
  evaluate: { label: "Evaluating", tone: "medium", chip: TONE.medium.soft },
  watch: { label: "Watching", tone: "neutral", chip: TONE.neutral.soft },
};

// Confidence is a trust signal, distinct from impact, so it stays off the
// risk colours: a dot that runs from the accent to grey.
export const CONFIDENCE_META: Record<Confidence, { label: string; dot: string }> = {
  high: { label: "High confidence", dot: "bg-signal" },
  medium: { label: "Medium confidence", dot: "bg-ink-faint" },
  low: { label: "Low confidence", dot: "bg-rule-strong" },
};

// Source provenance: the official or originating document carries the
// accent; reporting about it is quiet.
export const SOURCE_KIND_META: Record<"primary" | "secondary", { label: string; chip: string }> = {
  primary: { label: "Primary", chip: TONE.signal.soft },
  secondary: { label: "Secondary", chip: "bg-sunken text-ink-faint" },
};
