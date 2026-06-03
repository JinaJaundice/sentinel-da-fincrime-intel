// Curated source registry for the Phase-2 ingestion agent.
//
// Reputable, link-friendly sources at the digital-asset × financial-crime
// intersection. The agent monitors these, drafts `pending` Items, and a
// human approves. Licensing rule: summarise + link, never republish
// paywalled report bodies.

import type { ItemType } from "../web/src/content/types";

export interface SourceDef {
  name: string;
  url: string;
  /** Default content type this source tends to produce. */
  defaultType: ItemType;
  /** Coarse cadence hint for the scheduler. */
  cadence: "daily" | "weekly" | "event";
  region?: string;
  notes?: string;
}

export const SOURCES: SourceDef[] = [
  // --- Standards / FATF ---
  { name: "FATF — VA/VASP updates", url: "https://www.fatf-gafi.org/", defaultType: "regulatory", cadence: "event", region: "Global" },

  // --- Regulators ---
  { name: "ESMA — MiCA", url: "https://www.esma.europa.eu/", defaultType: "regulatory", cadence: "event", region: "EU" },
  { name: "US FinCEN", url: "https://www.fincen.gov/", defaultType: "regulatory", cadence: "event", region: "US" },
  { name: "OFAC — sanctions / SDN", url: "https://ofac.treasury.gov/", defaultType: "regulatory", cadence: "event", region: "US", notes: "Designations feed mixer/AEC typologies" },
  { name: "UK FCA", url: "https://www.fca.org.uk/", defaultType: "regulatory", cadence: "event", region: "UK" },

  // --- Tax transparency ---
  { name: "OECD — CARF", url: "https://www.oecd.org/tax/exchange-of-tax-information/", defaultType: "signal", cadence: "event", region: "Global" },

  // --- Threat intelligence (summaries + links only) ---
  { name: "Chainalysis — blog", url: "https://www.chainalysis.com/blog/", defaultType: "signal", cadence: "weekly", region: "Global" },
  { name: "TRM Labs — insights", url: "https://www.trmlabs.com/resources", defaultType: "signal", cadence: "weekly", region: "Global" },
  { name: "Elliptic — research", url: "https://www.elliptic.co/blog", defaultType: "signal", cadence: "weekly", region: "Global" },
  { name: "Kroll — financial crime", url: "https://www.kroll.com/en/insights", defaultType: "signal", cadence: "weekly", region: "Global" },

  // --- Travel Rule ---
  { name: "Notabene", url: "https://notabene.id/", defaultType: "solution", cadence: "event", region: "Global" },
  { name: "Sumsub — Travel Rule", url: "https://sumsub.com/", defaultType: "solution", cadence: "event", region: "Global" },

  // --- Trade press (headline + link) ---
  { name: "CoinDesk — policy", url: "https://www.coindesk.com/policy/", defaultType: "signal", cadence: "daily", region: "Global" },
  { name: "The Block", url: "https://www.theblock.co/", defaultType: "venture", cadence: "daily", region: "Global", notes: "Funding rounds / M&A" },
  { name: "DL News — regulation", url: "https://www.dlnews.com/", defaultType: "signal", cadence: "daily", region: "Global" },
];
