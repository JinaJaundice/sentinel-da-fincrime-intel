// ---------------------------------------------------------------
// Crypto-regulation atlas — curated, sourced status per jurisdiction.
// Reference data alongside the Item store (like themes.ts / glossary.ts),
// consumed by the Atlas world-map view. `iso` are ISO-3166 numeric codes
// matching the world-atlas topojson (a bloc like the EU lists all members);
// `lat`/`lon` place the clickable marker. Status uses the palette: violet
// (implemented), amber (in progress), neutral (none / restrictive).
// ---------------------------------------------------------------

export type RegStatus = "implemented" | "in-progress" | "none";

export interface Jurisdiction {
  id: string;
  name: string;
  iso: string[]; // country polygons to tint (numeric ISO)
  lat: number;
  lon: number;
  status: RegStatus;
  headline: string;
  summary: string;
  soWhat?: string;
  keyDates?: { date: string; label: string }[];
  sources: { name: string; url: string }[];
}

export const STATUS_META: Record<RegStatus, { label: string; chip: string; fill: string; dot: string; order: number }> = {
  implemented: {
    label: "Implemented",
    chip: "bg-violet-500/15 text-violet-200 ring-1 ring-violet-500/30",
    fill: "rgba(139,92,246,0.55)",
    dot: "#a78bfa",
    order: 0,
  },
  "in-progress": {
    label: "In progress",
    chip: "bg-amber-500/10 text-amber-300 ring-1 ring-amber-500/25",
    fill: "rgba(245,158,11,0.42)",
    dot: "#fbbf24",
    order: 1,
  },
  none: {
    label: "None / restrictive",
    chip: "bg-neutral-800 text-neutral-400 ring-1 ring-neutral-700",
    fill: "rgba(113,113,122,0.4)",
    dot: "#a1a1aa",
    order: 2,
  },
};

const EU_MEMBERS = [
  "040", "056", "100", "191", "196", "203", "208", "233", "246", "250", "276", "300", "348", "372",
  "380", "428", "440", "442", "470", "528", "616", "620", "642", "703", "705", "724", "752",
];

const sumsub = { name: "Sumsub — global crypto regulations 2026", url: "https://sumsub.com/blog/global-crypto-regulations/" };

