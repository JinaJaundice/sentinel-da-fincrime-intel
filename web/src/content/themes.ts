import { Coins, Ban, ArrowLeftRight, Landmark, Flag, ShieldAlert, type LucideIcon } from "lucide-react";
import type { Item } from "./types";
import { MILESTONES, type Milestone } from "./milestones";

// Themes are a curated lens over the one item store — no parallel data.
// A theme matches an item by tag overlap or a keyword in title/summary, so
// it keeps populating as the agent publishes new items. Each carries a
// plain-language "what you need to know" primer (the knowledge value) that
// doubles as the intro to a client briefing.
export interface Theme {
  id: string;
  label: string;
  tagline: string; // one-liner for the card
  primer: string; // the "what you need to know"
  Icon: LucideIcon;
  tags: string[]; // lowercase tag matches
  keywords: string[]; // lowercase substring matches (title + summary + tags)
}

export const THEMES: Theme[] = [
  {
    id: "stablecoins",
    label: "Stablecoins",
    tagline: "The primary laundering rail, and the fastest-moving rulebook.",
    primer:
      "Stablecoins are now the dominant illicit-value rail in crypto (FATF put them at ~84% of illicit virtual-asset volume in 2025). The regulatory response is converging fast: the US GENIUS Act plus FinCEN/OFAC and FDIC rulemakings pull payment-stablecoin issuers under bank-grade AML and sanctions duties, while FATF wants issuers able to freeze, burn or withdraw in the secondary market. For a bank, issuer freeze powers are both your biggest exposure and your fastest disruption lever; weight freeze capability heavily in vendor and counterparty assessment, and build the muscle to trace stablecoin flows.",
    Icon: Coins,
    tags: ["stablecoin", "stablecoins", "usdt", "genius-act", "fdic", "ppsi"],
    keywords: ["stablecoin", "usdt", "tether", "genius act", "payment stablecoin"],
  },
  {
    id: "sanctions",
    label: "Sanctions & OFAC",
    tagline: "From listing wallets to designating whole exchanges.",
    primer:
      "Crypto sanctions enforcement has shifted from listing individual wallets to designating entire exchanges and infrastructure: Iran's Nobitex and CBI-linked wallets, the UK OFSI's first Regulation-17A crypto actions, the post-Tornado-Cash sanctioned-mixer nexus. Designations increasingly target stablecoin rails and state actors. For a bank, screen freshly-listed SDN crypto addresses promptly, watch for exposure to designated venues even indirectly via omnibus or correspondent accounts, and confirm your controls can act on an issuer freeze.",
    Icon: Ban,
    tags: ["ofac", "sanctions", "sdn", "iran", "dprk", "irgc", "ofsi"],
    keywords: ["sanction", "ofac", "ofsi", "sdn", "designat", "nobitex", "tornado"],
  },
  {
    id: "travel-rule",
    label: "Travel Rule",
    tagline: "Originator/beneficiary data that's still only half-enforced.",
    primer:
      "FATF Recommendation 16 requires originator and beneficiary information to travel with VASP transfers, but enforcement is uneven: the 'sunrise' gap (≈85 of 117 jurisdictions enacted, ~59% not yet enforcing) means inbound transfers often arrive with thin data. Messaging networks (Notabene, Sumsub) provide interoperability; the build-vs-buy call (e.g. an in-house Daml-on-Canton workflow) hinges on counterparty reachability and on-ledger enforceability. For a bank, treat Travel Rule data completeness as a risk score rather than a yes/no, and raise monitoring sensitivity on counterparties with incomplete data.",
    Icon: ArrowLeftRight,
    tags: ["travel-rule", "fatf", "vasp", "sunrise", "recommendation-15", "interoperability", "carf", "dac8"],
    keywords: ["travel rule", "vasp", "originator", "beneficiary", "sunrise", "recommendation 1"],
  },
  {
    id: "mica-eu",
    label: "MiCA & the EU",
    tagline: "1 July 2026 cutoff, AMLA standing up, tax-transparency layered on.",
    primer:
      "MiCA is the world's most comprehensive crypto framework; its transitional period ends 1 July 2026, after which unauthorised CASPs must cease EU activity or face enforcement (EU MiCA penalties already exceed €540m). The new EU AML authority, AMLA, is standing up direct supervision, and CARF/DAC8 layer automatic tax-information exchange on top. For a bank, assume full CASP authorisation on EU venues from July, treat any EU-facing platform still trading without it as elevated risk, and design your data model once so Travel Rule data does double duty for CARF/DAC8.",
    Icon: Landmark,
    tags: ["mica", "casp", "licensing", "amla", "dac8", "carf", "esma"],
    keywords: ["mica", "casp", "amla", "esma", "european union", "dac8", "carf", "grandfathering"],
  },
  {
    id: "us-rules",
    label: "US rulemaking",
    tagline: "Stablecoin issuers becoming BSA financial institutions.",
    primer:
      "The US is assembling the stablecoin rulebook quickly: the July 2025 GENIUS Act plus joint FinCEN/OFAC and FDIC proposed rules treat payment-stablecoin issuers as Bank Secrecy Act 'financial institutions' with explicit sanctions-compliance duties, and Treasury is pushing 'programmable', on-protocol enforcement. Final rules typically take effect ~12 months after issuance. For a bank, stablecoin issuers are becoming regulated counterparties; align issuer-freeze playbooks now and track the effective-date timelines.",
    Icon: Flag,
    tags: ["genius-act", "fincen", "fdic", "bsa", "ppsi"],
    keywords: ["fincen", "fdic", "bank secrecy act", "genius act", "treasury", "programmable", "ppsi"],
  },
  {
    id: "state-actors",
    label: "State actors & DPRK",
    tagline: "Sanctions evasion + laundering at state scale.",
    primer:
      "State-sponsored crypto crime blends sanctions evasion with laundering at scale: DPRK IT-worker payroll schemes ($800m in 2024) and bridge/mixer laundering, plus Iran's exchange ecosystem (Nobitex, CBI-linked flows). For a bank, pair behavioural KYC red flags (location/IP mismatch on contractor payouts) with screening of designated address clusters, and treat any nexus to these actors as an immediate escalation.",
    Icon: ShieldAlert,
    tags: ["dprk", "iran", "irgc", "nobitex"],
    keywords: ["dprk", "north korea", "lazarus", "it worker", "it-worker", "iran", "irgc", "nobitex"],
  },
];

export function itemMatchesTheme(i: Item, t: Theme): boolean {
  const tags = i.tags.map((x) => x.toLowerCase());
  if (t.tags.some((tag) => tags.includes(tag))) return true;
  const hay = (i.title + " " + i.summary + " " + i.tags.join(" ")).toLowerCase();
  return t.keywords.some((k) => hay.includes(k));
}

export function themeItems(items: Item[], t: Theme): Item[] {
  return items
    .filter((i) => i.status === "published" && itemMatchesTheme(i, t))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function themeMilestones(t: Theme): Milestone[] {
  return MILESTONES.filter((m) => {
    const hay = (m.title + " " + m.blurb).toLowerCase();
    return t.tags.some((tag) => hay.includes(tag)) || t.keywords.some((k) => hay.includes(k));
  });
}
