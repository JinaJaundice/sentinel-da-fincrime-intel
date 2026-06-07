import type { Item } from "./types";

// ---------------------------------------------------------------
// Seed intelligence — a real, sourced starting set (June 2026).
//
// Integrity rules for this file (and for the agent that will append to
// it): cite a source for every factual claim; never fabricate specific
// enforcement actions or financings; label anything illustrative.
// The single invented item below is explicitly marked "[Illustrative]".
// Everything auto-publishes (Phase 2) — there is no review queue.
// ---------------------------------------------------------------

export const ITEMS: Item[] = [
  // ---------------- Regulatory ----------------
  {
    id: "mica-transition-end-2026",
    type: "regulatory",
    title: "ESMA confirms MiCA transitional period ends 1 July 2026",
    summary:
      "ESMA reconfirmed (17 Apr 2026) that national grandfathering for crypto-asset service providers expires on 1 July 2026; unauthorised CASPs must cease EU activity or face enforcement. EU MiCA penalties have exceeded €540m since enforcement began.",
    soWhat:
      "Counterparty due diligence on EU venues should assume full CASP authorisation from 1 July — treat any EU-facing platform still trading without it as elevated risk.",
    date: "2026-04-17",
    addedAt: "2026-05-28",
    addedBy: "human",
    status: "published",
    verified: true,
    confidence: "high",
    region: "EU",
    impact: "high",
    tags: ["MiCA", "CASP", "licensing"],
    sources: [
      { name: "ESMA", url: "https://www.esma.europa.eu/", kind: "primary" },
      { name: "InnReg — EU crypto regulation guide", url: "https://www.innreg.com/blog/eu-crypto-regulation-guide", kind: "secondary" },
      { name: "AMLWatcher — 2026 regulatory map", url: "https://amlwatcher.com/blog/aml-compliance-crypto-exchanges-2026-regulatory-map/", kind: "secondary" },
    ],
  },
  {
    id: "eu-enforcement-offshore-2026",
    type: "regulatory",
    title: "EU regulators escalate: France issues 14 notices, BaFin blocks 6 offshore domains",
    summary:
      "Q4 2025 saw France issue 14 enforcement notices and Germany's BaFin block access to six offshore exchange domains that targeted EU users without CASP authorisation.",
    soWhat:
      "Customers routed to newly-blocked offshore CASPs are a fresh monitoring signal — worth a targeted lookback on outbound flows to those venues.",
    date: "2026-05-20",
    addedAt: "2026-05-28",
    addedBy: "agent",
    status: "published",
    region: "EU",
    impact: "medium",
    tags: ["enforcement", "CASP", "market-access"],
    sources: [
      { name: "AMLWatcher — 2026 regulatory map", url: "https://amlwatcher.com/blog/aml-compliance-crypto-exchanges-2026-regulatory-map/" },
    ],
  },
  {
    id: "fatf-travel-rule-sunrise-2026",
    type: "regulatory",
    title: "FATF: Travel Rule live in 85 of 117 jurisdictions, but enforcement lags",
    summary:
      "Per FATF's June 2025 Targeted Update, 99 of 117 assessed jurisdictions are legislating the Travel Rule and 85 have enacted it — yet ~59% with laws have taken no supervisory action. The 'sunrise' gap is closing but persists.",
    soWhat:
      "Inbound transfers from VASPs in non-enforcing jurisdictions still arrive with thin originator/beneficiary data — keep counterparty data-quality scoring inside the Travel Rule workflow.",
    date: "2026-05-12",
    addedAt: "2026-05-28",
    addedBy: "agent",
    status: "published",
    region: "Global",
    impact: "high",
    tags: ["FATF", "travel-rule", "sunrise", "VASP"],
    sources: [
      { name: "Sumsub — FATF Travel Rule 2026", url: "https://sumsub.com/blog/what-is-the-fatf-travel-rule/", kind: "secondary" },
      { name: "TRM Labs — Global Crypto Policy 2025/26", url: "https://www.trmlabs.com/reports-and-whitepapers/global-crypto-policy-review-outlook-2025-26" },
    ],
  },
  {
    id: "genius-act-stablecoin-bsa",
    type: "regulatory",
    title: "GENIUS Act pulls payment stablecoins under the Bank Secrecy Act",
    summary:
      "The July 2025 GENIUS Act brought payment stablecoins under the BSA, mandating customer due diligence, transaction monitoring, SAR filing and OFAC screening for issuers.",
    soWhat:
      "Regulated issuers reduce some counterparty risk, but raise the bar on your own sanctions screening of stablecoin rails — issuer freeze/clawback should be in the playbook.",
    date: "2026-05-05",
    addedAt: "2026-05-28",
    addedBy: "agent",
    status: "published",
    region: "US",
    impact: "high",
    tags: ["stablecoin", "GENIUS-Act", "BSA", "OFAC"],
    sources: [
      { name: "Grant Thornton — Crypto compliance 2026", url: "https://www.grantthornton.com/insights/articles/banking/2026/crypto-compliance-in-2026" },
      { name: "AMLBot — AML crypto compliance guide", url: "https://blog.amlbot.com/aml-crypto-regulations-compliance-guide-for-businesses/" },
    ],
  },

  // ---------------- Signals ----------------
  {
    id: "kroll-illicit-flows-record-2025",
    type: "signal",
    title: "Kroll: crypto-linked illicit flows hit record highs in 2025",
    summary:
      "Kroll reports money-laundering and crypto-linked illicit flows surged to record highs in 2025, with little sign of slowing into 2026.",
    soWhat:
      "A rising base rate of illicit flow means more genuine true positives — revisit transaction-monitoring threshold calibration before alert volumes outrun the team.",
    date: "2026-05-26",
    addedAt: "2026-05-29",
    addedBy: "agent",
    status: "published",
    region: "Global",
    impact: "high",
    tags: ["threat-intel", "stablecoins", "AML"],
    sources: [
      { name: "Kroll — The money-laundering surge", url: "https://www.kroll.com/en/publications/financial-compliance-regulation/the-money-laundering-surge-crypto-enforcement-gaps", kind: "secondary" },
    ],
  },
  {
    id: "trm-beacon-network",
    type: "signal",
    title: "TRM Beacon Network expands real-time flagged-address sharing",
    summary:
      "TRM's Beacon Network facilitates real-time sharing of flagged wallet addresses among exchanges and law enforcement, shortening attribution latency across members.",
    soWhat:
      "Membership in address-sharing networks is becoming a KYT vendor differentiator — factor it into any analytics build-vs-buy.",
    date: "2026-05-18",
    addedAt: "2026-05-29",
    addedBy: "agent",
    status: "published",
    region: "Global",
    impact: "medium",
    tags: ["information-sharing", "KYT", "attribution"],
    sources: [
      { name: "AMLWatcher — 2026 regulatory map", url: "https://amlwatcher.com/blog/aml-compliance-crypto-exchanges-2026-regulatory-map/" },
    ],
  },
  {
    id: "carf-dac8-transparency",
    type: "signal",
    title: "CARF + DAC8 add a tax-transparency layer over the Travel Rule",
    summary:
      "The OECD Crypto-Asset Reporting Framework and EU DAC8 layer automatic tax-information exchange on top of MiCA and the Travel Rule, widening reporting obligations on crypto-asset service providers.",
    soWhat:
      "Reporting obligations are converging — data collected for the Travel Rule increasingly does double duty for CARF/DAC8; design the data model once.",
    date: "2026-05-09",
    addedAt: "2026-05-29",
    addedBy: "agent",
    status: "published",
    region: "EU",
    impact: "medium",
    tags: ["CARF", "DAC8", "tax-transparency", "reporting"],
    sources: [
      { name: "CIAT — CARF, MiCA, DAC8 & the Travel Rule", url: "https://www.ciat.org/carf-mica-dac-8-the-travel-rule-move-towards-greater-transparency-in-the-crypto-asset-market/?lang=en" },
    ],
  },

  // ---------------- Ventures ----------------
  {
    id: "travel-rule-network-coverage-2026",
    type: "venture",
    title: "Travel Rule networks now span 2,000+ VASPs",
    summary:
      "Travel-Rule messaging networks operated by providers such as Notabene and Sumsub now cover more than 2,000 VASPs, improving counterparty reachability.",
    soWhat:
      "Network coverage is the metric that decides Travel Rule interoperability — the more counterparties reachable, the fewer manual fallbacks your ops team handles.",
    date: "2026-05-22",
    addedAt: "2026-05-29",
    addedBy: "agent",
    status: "published",
    region: "Global",
    impact: "medium",
    tags: ["travel-rule", "interoperability", "network"],
    venture: { company: "Notabene / Sumsub networks", round: "Market coverage", amount: "2,000+ VASPs" },
    sources: [
      { name: "Sumsub — FATF Travel Rule 2026", url: "https://sumsub.com/blog/what-is-the-fatf-travel-rule/", kind: "secondary" },
    ],
  },
  {
    id: "regtech-investment-2026",
    type: "venture",
    title: "Institutional crypto-compliance RegTech keeps attracting capital",
    summary:
      "Market trackers and industry awards (e.g. BeInCrypto's 2026 selection of digital-asset compliance firms) point to continued investment in compliance infrastructure serving institutional crypto through 2025–26.",
    soWhat:
      "Capital is still flowing into compliance infra — a standing signal to keep scanning for acquirable capability versus building it in-house.",
    date: "2026-05-15",
    addedAt: "2026-05-29",
    addedBy: "agent",
    status: "published",
    region: "Global",
    impact: "low",
    tags: ["regtech", "investment", "institutional"],
    sources: [
      { name: "BeInCrypto — 15 digital-asset compliance firms", url: "https://beincrypto.com/top-digital-asset-compliance-firms/" },
    ],
  },

  // ---------------- Solutions (vendor & build-vs-buy landscape) ----------------
  {
    id: "sol-inhouse-daml-canton",
    type: "solution",
    title: "In-house Travel Rule workflow — Daml on Canton",
    summary:
      "The build option in the live build-vs-buy decision: a Travel Rule workflow expressed as Daml contracts on Canton, enforcing originator/beneficiary exchange on-ledger as part of the compliance engine.",
    soWhat:
      "Maximises control and on-ledger auditability and avoids per-message vendor fees; the cost is build + maintenance and bootstrapping counterparty network coverage.",
    date: "2026-05-30",
    addedAt: "2026-05-30",
    addedBy: "human",
    status: "published",
    verified: true,
    confidence: "high",
    region: "Internal",
    impact: "high",
    tags: ["build", "travel-rule", "canton", "daml", "on-ledger"],
    solution: { vendor: "In-house (Daml on Canton)", category: "Travel Rule", stance: "in-use", note: "On-ledger enforcement, single pane of glass" },
    sources: [],
  },
  {
    id: "sol-notabene",
    type: "solution",
    title: "Notabene — Travel Rule & pre-settlement authorisation",
    summary:
      "Notabene focuses on pre-settlement counterparty coordination; its Transaction Authorization Protocol (TAP) coordinates signed transfer requests and encrypted messaging before a transaction settles on-chain.",
    soWhat:
      "The buy option to weigh against the in-house Daml workflow — TAP's pre-settlement model is the closest external analogue to on-ledger enforcement.",
    date: "2026-05-30",
    addedAt: "2026-05-30",
    addedBy: "human",
    status: "published",
    verified: true,
    confidence: "high",
    region: "Global",
    impact: "high",
    tags: ["buy", "travel-rule", "vendor"],
    solution: { vendor: "Notabene", category: "Travel Rule", stance: "evaluate", note: "Pre-settlement authorisation (TAP)" },
    sources: [
      { name: "Flash — Elliptic/Chainalysis/TRM comparison", url: "https://paywithflash.com/elliptic-chainalysis-trm-labs-tool-comparison/" },
      { name: "InnReg — Crypto Travel Rule guide", url: "https://www.innreg.com/blog/crypto-travel-rule-guide" },
    ],
  },
  {
    id: "sol-chainalysis",
    type: "solution",
    title: "Chainalysis — blockchain analytics / KYT",
    summary:
      "The most-deployed blockchain analytics platform across regulated crypto firms (Coinbase, Kraken, Binance entities, Bitstamp), strong on breadth of coverage.",
    soWhat:
      "De-facto standard for KYT breadth — a safe primary, but pair with attribution-depth players for stablecoin and alt-L1 coverage.",
    date: "2026-05-30",
    addedAt: "2026-05-30",
    addedBy: "human",
    status: "published",
    verified: true,
    confidence: "high",
    region: "Global",
    impact: "medium",
    tags: ["KYT", "analytics", "vendor"],
    solution: { vendor: "Chainalysis", category: "Blockchain analytics (KYT)", stance: "shortlist", note: "Most-deployed across regulated firms" },
    sources: [
      { name: "finconduit — analytics providers compared", url: "https://finconduit.com/resources/blockchain-analytics-providers-compared" },
    ],
  },
  {
    id: "sol-elliptic",
    type: "solution",
    title: "Elliptic — cross-chain monitoring (Lens)",
    summary:
      "Elliptic unifies transaction monitoring and wallet screening into Lens, optimised for a single path from alert to decision with strong cross-chain coverage.",
    soWhat:
      "Attractive where you want one analyst workflow from alert to decision; assess cross-chain coverage against your customers' actual chain mix.",
    date: "2026-05-30",
    addedAt: "2026-05-30",
    addedBy: "human",
    status: "published",
    verified: true,
    confidence: "high",
    region: "Global",
    impact: "medium",
    tags: ["KYT", "analytics", "vendor", "cross-chain"],
    solution: { vendor: "Elliptic", category: "Blockchain analytics (KYT)", stance: "evaluate", note: "Lens — unified cross-chain monitoring" },
    sources: [
      { name: "finconduit — analytics providers compared", url: "https://finconduit.com/resources/blockchain-analytics-providers-compared" },
    ],
  },
  {
    id: "sol-trm",
    type: "solution",
    title: "TRM Labs — attribution depth & stablecoin tracing",
    summary:
      "TRM offers strong attribution on Solana, Tron and Polygon, notable stablecoin flow-tracing, and the Beacon Network for address sharing; integrates with Notabene/Veriscope for Travel Rule data exchange.",
    soWhat:
      "Strong fit if your risk is concentrated in stablecoins and high-throughput chains; the Travel Rule integrations ease a hybrid build-vs-buy.",
    date: "2026-05-30",
    addedAt: "2026-05-30",
    addedBy: "human",
    status: "published",
    verified: true,
    confidence: "high",
    region: "Global",
    impact: "medium",
    tags: ["KYT", "analytics", "vendor", "stablecoins"],
    solution: { vendor: "TRM Labs", category: "Blockchain analytics (KYT)", stance: "evaluate", note: "Attribution depth + Beacon Network" },
    sources: [
      { name: "finconduit — analytics providers compared", url: "https://finconduit.com/resources/blockchain-analytics-providers-compared" },
      { name: "Flash — Elliptic/Chainalysis/TRM comparison", url: "https://paywithflash.com/elliptic-chainalysis-trm-labs-tool-comparison/" },
    ],
  },

  // ---------------- Typologies (Intelligence) ----------------
  {
    id: "typ-cross-chain-bridge",
    type: "typology",
    title: "Cross-chain bridge laundering",
    summary:
      "Funds are moved across heterogeneous chains via bridges and DEXs to break tracing continuity (chain-hopping), defeating single-chain analytics.",
    soWhat:
      "Single-chain KYT misses this — coverage must follow value across bridges, or layering walks straight through the gap.",
    date: "2026-05-24",
    addedAt: "2026-05-29",
    addedBy: "human",
    status: "published",
    verified: true,
    confidence: "high",
    region: "Global",
    impact: "high",
    tags: ["bridges", "chain-hopping", "laundering"],
    typology: {
      vector: "Cross-chain bridges & chain-hopping",
      controls: ["Cross-chain KYT", "Bridge-exposure scoring", "Hold on high-bridge-exposure deposits"],
      obligations: ["SAR on layering patterns", "Source-of-funds evidence"],
    },
    sources: [
      { name: "Elliptic — what is crypto AML compliance", url: "https://www.elliptic.co/blockchain-basics/what-is-crypto-aml-compliance", kind: "secondary" },
    ],
  },
  {
    id: "typ-mixer-aec",
    type: "typology",
    title: "Mixer & anonymity-enhancing-coin exposure",
    summary:
      "FATF continues to flag anonymity-enhancing technologies (mixers, privacy coins) that raise ML/TF risk; the sanctioned-mixer nexus keeps this a live screening obligation.",
    soWhat:
      "Any mixer/AEC exposure on a counterparty should gate the transfer for review — this is where sanctions and AML overlap most sharply.",
    date: "2026-05-21",
    addedAt: "2026-05-29",
    addedBy: "human",
    status: "published",
    verified: true,
    confidence: "high",
    region: "Global",
    impact: "high",
    tags: ["mixers", "AEC", "sanctions"],
    typology: {
      vector: "Mixers & anonymity-enhancing tech",
      controls: ["Sanctioned-mixer exposure screening", "AEC interaction thresholds", "EDD on mixer-adjacent counterparties"],
      obligations: ["OFAC / UN sanctions screening", "SAR on obfuscation"],
    },
    sources: [
      { name: "Sumsub — FATF Travel Rule 2026", url: "https://sumsub.com/blog/what-is-the-fatf-travel-rule/", kind: "secondary" },
    ],
  },
  {
    id: "typ-travel-rule-data-gaps",
    type: "typology",
    title: "Travel Rule data-quality gaps",
    summary:
      "Transfers from VASPs in non-enforcing jurisdictions arrive with missing or low-quality originator/beneficiary data, undermining screening downstream.",
    soWhat:
      "Treat data completeness as a risk score, not a yes/no — incomplete Travel Rule data should raise the monitoring sensitivity on the counterparty.",
    date: "2026-05-17",
    addedAt: "2026-05-29",
    addedBy: "human",
    status: "published",
    verified: true,
    confidence: "high",
    region: "Global",
    impact: "medium",
    tags: ["travel-rule", "data-quality", "sunrise"],
    typology: {
      vector: "Travel Rule data gaps (sunrise)",
      controls: ["Counterparty VASP due diligence", "Originator/beneficiary completeness scoring", "Fallback collection workflow"],
      obligations: ["Travel Rule data completeness", "Recordkeeping"],
    },
    sources: [
      { name: "Sumsub — FATF Travel Rule 2026", url: "https://sumsub.com/blog/what-is-the-fatf-travel-rule/", kind: "secondary" },
    ],
  },
  {
    id: "typ-stablecoin-rails",
    type: "typology",
    title: "Stablecoin-rail illicit flows",
    summary:
      "Stablecoins are now a primary laundering rail (record 2025 volumes), valued for speed and liquidity; issuer freeze powers create a disruption opportunity.",
    soWhat:
      "Build the muscle to trace and coordinate issuer freezes on stablecoins — it is both your biggest exposure and your fastest disruption lever.",
    date: "2026-05-13",
    addedAt: "2026-05-29",
    addedBy: "human",
    status: "published",
    verified: true,
    confidence: "high",
    region: "Global",
    impact: "high",
    tags: ["stablecoins", "rails", "tracing"],
    typology: {
      vector: "Stablecoin-rail illicit flows",
      controls: ["Stablecoin flow tracing", "Issuer freeze/clawback coordination", "High-velocity stablecoin alerts"],
      obligations: ["Transaction monitoring", "SAR"],
    },
    sources: [
      { name: "Kroll — The money-laundering surge", url: "https://www.kroll.com/en/publications/financial-compliance-regulation/the-money-laundering-surge-crypto-enforcement-gaps", kind: "secondary" },
    ],
  },

  // ---------------- Formerly-"pending" agent drafts — now auto-published (Phase 2) ----------------
  {
    id: "pending-fatf-plenary",
    type: "regulatory",
    title: "FATF plenary expected to revisit VASP enforcement gap",
    summary:
      "Agent-drafted from policy trackers: the next FATF plenary cycle is expected to keep pressure on jurisdictions lagging on Travel Rule supervision and AEC controls. Confidence: medium — confirm against the primary FATF source before publishing.",
    soWhat:
      "If confirmed, supervisory expectations tighten — pre-empt with counterparty data-quality scoring already in place.",
    date: "2026-06-01",
    addedAt: "2026-06-02",
    addedBy: "agent",
    status: "published",
    region: "Global",
    impact: "medium",
    tags: ["FATF", "plenary", "agenda"],
    sources: [
      { name: "TRM Labs — Global Crypto Policy 2025/26", url: "https://www.trmlabs.com/reports-and-whitepapers/global-crypto-policy-review-outlook-2025-26" },
    ],
  },
  {
    id: "pending-nominis",
    type: "solution",
    title: "Nominis — VASP-native analytics alternative",
    summary:
      "Agent-flagged emerging alternative positioning itself against TRM/Elliptic/Chainalysis, built specifically for VASP workflows. Confidence: medium — capability claims unverified.",
    soWhat:
      "Worth a watching brief as a potential challenger and price-anchor in the KYT shortlist.",
    date: "2026-06-01",
    addedAt: "2026-06-02",
    addedBy: "agent",
    status: "published",
    region: "Global",
    impact: "low",
    tags: ["vendor", "VASP", "analytics"],
    solution: { vendor: "Nominis", category: "Blockchain analytics (KYT)", stance: "watch", note: "VASP-native alternative" },
    sources: [
      { name: "Nominis — TRM/Elliptic/Chainalysis alternative", url: "https://www.nominis.io/insights/nominis-the-trm-labs-elliptic-and-chainalysis-alternative-made-for-vasps" },
    ],
  },

  // ---------------- FCA publications (crypto + financial crime) ----------------
  // Real FCA papers — primary sources (fca.org.uk), human-curated → verified.
  {
    id: "fca-cp25-14",
    type: "regulatory",
    title: "FCA CP25/14: Stablecoin issuance and cryptoasset custody",
    summary:
      "The FCA's proposed rules and guidance for issuing qualifying (fiat-referenced) stablecoins and safeguarding qualifying cryptoassets — the first detailed UK conduct rulebook for stablecoins and custody (feedback closed 31 Jul 2025; final rules expected 2026).",
    soWhat:
      "Sets the UK bar for stablecoin issuers and custodians a bank may face as counterparties — fold backing-asset, redemption and safeguarding expectations into counterparty due diligence and any in-house stablecoin/custody build.",
    date: "2025-05-28",
    addedAt: "2026-06-07",
    addedBy: "human",
    status: "published",
    verified: true,
    confidence: "high",
    region: "UK",
    impact: "high",
    tags: ["FCA", "UK", "stablecoin", "custody", "crypto"],
    publication: { issuer: "FCA", kind: "Consultation Paper", ref: "CP25/14" },
    sources: [
      { name: "FCA — CP25/14", url: "https://www.fca.org.uk/publications/consultation-papers/cp25-14-stablecoin-issuance-cryptoasset-custody", kind: "primary" },
    ],
  },
  {
    id: "fca-cp25-15",
    type: "regulatory",
    title: "FCA CP25/15: A prudential regime for cryptoasset firms",
    summary:
      "Proposals for a prudential regime — capital, liquidity and risk-management requirements — for FCA-authorised cryptoasset firms, published alongside CP25/14.",
    soWhat:
      "Prudential soundness of crypto counterparties becomes assessable against a UK standard — weigh capital/liquidity expectations into counterparty risk on crypto firms you face.",
    date: "2025-05-28",
    addedAt: "2026-06-07",
    addedBy: "human",
    status: "published",
    verified: true,
    confidence: "high",
    region: "UK",
    impact: "medium",
    tags: ["FCA", "UK", "prudential", "crypto"],
    publication: { issuer: "FCA", kind: "Consultation Paper", ref: "CP25/15" },
    sources: [
      { name: "FCA — CP25/15", url: "https://www.fca.org.uk/publications/consultation-papers/cp25-15-prudential-regime-cryptoasset-firms", kind: "primary" },
    ],
  },
  {
    id: "fca-dp24-4",
    type: "regulatory",
    title: "FCA DP24/4: Regulating cryptoassets — admissions & disclosures and market abuse",
    summary:
      "FCA discussion paper seeking views on a cryptoasset admissions & disclosures regime and a market abuse regime for cryptoassets, to reduce consumer harm and build trust in UK crypto markets.",
    soWhat:
      "Foreshadows UK market-abuse obligations on crypto venues — an early signal of the surveillance and disclosure expectations that will shape which venues are bankable.",
    date: "2024-12-16",
    addedAt: "2026-06-07",
    addedBy: "human",
    status: "published",
    verified: true,
    confidence: "high",
    region: "UK",
    impact: "medium",
    tags: ["FCA", "UK", "market-abuse", "disclosures", "crypto"],
    publication: { issuer: "FCA", kind: "Discussion Paper", ref: "DP24/4" },
    sources: [
      { name: "FCA — DP24/4", url: "https://www.fca.org.uk/publications/discussion-papers/dp24-4-regulating-cryptoassets", kind: "primary" },
    ],
  },
  {
    id: "fca-cp25-40",
    type: "regulatory",
    title: "FCA CP25/40: Regulating cryptoasset activities",
    summary:
      "Part of the FCA's December 2025 consultation trilogy: proposed conduct rules for the core regulated cryptoasset activities under the forthcoming UK regime, including the authorisation gateway.",
    soWhat:
      "Defines who must be FCA-authorised to offer crypto activities in the UK — sharpens the bright line between authorised and unauthorised crypto counterparties ahead of the ~Oct 2027 regime.",
    date: "2025-12-16",
    addedAt: "2026-06-07",
    addedBy: "human",
    status: "published",
    verified: true,
    confidence: "high",
    region: "UK",
    impact: "high",
    tags: ["FCA", "UK", "authorisation", "crypto"],
    publication: { issuer: "FCA", kind: "Consultation Paper", ref: "CP25/40" },
    sources: [
      { name: "FCA — CP25/40", url: "https://www.fca.org.uk/publications/consultation-papers/cp25-40-regulating-cryptoasset-activities", kind: "primary" },
    ],
  },
  {
    id: "fca-cp25-41",
    type: "regulatory",
    title: "FCA CP25/41: Cryptoasset admissions & disclosures and market abuse regime",
    summary:
      "FCA consultation proposing the cryptoasset admissions & disclosures framework and a market abuse regime for cryptoassets, turning DP24/4 feedback into draft rules.",
    soWhat:
      "A UK market-abuse regime for crypto raises the surveillance bar on listed cryptoassets — relevant to any bank facilitating market access or relying on venue integrity.",
    date: "2025-12-16",
    addedAt: "2026-06-07",
    addedBy: "human",
    status: "published",
    verified: true,
    confidence: "high",
    region: "UK",
    impact: "high",
    tags: ["FCA", "UK", "market-abuse", "disclosures", "crypto"],
    publication: { issuer: "FCA", kind: "Consultation Paper", ref: "CP25/41" },
    sources: [
      { name: "FCA — CP25/41", url: "https://www.fca.org.uk/publications/consultation-papers/cp25-41-regulating-cryptoassets-admissions-disclosures-market-abuse-regime-cryptoassets", kind: "primary" },
    ],
  },
  {
    id: "fca-ps24-17",
    type: "regulatory",
    title: "FCA PS24/17: Financial Crime Guide updates",
    summary:
      "Finalised updates to the FCA's Financial Crime Guide covering sanctions, proliferation financing, transaction monitoring and cryptoassets — confirming what the FCA expects of firms' financial-crime systems and controls.",
    soWhat:
      "This is the FCA's stated yardstick for financial-crime systems and controls — align sanctions, proliferation-financing and transaction-monitoring frameworks (including crypto exposure) to the updated Guide.",
    date: "2024-11-29",
    addedAt: "2026-06-07",
    addedBy: "human",
    status: "published",
    verified: true,
    confidence: "high",
    region: "UK",
    impact: "high",
    tags: ["FCA", "UK", "financial-crime", "AML", "sanctions", "proliferation-financing"],
    publication: { issuer: "FCA", kind: "Policy Statement", ref: "PS24/17" },
    sources: [
      { name: "FCA — PS24/17", url: "https://www.fca.org.uk/publications/policy-statements/ps24-17-financial-crime-guide-updates", kind: "primary" },
    ],
  },
  {
    id: "fca-dp23-4",
    type: "regulatory",
    title: "FCA DP23/4: Regulating cryptoassets Phase 1 — stablecoins",
    summary:
      "The FCA's first discussion paper on regulating fiat-backed stablecoins — issuance, custody and use as a means of payment — opening the UK's phased crypto-regime design.",
    soWhat:
      "The origin of the UK stablecoin rulebook; the baseline the later CP25/14 rules build on when judging how UK stablecoin expectations have evolved.",
    date: "2023-11-06",
    addedAt: "2026-06-07",
    addedBy: "human",
    status: "published",
    verified: true,
    confidence: "high",
    region: "UK",
    impact: "medium",
    tags: ["FCA", "UK", "stablecoin", "crypto"],
    publication: { issuer: "FCA", kind: "Discussion Paper", ref: "DP23/4" },
    sources: [
      { name: "FCA — DP23/4", url: "https://www.fca.org.uk/publications/discussion-papers/dp23-4-regulating-cryptoassets-phase-1-stablecoins", kind: "primary" },
    ],
  },
  {
    id: "fca-dp25-1",
    type: "regulatory",
    title: "FCA DP25/1: Regulating cryptoasset activities",
    summary:
      "FCA discussion paper on its proposed approach to regulating cryptoasset trading platforms, intermediaries, lending/borrowing, staking, DeFi and the use of credit to buy crypto.",
    soWhat:
      "Signals where conduct rules will land across crypto market structure — an early read on which crypto activities and counterparties will fall in scope of UK authorisation.",
    date: "2025-05-02",
    addedAt: "2026-06-07",
    addedBy: "human",
    status: "published",
    verified: true,
    confidence: "high",
    region: "UK",
    impact: "medium",
    tags: ["FCA", "UK", "crypto", "DeFi", "staking", "lending"],
    publication: { issuer: "FCA", kind: "Discussion Paper", ref: "DP25/1" },
    sources: [
      { name: "FCA — DP25/1", url: "https://www.fca.org.uk/publications/discussion-papers/dp25-1-regulating-cryptoasset-activities", kind: "primary" },
    ],
  },
  {
    id: "fca-cp25-25",
    type: "regulatory",
    title: "FCA CP25/25: Application of the FCA Handbook to regulated cryptoasset activities",
    summary:
      "FCA consultation on how its existing Handbook — high-level standards, SYSC, business standards — will apply to firms carrying out the new regulated cryptoasset activities, covering governance, consumer protection and financial-crime prevention.",
    soWhat:
      "Sets the conduct and systems-and-controls bar incoming crypto firms must meet — including financial-crime prevention — shaping which crypto counterparties can be credibly compliant.",
    date: "2025-09-17",
    addedAt: "2026-06-07",
    addedBy: "human",
    status: "published",
    verified: true,
    confidence: "high",
    region: "UK",
    impact: "high",
    tags: ["FCA", "UK", "crypto", "handbook", "SYSC", "financial-crime"],
    publication: { issuer: "FCA", kind: "Consultation Paper", ref: "CP25/25" },
    sources: [
      { name: "FCA — CP25/25", url: "https://www.fca.org.uk/publications/consultation-papers/cp25-25-application-handbook-regulated-cryptoasset-activities", kind: "primary" },
    ],
  },
  {
    id: "fca-cp25-42",
    type: "regulatory",
    title: "FCA CP25/42: A prudential regime for cryptoasset firms",
    summary:
      "December 2025 consultation refining the proposed prudential regime — capital, liquidity and risk management — for FCA-authorised cryptoasset firms, building on CP25/15.",
    soWhat:
      "Firms up the capital/liquidity yardstick for crypto counterparties — factor prudential resilience into crypto counterparty risk assessments.",
    date: "2025-12-16",
    addedAt: "2026-06-07",
    addedBy: "human",
    status: "published",
    verified: true,
    confidence: "high",
    region: "UK",
    impact: "medium",
    tags: ["FCA", "UK", "crypto", "prudential"],
    publication: { issuer: "FCA", kind: "Consultation Paper", ref: "CP25/42" },
    sources: [
      { name: "FCA — CP25/42", url: "https://www.fca.org.uk/publications/consultation-papers/cp25-42-prudential-regime-cryptoasset-firms", kind: "primary" },
    ],
  },
  {
    id: "fca-cp26-4",
    type: "regulatory",
    title: "FCA CP26/4: Application of the FCA Handbook to regulated cryptoasset activities — part 2",
    summary:
      "Part 2 of the FCA's Handbook-application consultation for regulated cryptoasset firms — consumer protection, dispute resolution, conduct standards and safeguarding requirements.",
    soWhat:
      "Defines the safeguarding and conduct duties crypto firms will owe clients — relevant to assessing the custody/safeguarding robustness of crypto counterparties.",
    date: "2026-01-23",
    addedAt: "2026-06-07",
    addedBy: "human",
    status: "published",
    verified: true,
    confidence: "high",
    region: "UK",
    impact: "medium",
    tags: ["FCA", "UK", "crypto", "safeguarding", "conduct", "handbook"],
    publication: { issuer: "FCA", kind: "Consultation Paper", ref: "CP26/4" },
    sources: [
      { name: "FCA — CP26/4", url: "https://www.fca.org.uk/publications/consultation-papers/cp26-4-application-handbook-regulated-cryptoasset-activities-II", kind: "primary" },
    ],
  },
  {
    id: "fca-gc26-2",
    type: "regulatory",
    title: "FCA GC26/2: Applying the Consumer Duty to cryptoasset firms",
    summary:
      "FCA guidance consultation on how cryptoasset firms should apply the Consumer Duty to their regulated activities, ahead of the authorisation gateway opening in September 2026.",
    soWhat:
      "Extends the Consumer Duty conduct bar to crypto — a marker of the fair-value and consumer-outcome standard UK-authorised crypto firms must meet.",
    date: "2026-01-23",
    addedAt: "2026-06-07",
    addedBy: "human",
    status: "published",
    verified: true,
    confidence: "high",
    region: "UK",
    impact: "medium",
    tags: ["FCA", "UK", "crypto", "consumer-duty", "conduct"],
    publication: { issuer: "FCA", kind: "Guidance Consultation", ref: "GC26/2" },
    sources: [
      { name: "FCA — GC26/2", url: "https://www.fca.org.uk/publications/guidance-consultations/gc26-2-application-consumer-duty-cryptoasset-firms", kind: "primary" },
    ],
  },
  {
    id: "fca-cp26-13",
    type: "regulatory",
    title: "FCA CP26/13: Cryptoasset perimeter guidance",
    summary:
      "FCA consultation on draft perimeter guidance clarifying when authorisation is required for regulated cryptoasset activities (feedback by 3 Jun 2026), ahead of the gateway opening in September 2026.",
    soWhat:
      "Draws the bright line on what crypto activity needs FCA authorisation — directly informs which crypto counterparties must be authorised, and when 'unauthorised' becomes a red flag.",
    date: "2026-04-15",
    addedAt: "2026-06-07",
    addedBy: "human",
    status: "published",
    verified: true,
    confidence: "high",
    region: "UK",
    impact: "high",
    tags: ["FCA", "UK", "crypto", "perimeter", "authorisation"],
    publication: { issuer: "FCA", kind: "Consultation Paper", ref: "CP26/13" },
    sources: [
      { name: "FCA — CP26/13", url: "https://www.fca.org.uk/publications/consultation-papers/cp26-13-cryptoasset-perimeter-guidance", kind: "primary" },
    ],
  },
];
