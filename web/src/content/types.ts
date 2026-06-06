import type { Impact } from "../lib/uiTokens";

// ---------------------------------------------------------------
// One content model, many views.
//
// Every tracked thing — a news signal, a regulatory move, a funding
// round, a vendor, a laundering typology — is the SAME shape with a
// `type` discriminator. Each tab is just a filtered view over this one
// store, and the ingestion agent only ever has to emit `Item`s. That is
// what keeps the app decluttered as it grows.
// ---------------------------------------------------------------

export type ItemType = "signal" | "regulatory" | "venture" | "solution" | "typology";

export type Status = "published" | "pending" | "rejected";

export type AddedBy = "agent" | "human";

export type SolutionStance = "in-use" | "shortlist" | "evaluate" | "watch";

// How confident we are in the item itself — distinct from `impact` (severity).
export type Confidence = "high" | "medium" | "low";

export interface Source {
  name: string;
  url?: string;
  /** primary = the official / originating document; secondary = reporting or analysis about it. */
  kind?: "primary" | "secondary";
}

export interface Item {
  id: string;
  type: ItemType;
  title: string;
  /** 1–2 sentence synthesis. */
  summary: string;
  /** The bank financial-crime lens — the differentiator vs. a news feed. */
  soWhat?: string;
  /** Event / publication date (ISO yyyy-mm-dd). */
  date: string;
  /** When it entered Sentinel (ISO yyyy-mm-dd). */
  addedAt: string;
  addedBy: AddedBy;
  status: Status;
  region?: string;
  impact?: Impact;
  /** Trust in the item, separate from impact. Optional; shown as a subtle signal. */
  confidence?: Confidence;
  /** A human has reviewed and vouched for this item. Never set by the agent. */
  verified?: boolean;
  tags: string[];
  sources: Source[];

  // ---- type-specific extras (optional; populated per `type`) ----
  venture?: {
    company?: string;
    round?: string;
    amount?: string;
    investors?: string[];
  };
  solution?: {
    vendor: string;
    category: string;
    stance: SolutionStance;
    note?: string;
  };
  typology?: {
    vector: string;
    controls: string[];
    obligations: string[];
  };
}
