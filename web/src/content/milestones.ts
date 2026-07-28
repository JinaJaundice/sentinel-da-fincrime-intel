import type { Impact } from "../lib/uiTokens";

// Forward-looking key dates for the Regulatory Radar. Kept small and
// curated (the "recently landed" half of the radar is derived from the
// regulatory items themselves). The ingestion agent can append here too.
export interface Milestone {
  id: string;
  date: string; // ISO yyyy-mm-dd (the deadline / milestone date)
  title: string;
  blurb: string;
  region?: string;
  impact?: Impact;
  tentative?: boolean; // date is an estimate ("expected/est.")
  relatedItemId?: string;
  source?: { name: string; url: string };
}

export const MILESTONES: Milestone[] = [
  {
    id: "ms-mica-transition-end",
    date: "2026-07-01",
    title: "MiCA transitional period ends",
    blurb:
      "National grandfathering for crypto-asset service providers expires; unauthorised CASPs must cease EU activity or face enforcement.",
    region: "EU",
    impact: "high",
    relatedItemId: "mica-transition-end-2026",
    source: { name: "ESMA / InnReg", url: "https://www.innreg.com/blog/eu-crypto-regulation-guide" },
  },
  {
    id: "ms-fdic-comment-close",
    date: "2026-07-21",
    title: "FDIC stablecoin rule: comment period (est. close)",
    blurb:
      "Estimated close of the comment window on the FDIC's proposed BSA/sanctions rule for permitted payment stablecoin issuers.",
    region: "US",
    impact: "medium",
    tentative: true,
    relatedItemId: "feed-fdic-stablecoin-rule",
    source: { name: "Hunton", url: "https://www.hunton.com/blockchain-legal-resource/fdic-proposes-aml-and-sanctions-rule-for-permitted-stablecoin-issuers" },
  },
  {
    id: "ms-genius-rules-effective",
    date: "2027-04-08",
    title: "GENIUS stablecoin AML/sanctions rules expected effective",
    blurb:
      "FinCEN/OFAC final PPSI rules become effective ~12 months after issuance; the date is an estimate pending final issuance.",
    region: "US",
    impact: "high",
    tentative: true,
    relatedItemId: "feed-ofac-genius-nprm",
    source: { name: "Mayer Brown", url: "https://www.mayerbrown.com/en/insights/publications/2026/04/stable-rules-for-stablecoins-treasury-proposes-aml-and-sanctions-framework-for-issuers" },
  },
];
