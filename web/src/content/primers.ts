// ---------------------------------------------------------------
// Typology primers — the knowledge layer for the Intelligence tab.
//
// Each typology Item is terse (vector + controls + obligations). The
// primer is the plain-language "how it works / what to watch" that turns
// the library into a teaching tool. Keyed by Item id; `terms` surfaces
// the relevant glossary entries as inline <Term> chips. Items without a
// primer simply don't show one (graceful — e.g. future agent typologies).
// ---------------------------------------------------------------

export interface TypologyPrimer {
  how: string;
  terms?: string[]; // glossary ids
}

export const TYPOLOGY_PRIMERS: Record<string, TypologyPrimer> = {
  "typ-cross-chain-bridge": {
    how: "Launderers move value across different blockchains through bridges and decentralised exchanges, converting and re-converting so the trail breaks at each hop. Because most tools reason about one chain at a time, a single-chain view loses the thread the moment funds cross over. Detection has to reconstruct the journey across chains and score bridge exposure rather than inspect deposits in isolation.",
    terms: ["bridge", "chain-hopping", "kyt", "layering", "dex"],
  },
  "typ-mixer-aec": {
    how: "Mixers pool many users' funds and pay out unrelated coins to sever the link between source and destination; privacy coins achieve similar opacity at the protocol level. Because several mixers are themselves sanctioned, exposure raises an AML and a sanctions flag at once. Any interaction with a mixer or privacy-coin service in a counterparty's history should gate the transfer for review.",
    terms: ["mixer", "aec", "sdn", "ofac", "sar"],
  },
  "typ-travel-rule-data-gaps": {
    how: "The Travel Rule requires originator and beneficiary details to accompany a transfer, but adoption is uneven, so transfers from firms in non-enforcing jurisdictions often arrive with missing or low-quality data. That thin data degrades every downstream screening check. The fix is to treat completeness as a graded risk signal that raises monitoring sensitivity, with a fallback workflow to collect what is missing.",
    terms: ["travel-rule", "sunrise", "vasp", "edd"],
  },
  "typ-stablecoin-rails": {
    how: "Stablecoins have become the preferred laundering rail for their speed, liquidity and dollar peg, so illicit value increasingly moves as tokens rather than native crypto. Unusually, the issuer can often freeze or burn tokens at a flagged address, a disruption lever banks lack on most assets. Building the capability to trace stablecoin flows and coordinate freezes turns the biggest exposure into the fastest response.",
    terms: ["stablecoin", "issuer-freeze", "transaction-monitoring", "kyt"],
  },
  "feed-dprk-it-workers": {
    how: "North Korean operatives pose as remote IT contractors using stolen or fabricated identities, earning wages that are then laundered through crypto to fund the regime. The tell is rarely on-chain alone; it surfaces as mismatches between a worker's claimed location and their IP, payment routing, or identity documents. Pairing behavioural KYC red flags with screening of designated address clusters is what catches it.",
    terms: ["dprk", "kyc", "sdn", "layering"],
  },
  "feed-chinese-mln-laas-typology": {
    how: "Chinese-language money-laundering networks operate as a professional, fee-charging back-office that cleans proceeds for many unrelated criminal groups, from romance scams to ransomware to state actors. Because the same wallet clusters serve everyone, seemingly unrelated crimes converge on shared infrastructure. Detection depends on cross-entity cluster analytics rather than one-to-one attribution, plus feeding advertised service wallets into screening.",
    terms: ["laas", "on-chain-analytics", "stablecoin", "layering"],
  },
  "feed-pig-butchering-ai-evolution-2026": {
    how: "Pig-butchering is a long-con scam that grooms a victim through a fabricated relationship before steering them into a bogus investment and draining their wallet. The 2026 evolution adds AI-driven grooming at scale and approval-phishing, where the victim unknowingly signs a token approval that hands the attacker drain rights. Watch for victim-side behavioural signals and for approval transactions to freshly-seen contracts.",
    terms: ["pig-butchering", "approval-phishing", "kyt", "transaction-monitoring"],
  },
  "feed-ransomware-bridge-laundering-shift": {
    how: "As sanctioned mixers became riskier to touch, ransomware crews shifted their laundering toward cross-chain bridges, hopping tokens across chains before converging on an exchange deposit. Detection rules anchored to mixer flags grow stale against this pattern. Monitoring needs to flag multi-hop cross-chain sequences, and rising ransomware activity means more of these flows, and more SARs, reaching the banking system.",
    terms: ["bridge", "chain-hopping", "mixer", "sar"],
  },
};
