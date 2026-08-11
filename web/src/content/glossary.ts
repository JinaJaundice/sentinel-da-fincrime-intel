// ---------------------------------------------------------------
// Glossary — the knowledge layer's reference vocabulary.
//
// Plain-language definitions of the jargon at the digital-asset ×
// financial-crime intersection, with the bank lens ("so what") where it
// earns its place. Definitions of standard industry terms are general
// knowledge; only the canonical frameworks carry a source link.
//
// `<Term id="…">` (components/Term.tsx) looks entries up by id or alias.
// ---------------------------------------------------------------

export type GlossaryCategory =
  | "Frameworks & rules"
  | "Authorities & lists"
  | "Actors & typologies"
  | "Controls & obligations"
  | "Assets & tech";

export interface GlossaryEntry {
  id: string; // lookup key for <Term id>
  term: string; // display label
  category: GlossaryCategory;
  short: string; // one-line definition (tooltip + glossary page)
  soWhat?: string; // the bank financial-crime lens
  aliases?: string[]; // extra lookup keys
  source?: { name: string; url: string };
}

export const GLOSSARY_CATEGORIES: GlossaryCategory[] = [
  "Frameworks & rules",
  "Authorities & lists",
  "Actors & typologies",
  "Controls & obligations",
  "Assets & tech",
];

