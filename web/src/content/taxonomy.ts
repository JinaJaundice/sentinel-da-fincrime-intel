import {
  Newspaper,
  Scale,
  TrendingUp,
  Boxes,
  Crosshair,
  type LucideIcon,
} from "lucide-react";
import type { ItemType, SolutionStance, Confidence } from "./types";

// Label + icon metadata per content type. The UI is monochrome by
// design (types are told apart by icon + label, not colour), so there is
// no per-type accent here — that keeps the violet accent meaningful.
export const TYPE_META: Record<
  ItemType,
  { label: string; plural: string; Icon: LucideIcon; blurb: string }
> = {
  signal: { label: "Signal", plural: "Signals", Icon: Newspaper, blurb: "News & market intelligence" },
  regulatory: { label: "Regulatory", plural: "Regulatory", Icon: Scale, blurb: "Rules, supervision & enforcement" },
  venture: { label: "Venture", plural: "Ventures", Icon: TrendingUp, blurb: "Funding, M&A & market moves" },
  solution: { label: "Solution", plural: "Solutions", Icon: Boxes, blurb: "Vendor & build-vs-buy landscape" },
  typology: { label: "Typology", plural: "Intelligence", Icon: Crosshair, blurb: "Laundering vectors & controls" },
};

// Stance chips for the Solutions vendor landscape (dark tones).
export const STANCE_META: Record<SolutionStance, { label: string; chip: string }> = {
  "in-use": { label: "In use", chip: "bg-violet-500/15 text-violet-300 ring-1 ring-violet-500/30" },
  shortlist: { label: "Shortlisted", chip: "bg-neutral-200/10 text-neutral-200 ring-1 ring-neutral-200/20" },
  evaluate: { label: "Evaluating", chip: "bg-amber-500/10 text-amber-300 ring-1 ring-amber-500/25" },
  watch: { label: "Watching", chip: "bg-neutral-800 text-neutral-400 ring-1 ring-neutral-700" },
};

// Confidence — a trust signal distinct from impact, so it deliberately
// avoids the amber/rose risk colours. A single dot scales violet → grey.
export const CONFIDENCE_META: Record<Confidence, { label: string; dot: string }> = {
  high: { label: "High confidence", dot: "bg-violet-400" },
  medium: { label: "Medium confidence", dot: "bg-neutral-400" },
  low: { label: "Low confidence", dot: "bg-neutral-600" },
};

// Source provenance — a primary (originating/official) source is emphasised
// in violet; secondary reporting is muted neutral.
export const SOURCE_KIND_META: Record<"primary" | "secondary", { label: string; chip: string }> = {
  primary: { label: "Primary", chip: "bg-violet-500/10 text-violet-300 ring-1 ring-violet-500/25" },
  secondary: { label: "Secondary", chip: "bg-neutral-800 text-neutral-500 ring-1 ring-neutral-700" },
};
