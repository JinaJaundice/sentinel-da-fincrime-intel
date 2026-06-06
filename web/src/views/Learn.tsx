import { useState, type ReactNode } from "react";
import {
  GraduationCap,
  BookMarked,
  ExternalLink,
  Search,
  Lightbulb,
  Compass,
  Send,
  ShieldCheck,
  LayoutDashboard,
  Shapes,
  Newspaper,
  TrendingUp,
  Boxes,
  Crosshair,
  CalendarClock,
  Radio,
  type LucideIcon,
} from "lucide-react";
import type { Page } from "../components/Sidebar";
import { PageHeader } from "../components/PageHeader";
import { Panel, IconTile, SectionHeading } from "../lib/ui";
import { Term } from "../components/Term";
import { GLOSSARY, GLOSSARY_CATEGORIES, type GlossaryEntry } from "../content/glossary";
import { cn } from "../lib/utils";

// The knowledge hub: a guided "start here" path for newcomers + the
// glossary. Typology primers live on Intelligence; this is the front door.
const STREAM_TOUR: { page: Page; label: string; desc: string; Icon: LucideIcon }[] = [
  { page: "brief", label: "Overview", desc: "Today's briefing — what changed and what's most pressing.", Icon: LayoutDashboard },
  { page: "themes", label: "Themes", desc: "Topic briefings — the picture organised for learning or client delivery.", Icon: Shapes },
  { page: "signals", label: "Signals", desc: "News, regulation and enforcement across DA financial crime.", Icon: Newspaper },
  { page: "ventures", label: "Ventures", desc: "Funding, M&A and market moves in the space.", Icon: TrendingUp },
  { page: "solutions", label: "Solutions", desc: "The vendor landscape and the build-vs-buy call.", Icon: Boxes },
  { page: "intelligence", label: "Intelligence", desc: "The laundering-typology library, with how each one works.", Icon: Crosshair },
  { page: "radar", label: "Radar", desc: "Key regulatory dates ahead.", Icon: CalendarClock },
  { page: "activity", label: "Activity", desc: "What the agent has published, newest first.", Icon: Radio },
];