export const JURISDICTIONS: Jurisdiction[] = [
  {
    id: "eu",
    name: "European Union",
    iso: EU_MEMBERS,
    lat: 50.5,
    lon: 9.0,
    status: "implemented",
    headline: "MiCA — comprehensive regime in force",
    summary:
      "MiCA is the world's most comprehensive crypto framework, fully in force since 30 Dec 2024. The transitional grandfathering period ends 1 July 2026, after which unauthorised CASPs must cease EU activity.",
    soWhat: "Treat EU venues as requiring full CASP authorisation from July 2026 — any EU-facing platform still trading without it is elevated risk.",
    keyDates: [{ date: "2026-07-01", label: "Grandfathering ends" }],
    sources: [
      { name: "ESMA — MiCA", url: "https://www.esma.europa.eu/esmas-activities/digital-finance-and-innovation/markets-crypto-assets-regulation-mica" },
    ],
  },
  {
    id: "uk",
    name: "United Kingdom",
    iso: ["826"],
    lat: 54.0,
    lon: -2.4,
    status: "in-progress",
    headline: "FCA regime being phased in",
    summary:
      "The FCA is consulting on and phasing in a full cryptoasset regime (stablecoins, custody, trading, conduct), with the authorisation gateway expected from ~September 2026 and the full FSMA regime around October 2027.",
    soWhat: "The bright line between authorised and unauthorised UK crypto counterparties is being drawn now — track the gateway and treat unlicensed activity as a red flag.",
    keyDates: [{ date: "2027-10-01", label: "Full regime (expected)" }],
    sources: [{ name: "FCA — new cryptoasset regime", url: "https://www.fca.org.uk/firms/new-regime-cryptoasset-regulation" }],
  },
  {
    id: "us",
    name: "United States",
    iso: ["840"],
    lat: 39.5,
    lon: -98.5,
    status: "in-progress",
    headline: "Stablecoin law passed; market structure pending",
    summary:
      "Fragmented oversight (SEC, CFTC, FinCEN, OFAC). The GENIUS Act brought payment stablecoins under federal AML/sanctions duties, but a comprehensive market-structure framework is still in progress.",
    soWhat: "Stablecoin issuers are becoming regulated counterparties; the wider perimeter stays uncertain — monitor agency-by-agency developments.",
    sources: [sumsub],
  },
  {
    id: "singapore",
    name: "Singapore",
    iso: ["702"],
    lat: 1.35,
    lon: 103.8,
    status: "implemented",
    headline: "MAS Payment Services Act + stablecoin framework",
    summary:
      "MAS regulates digital-payment-token services under the Payment Services Act and is enforcing its single-currency stablecoin framework (SCS 2.0) in 2026, with reserve, redemption and capital requirements.",
    soWhat: "A mature, principles-based regime — Singapore-licensed VASPs are comparatively well-supervised counterparties.",
    sources: [{ name: "MAS", url: "https://www.mas.gov.sg/" }, sumsub],
  },
  {
    id: "hong-kong",
    name: "Hong Kong",
    iso: ["344"],
    lat: 22.3,
    lon: 114.17,
    status: "implemented",
    headline: "VASP licensing + Stablecoin Ordinance",
    summary:
      "The SFC runs a mandatory VASP licensing regime, and the Stablecoin Ordinance (passed May 2025) requires an HKMA licence to issue or distribute fiat-backed stablecoins to the public.",
    soWhat: "Clear licensing perimeter — confirm a Hong Kong counterparty's SFC/HKMA authorisation status.",
    sources: [{ name: "HKMA", url: "https://www.hkma.gov.hk/eng/" }, sumsub],
  },
  {
    id: "uae",
    name: "United Arab Emirates",
    iso: ["784"],
    lat: 23.8,
    lon: 54.0,
    status: "implemented",
    headline: "VARA + CBUAE payment-token regime",
    summary:
      "Dubai's VARA licenses virtual-asset activities, and the Central Bank's Payment Token Services Regulation (effective Aug 2024) governs fiat-backed stablecoin issuance and redemption on the mainland.",
    soWhat: "Multiple regulators by emirate — confirm which licence (VARA / ADGM / CBUAE) a UAE counterparty actually holds.",
    sources: [{ name: "CBUAE", url: "https://www.centralbank.ae/en/" }, sumsub],
  },
  {
    id: "japan",
    name: "Japan",
    iso: ["392"],
    lat: 36.5,
    lon: 138.2,
    status: "implemented",
    headline: "Payment Services Act — licensed issuers",
    summary:
      "Japan regulates crypto-exchange service providers under the Payment Services Act; only banks, trust companies and licensed money-transfer firms may issue yen-backed stablecoins, under strict reserve and redemption rules.",
    soWhat: "One of the longest-standing regimes — Japanese-licensed exchanges are tightly supervised.",
    sources: [{ name: "JFSA", url: "https://www.fsa.go.jp/en/" }, sumsub],
  },
  {
    id: "switzerland",
    name: "Switzerland",
    iso: ["756"],
    lat: 46.8,
    lon: 8.2,
    status: "implemented",
    headline: "DLT Act + FINMA framework",
    summary:
      "Switzerland's DLT Act and FINMA guidance provide a clear, token-classification-based framework; stablecoins face full-reserve, licensed-issuer and redemption expectations.",
    soWhat: "Mature, predictable regime — Swiss-licensed crypto firms are well-understood counterparties.",
    sources: [{ name: "FINMA", url: "https://www.finma.ch/en/" }, sumsub],
  },
  {
    id: "south-africa",
    name: "South Africa",
    iso: ["710"],
    lat: -29.0,
    lon: 24.0,
    status: "implemented",
    headline: "FSCA licensing + Travel Rule live",
    summary:
      "The FSCA treats crypto assets as financial products and had approved ~300 crypto licences by end-2025; a zero-threshold Travel Rule took effect in early 2026.",
    soWhat: "Africa's most advanced regime — licensed SA VASPs operate under Travel Rule obligations.",
    sources: [sumsub],
  },
  {
    id: "brazil",
    name: "Brazil",
    iso: ["076"],
    lat: -12.0,
    lon: -52.0,
    status: "implemented",
    headline: "Central Bank VASP framework (Nov 2025)",
    summary:
      "In November 2025 the Central Bank of Brazil implemented a regulatory framework for Virtual Asset Service Providers, establishing licensing and strict AML/CFT rules.",
    soWhat: "A fresh but comprehensive regime — Brazilian VASPs now sit under central-bank licensing.",
    keyDates: [{ date: "2025-11-01", label: "VASP framework in force" }],
    sources: [sumsub],
  },
  {
    id: "canada",
    name: "Canada",
    iso: ["124"],
    lat: 58.0,
    lon: -100.0,
    status: "implemented",
    headline: "Securities-led platform registration",
    summary:
      "Crypto trading platforms must register with provincial securities regulators (under the CSA), with crypto largely supervised through securities and AML (FINTRAC) rules.",
    soWhat: "Province-by-province securities oversight — check a Canadian platform's CSA registration.",
    sources: [sumsub],
  },
  {
    id: "australia",
    name: "Australia",
    iso: ["036"],
    lat: -25.3,
    lon: 133.8,
    status: "in-progress",
    headline: "Digital-asset framework being developed",
    summary:
      "Crypto is legal and treated as an investment asset; Treasury and ASIC are developing a dedicated digital-asset-platform licensing framework, still being finalised.",
    soWhat: "Bespoke licensing is coming but not yet in force — current oversight leans on existing financial-services rules.",
    sources: [sumsub],
  },
  {
    id: "south-korea",
    name: "South Korea",
    iso: ["410"],
    lat: 36.5,
    lon: 127.8,
    status: "in-progress",
    headline: "VASP licensing live; basic law pending",
    summary:
      "Real-name accounts, VASP licensing and AML duties are in force, but the comprehensive Digital Asset Basic Law is stalled over control of won-pegged stablecoin issuance.",
    soWhat: "Strong AML/licensing today, but the full framework — especially for stablecoins — is unsettled.",
    sources: [sumsub],
  },
  {
    id: "nigeria",
    name: "Nigeria",
    iso: ["566"],
    lat: 9.1,
    lon: 8.7,
    status: "in-progress",
    headline: "SEC VASP registration developing",
    summary:
      "High retail adoption; the SEC is building out a VASP registration regime focused on investor protection and controlling capital flows.",
    soWhat: "An evolving regime in a high-adoption market — counterparty diligence should not assume mature supervision.",
    sources: [sumsub],
  },
  {
    id: "india",
    name: "India",
    iso: ["356"],
    lat: 22.5,
    lon: 79.0,
    status: "in-progress",
    headline: "Taxed + AML-registered; no full framework",
    summary:
      "Crypto is taxed (30% gains, 1% TDS) and VASPs must register with FIU-IND for AML, but no comprehensive regulatory framework has been enacted.",
    soWhat: "Activity is tolerated and taxed, not comprehensively regulated — treat the absence of a conduct regime as a risk factor.",
    sources: [sumsub],
  },
  {
    id: "el-salvador",
    name: "El Salvador",
    iso: ["222"],
    lat: 13.8,
    lon: -88.9,
    status: "implemented",
    headline: "Bitcoin Law (amended 2025)",
    summary:
      "El Salvador has a dedicated digital-asset framework and a national Bitcoin office; under an IMF deal it amended the 2021 Bitcoin Law in 2025, removing mandatory merchant acceptance.",
    soWhat: "A bespoke pro-crypto regime, but recently walked back — watch for further IMF-driven changes.",
    keyDates: [{ date: "2025-02-01", label: "Bitcoin Law amended" }],
    sources: [sumsub],
  },
  {
    id: "russia",
    name: "Russia",
    iso: ["643"],
    lat: 61.5,
    lon: 90.0,
    status: "in-progress",
    headline: "Mining legal; domestic payments banned",
    summary:
      "Russia legalised and regulates crypto mining but bans domestic crypto payments; it permits crypto in cross-border trade under an experimental regime, partly to work around sanctions.",
    soWhat: "Sanctions-evasion nexus — treat Russian crypto activity, especially cross-border settlement, as elevated risk.",
    sources: [sumsub],
  },
  {
    id: "china",
    name: "China",
    iso: ["156"],
    lat: 35.9,
    lon: 104.2,
    status: "none",
    headline: "Trading & mining banned",
    summary:
      "Mainland China bans crypto trading and mining; policymakers are researching tightly-controlled yuan-backed stablecoins for cross-border settlement, but no permissive framework exists.",
    soWhat: "No legitimate onshore crypto activity — any China-nexus crypto flow warrants heightened scrutiny.",
    sources: [sumsub],
  },
];