export const GLOSSARY: GlossaryEntry[] = [
  // ---- Frameworks & rules ----
  {
    id: "fatf",
    term: "FATF",
    category: "Frameworks & rules",
    short: "The Financial Action Task Force, the global standard-setter for anti-money-laundering (AML) and counter-terrorist-financing rules.",
    source: { name: "FATF", url: "https://www.fatf-gafi.org/" },
  },
  {
    id: "travel-rule",
    term: "Travel Rule",
    category: "Frameworks & rules",
    aliases: ["recommendation 16", "r16", "rec 16"],
    short: "FATF Recommendation 16: originator and beneficiary information must 'travel' with a transfer between regulated firms, extended to crypto VASPs.",
    soWhat: "Inbound transfers from non-enforcing jurisdictions often arrive with thin data; treat data completeness as a graded risk score, never a yes/no.",
    source: { name: "FATF", url: "https://www.fatf-gafi.org/" },
  },
  {
    id: "vasp",
    term: "VASP",
    category: "Frameworks & rules",
    aliases: ["vasps"],
    short: "Virtual Asset Service Provider, FATF's term for a regulated crypto business (exchange, custodian, transfer service).",
  },
  {
    id: "va",
    term: "Virtual Asset (VA)",
    category: "Frameworks & rules",
    aliases: ["virtual asset"],
    short: "FATF's term for a digital representation of value that can be traded or transferred, i.e. a crypto-asset.",
  },
  {
    id: "mica",
    term: "MiCA",
    category: "Frameworks & rules",
    short: "Markets in Crypto-Assets, the EU's full-scope crypto framework. Its transitional period ends 1 July 2026.",
    soWhat: "Assume full CASP authorisation on EU venues from July 2026; treat any EU-facing platform still trading without it as elevated risk.",
  },
  {
    id: "casp",
    term: "CASP",
    category: "Frameworks & rules",
    short: "Crypto-Asset Service Provider, MiCA's term for an authorised crypto firm in the EU (the EU equivalent of a VASP).",
  },
  {
    id: "dac8",
    term: "DAC8",
    category: "Frameworks & rules",
    short: "An EU directive extending automatic exchange of tax information to crypto-asset transactions.",
  },
  {
    id: "carf",
    term: "CARF",
    category: "Frameworks & rules",
    short: "Crypto-Asset Reporting Framework, the OECD's global standard for tax-information reporting on crypto.",
    soWhat: "Design your data model once: Travel Rule data can do double duty for CARF/DAC8 reporting.",
  },
  {
    id: "genius-act",
    term: "GENIUS Act",
    category: "Frameworks & rules",
    short: "A 2025 US law bringing payment-stablecoin issuers under federal oversight, with AML and sanctions duties.",
    soWhat: "Stablecoin issuers are becoming regulated counterparties; align issuer-freeze playbooks and track effective dates.",
  },
  {
    id: "bsa",
    term: "Bank Secrecy Act (BSA)",
    category: "Frameworks & rules",
    aliases: ["bank secrecy act"],
    short: "The foundational US AML law; defines who counts as a regulated 'financial institution' with reporting duties.",
  },
  {
    id: "sunrise",
    term: "Sunrise issue",
    category: "Frameworks & rules",
    aliases: ["sunrise period", "sunrise gap"],
    short: "The gap while Travel Rule adoption is uneven across jurisdictions, so many transfers arrive with missing originator/beneficiary data.",
  },

  // ---- Authorities & lists ----
  {
    id: "ofac",
    term: "OFAC",
    category: "Authorities & lists",
    short: "US Office of Foreign Assets Control, which administers US sanctions and maintains the SDN list.",
    source: { name: "OFAC", url: "https://ofac.treasury.gov/" },
  },
  {
    id: "ofsi",
    term: "OFSI",
    category: "Authorities & lists",
    short: "UK Office of Financial Sanctions Implementation, the UK's financial-sanctions authority.",
  },
  {
    id: "fincen",
    term: "FinCEN",
    category: "Authorities & lists",
    short: "US Financial Crimes Enforcement Network, the US AML regulator and recipient of Suspicious Activity Reports.",
    source: { name: "FinCEN", url: "https://www.fincen.gov/" },
  },
  {
    id: "sdn",
    term: "SDN list",
    category: "Authorities & lists",
    aliases: ["sdn", "specially designated nationals"],
    short: "Specially Designated Nationals, OFAC's primary sanctions list; dealing with a listed party (or its crypto addresses) is prohibited.",
    soWhat: "Screen freshly-listed SDN crypto addresses promptly, including indirect exposure via omnibus or correspondent accounts.",
  },
  {
    id: "amla",
    term: "AMLA",
    category: "Authorities & lists",
    short: "The EU's new Anti-Money Laundering Authority, standing up direct supervision of high-risk firms.",
  },
  {
    id: "esma",
    term: "ESMA",
    category: "Authorities & lists",
    short: "European Securities and Markets Authority, which co-ordinates MiCA supervision across the EU.",
  },

  // ---- Actors & typologies ----
  {
    id: "dprk",
    term: "DPRK / Lazarus",
    category: "Actors & typologies",
    aliases: ["lazarus", "north korea"],
    short: "North Korean state-sponsored actors (e.g. the Lazarus Group) behind large-scale crypto thefts and laundering to fund the regime.",
  },
  {
    id: "mixer",
    term: "Mixer",
    category: "Actors & typologies",
    aliases: ["tumbler", "mixers"],
    short: "A service that pools and shuffles funds to break the on-chain link between source and destination.",
    soWhat: "Mixer exposure on a counterparty should gate the transfer; this is where sanctions and AML overlap most sharply.",
  },
  {
    id: "aec",
    term: "AEC",
    category: "Actors & typologies",
    aliases: ["privacy coin", "anonymity-enhancing coin"],
    short: "Anonymity-Enhancing Coin, a privacy coin (e.g. Monero) designed to obscure transaction details.",
  },
  {
    id: "chain-hopping",
    term: "Chain-hopping",
    category: "Actors & typologies",
    short: "Rapidly moving value across different blockchains to defeat single-chain tracing.",
  },
  {
    id: "bridge",
    term: "Cross-chain bridge",
    category: "Actors & typologies",
    aliases: ["bridge", "bridges", "cross-chain"],
    short: "Infrastructure that moves value between blockchains; used legitimately, but also to chain-hop and break tracing continuity.",
  },
  {
    id: "layering",
    term: "Layering",
    category: "Actors & typologies",
    short: "The laundering stage that obscures the origin of funds through many transfers and conversions.",
  },
  {
    id: "pig-butchering",
    term: "Pig-butchering",
    category: "Actors & typologies",
    short: "A long-con investment/romance scam that grooms victims over time before draining their crypto.",
  },
  {
    id: "approval-phishing",
    term: "Approval-phishing",
    category: "Actors & typologies",
    short: "Tricking a victim into signing a token 'approval' that lets the attacker drain their wallet at will.",
  },
  {
    id: "laas",
    term: "Laundering-as-a-service",
    category: "Actors & typologies",
    aliases: ["laundering-as-a-service", "clmn"],
    short: "Professional networks that launder proceeds for many unrelated criminal groups for a fee, a shared illicit back-office.",
    soWhat: "Seemingly unrelated crimes converge through the same wallet clusters; cross-entity cluster analytics beats direct attribution.",
  },

  // ---- Controls & obligations ----
  {
    id: "kyc",
    term: "KYC",
    category: "Controls & obligations",
    short: "Know Your Customer: verifying a customer's identity and risk at onboarding and on an ongoing basis.",
  },
  {
    id: "kyt",
    term: "KYT",
    category: "Controls & obligations",
    short: "Know Your Transaction: screening on-chain transactions and counterparties for illicit exposure.",
    soWhat: "Single-chain KYT misses cross-chain layering; coverage must follow value across bridges.",
  },
  {
    id: "edd",
    term: "CDD / EDD",
    category: "Controls & obligations",
    aliases: ["cdd", "due diligence"],
    short: "Customer and Enhanced Due Diligence: the baseline and the heightened checks applied to higher-risk relationships.",
  },
  {
    id: "sar",
    term: "SAR / STR",
    category: "Controls & obligations",
    aliases: ["str", "suspicious activity report"],
    short: "Suspicious Activity / Transaction Report: the filing a regulated firm makes when it identifies likely illicit activity.",
  },
  {
    id: "transaction-monitoring",
    term: "Transaction monitoring",
    category: "Controls & obligations",
    short: "Automated screening of activity against rules and known typologies to surface suspicious behaviour.",
  },
  {
    id: "source-of-funds",
    term: "Source of funds",
    category: "Controls & obligations",
    aliases: ["source of wealth", "sof"],
    short: "Evidence of where specific funds came from (distinct from overall source of wealth).",
  },
  {
    id: "primary-source",
    term: "Primary source",
    category: "Controls & obligations",
    aliases: ["primary"],
    short: "An original, authoritative source: the regulator's notice, the court filing, or the issuer's own statement.",
    soWhat: "Weight primary sources highest for client-facing claims; corroborate secondary reporting before relying on it.",
  },
  {
    id: "secondary-source",
    term: "Secondary source",
    category: "Controls & obligations",
    aliases: ["secondary"],
    short: "Reporting or analysis about an event (news, vendor research), one step from the original document.",
  },
  {
    id: "issuer-freeze",
    term: "Issuer freeze",
    category: "Controls & obligations",
    aliases: ["freeze", "clawback"],
    short: "A stablecoin issuer's power to freeze or burn tokens at specific addresses, a fast disruption lever in the secondary market.",
    soWhat: "Weight freeze capability heavily in vendor and counterparty assessment, and build the muscle to coordinate freezes.",
  },

  // ---- Assets & tech ----
  {
    id: "stablecoin",
    term: "Stablecoin",
    category: "Assets & tech",
    aliases: ["stablecoins", "usdt", "tether"],
    short: "A crypto token pegged to a fiat currency; now the dominant rail for both legitimate and illicit crypto value.",
    soWhat: "Issuer freeze powers are both your biggest exposure and your fastest disruption lever; build the muscle to trace stablecoin flows.",
  },
  {
    id: "dex",
    term: "DEX",
    category: "Assets & tech",
    short: "Decentralised Exchange: peer-to-peer token swapping via smart contracts, without a custodial intermediary.",
  },
  {
    id: "on-chain-analytics",
    term: "On-chain analytics",
    category: "Assets & tech",
    aliases: ["blockchain analytics", "kyt analytics"],
    short: "Tools that trace and attribute blockchain flows (e.g. Chainalysis, TRM, Elliptic) to assess illicit exposure.",
  },
];

export const GLOSSARY_BY_KEY: Record<string, GlossaryEntry> = (() => {
  const m: Record<string, GlossaryEntry> = {};
  for (const e of GLOSSARY) {
    m[e.id.toLowerCase()] = e;
    for (const a of e.aliases ?? []) m[a.toLowerCase()] = e;
  }
  return m;
})();