export function Learn({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <div className="space-y-6">
      <PageHeader
        Icon={GraduationCap}
        title="Start here"
        subtitle="New to the digital-asset × financial-crime beat? This is the front door — how to read Sentinel, find your way around, and turn intel into delivery."
      />

      {/* Thesis */}
      <Panel className="p-4 border-l-2 border-violet-500/50">
        <div className="text-[11px] uppercase tracking-[0.14em] text-violet-300/80 font-medium mb-1.5">What Sentinel is</div>
        <p className="text-[13px] sm:text-sm text-neutral-300 leading-relaxed font-light">
          Not another crypto news feed — an intelligence layer with a <span className="text-neutral-100">bank financial-crime
          point of view</span>. Every item states the <span className="text-neutral-100">"So what"</span>: what a development
          means for a regulated institution's posture. One content model powers every view; an agent drafts the monitoring, and
          human judgement makes it credible.
        </p>
      </Panel>

      {/* How to read an item */}
      <div>
        <SectionHeading Icon={Lightbulb} title="Read an item in three parts" sub="The same anatomy across every stream" />
        <Panel className="p-4 space-y-2.5">
          <AnatomyRow n={1} label="Summary" body="What happened, in one or two sentences." />
          <AnatomyRow
            n={2}
            label="So what"
            body="The bank lens — the exposure it creates or the response it implies. This is the part you can't get from a news feed."
            accent
          />
          <AnatomyRow n={3} label="Sources & impact" body="Every item links a real source; the High / Medium / Low chip is its risk weight." />
        </Panel>
      </div>

      {/* Trust signals */}
      <div>
        <SectionHeading Icon={ShieldCheck} title="Judge what you can rely on" sub="Trust signals on every item — built for client-facing work" />
        <Panel className="p-4 space-y-2.5">
          <TrustRow
            Icon={ShieldCheck}
            label="Verified"
            body="A human has reviewed and vouched for the item (a violet shield). Agent-published items stay unverified until someone vouches — filter any stream to 'Verified only' to build a client pack."
            accent
          />
          <TrustRow
            label="Confidence"
            body="How certain we are in the item itself — High, Medium or Low (a small dot). Distinct from impact, which is severity."
          />
          <TrustRow
            label="Source provenance"
            body={
              <>
                Each source is tagged a <Term id="primary-source">primary</Term> (official / originating) or{" "}
                <Term id="secondary-source">secondary</Term> (reporting / analysis) source.
              </>
            }
          />
        </Panel>
      </div>

      {/* Core concepts */}
      <div>
        <SectionHeading Icon={BookMarked} title="The core concepts" sub="Hover any dotted term for a definition" />
        <Panel className="p-4">
          <p className="text-[13px] text-neutral-300 leading-relaxed font-light">
            Most of the beat turns on a handful of ideas: the <Term id="travel-rule">Travel Rule</Term> and its{" "}
            <Term id="sunrise">sunrise</Term> gap, <Term id="stablecoin">stablecoin</Term> rails and{" "}
            <Term id="issuer-freeze">issuer-freeze</Term> powers, the EU's <Term id="mica">MiCA</Term> regime, sanctions via{" "}
            <Term id="ofac">OFAC</Term> and the <Term id="sdn">SDN list</Term>, and cross-chain{" "}
            <Term id="bridge">bridge</Term> laundering. The full vocabulary is in the glossary below; the{" "}
            <button onClick={() => setPage("themes")} className="text-violet-300 hover:text-violet-200 underline underline-offset-2">
              Themes
            </button>{" "}
            pages turn each into a ready-made briefing.
          </p>
        </Panel>
      </div>

      {/* Stream tour */}
      <div>
        <SectionHeading Icon={Compass} title="Find your way around" sub="Eight views over one content model — jump straight in" />
        <div className="grid sm:grid-cols-2 gap-2.5">
          {STREAM_TOUR.map((s) => (
            <button
              key={s.page}
              onClick={() => setPage(s.page)}
              className="surface surface-hover rounded-xl p-3 flex items-start gap-3 text-left"
            >
              <IconTile Icon={s.Icon} tone="neutral" size="sm" />
              <span className="min-w-0">
                <span className="block text-[13px] text-neutral-100 leading-none">{s.label}</span>
                <span className="block text-[11px] text-neutral-500 font-light leading-snug mt-1">{s.desc}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Deliver it */}
      <div>
        <SectionHeading Icon={Send} title="Turn intel into delivery" sub="Sentinel is built for client work, not just reading" />
        <Panel className="p-4">
          <ul className="space-y-1.5 text-[13px] text-neutral-300 font-light">
            <li className="flex gap-2"><span className="text-violet-400">•</span> Copy a <span className="text-neutral-100">citation</span> or a <span className="text-neutral-100">deck bullet</span> from any item.</li>
            <li className="flex gap-2"><span className="text-violet-400">•</span> Build a <span className="text-neutral-100">briefing pack</span> across views, then export a one-pager.</li>
            <li className="flex gap-2"><span className="text-violet-400">•</span> Export any <span className="text-neutral-100">stream or theme</span> to Markdown or CSV.</li>
          </ul>
        </Panel>
      </div>

      <Glossary />
    </div>
  );
}

function AnatomyRow({ n, label, body, accent }: { n: number; label: string; body: string; accent?: boolean }) {
  return (
    <div className="flex items-start gap-3">
      <span
        className={cn(
          "grid place-items-center w-5 h-5 rounded-full text-[11px] font-semibold shrink-0 tabular-nums",
          accent ? "bg-violet-500/20 text-violet-200 ring-1 ring-violet-500/30" : "bg-neutral-800 text-neutral-400 ring-1 ring-neutral-700",
        )}
      >
        {n}
      </span>
      <p className="text-[13px] leading-snug">
        <span className={cn("font-medium", accent ? "text-violet-200" : "text-neutral-100")}>{label}</span>
        <span className="text-neutral-400 font-light"> — {body}</span>
      </p>
    </div>
  );
}

function TrustRow({ Icon, label, body, accent }: { Icon?: LucideIcon; label: string; body: ReactNode; accent?: boolean }) {
  return (
    <div className="flex items-start gap-3">
      <span
        className={cn(
          "grid place-items-center w-5 h-5 rounded-full shrink-0",
          accent ? "bg-violet-500/20 text-violet-200 ring-1 ring-violet-500/30" : "bg-neutral-800 text-neutral-400 ring-1 ring-neutral-700",
        )}
      >
        {Icon ? <Icon className="h-3 w-3" /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      </span>
      <p className="text-[13px] leading-snug">
        <span className={cn("font-medium", accent ? "text-violet-200" : "text-neutral-100")}>{label}</span>
        <span className="text-neutral-400 font-light"> — {body}</span>
      </p>
    </div>
  );
}

function Glossary() {
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();
  const filtered = query
    ? GLOSSARY.filter((e) => (e.term + " " + e.short + " " + (e.soWhat ?? "")).toLowerCase().includes(query))
    : GLOSSARY;

  return (
    <div>
      <SectionHeading
        Icon={BookMarked}
        title="Glossary"
        sub="The vocabulary of digital-asset financial crime"
        right={<span className="text-xs text-neutral-500 tabular-nums">{filtered.length}</span>}
      />
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl surface mb-4">
        <Search className="h-3.5 w-3.5 text-neutral-500 shrink-0" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search terms…"
          className="flex-1 bg-transparent text-[13px] text-neutral-200 placeholder:text-neutral-600 focus:outline-none"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-neutral-500 font-light">No terms match "{q}".</p>
      ) : (
        <div className="space-y-4">
          {GLOSSARY_CATEGORIES.map((cat) => {
            const entries = filtered.filter((e) => e.category === cat);
            if (entries.length === 0) return null;
            return (
              <div key={cat}>
                <div className="text-[10px] uppercase tracking-[0.14em] text-violet-300/70 font-medium mb-2">{cat}</div>
                <div className="grid sm:grid-cols-2 gap-2.5">
                  {entries.map((e) => (
                    <GlossaryCard key={e.id} entry={e} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function GlossaryCard({ entry }: { entry: GlossaryEntry }) {
  return (
    <Panel className="p-3">
      <div className="flex items-center gap-2">
        <span className="text-[13px] font-medium text-neutral-100">{entry.term}</span>
        {entry.source && (
          <a
            href={entry.source.url}
            target="_blank"
            rel="noreferrer"
            aria-label={`Source: ${entry.source.name}`}
            className="ml-auto text-neutral-600 hover:text-violet-300 transition-colors"
          >
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
      <p className="mt-1 text-[12px] text-neutral-400 font-light leading-snug">{entry.short}</p>
      {entry.soWhat && (
        <p className="mt-1.5 text-[11px] text-violet-300/90 leading-snug">
          <span className="font-semibold">So what — </span>
          {entry.soWhat}
        </p>
      )}
    </Panel>
  );
}
