import { useState, type ReactNode } from "react";
import { ExternalLink, Search, ArrowRight } from "lucide-react";
import { NAV_GROUPS, type Page } from "../lib/nav";
import { PageHeader } from "../components/PageHeader";
import { Panel, SectionHeading, Tag } from "../lib/ui";
import { Term } from "../components/Term";
import { GLOSSARY, GLOSSARY_CATEGORIES, type GlossaryEntry } from "../content/glossary";

// How to use this: what Sentinel is, how to read an item, what the trust
// marks mean, where each page goes, how to take material out, and the
// glossary. Crime-pattern primers live on the Crime patterns page.
const PAGE_BLURB: Record<Page, string> = {
  brief: "The figures, what moved this week by topic, the latest items and the next deadline.",
  trends: "Items per month, the topics gaining or losing, and the weekly digest.",
  themes: "One briefing per topic, with a primer and every item on the subject.",
  signals: "News, new rules and enforcement, newest first, with filters.",
  fca: "Every FCA paper on crypto and financial crime, by paper type.",
  radar: "Deadlines and milestones ahead, and the rules that just landed.",
  atlas: "A world map of crypto regulation status, by country.",
  ventures: "Funding rounds, acquisitions and market moves.",
  solutions: "Vendors, our stance on each, and a matrix by category.",
  intelligence: "How each crime pattern works and which controls catch it.",
  learn: "This page.",
  activity: "What the agent added, grouped by the day it ran.",
};

export function Learn({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <div className="space-y-6">
      <PageHeader title="How to use this" lede="What Sentinel is, how to read an item, what each page shows, and how to take material out for a client." />

      <div className="border-l-2 border-signal pl-4">
        <div className="label text-signal">What Sentinel is</div>
        <p className="serif text-ink mt-1.5 max-w-3xl">
          A horizon-scanning tool for financial crime across digital assets. An agent reads the news, the regulators and the vendors every day and adds what matters as items. Every item carries a{" "}
          <span className="font-semibold">So what for a bank</span>: what the development means for a regulated firm. One content model sits under every page.
        </p>
      </div>

      <section>
        <SectionHeading title="How to read an item" sub="Every item has the same three parts" />
        <Panel className="divide-y divide-rule">
          <Step n={1} label="Summary" body="What happened, in one or two sentences, with the date and the region." />
          <Step n={2} label="So what for a bank" body="The exposure it creates or the response it calls for. This is the part a news feed does not give you." accent />
          <Step n={3} label="Sources and impact" body="Every item links to a real source. The impact word (High, Medium or Low) is its risk weight for a bank." />
        </Panel>
      </section>

      <section>
        <SectionHeading title="What the trust marks mean" sub="Three marks on an item say how far to rely on it" />
        <Panel className="divide-y divide-rule">
          <Mark tag={<Tag tone="signal">Verified</Tag>} body="A person has read the item and vouched for it. The agent never sets this. Filter any list to Verified only when building a client pack." />
          <Mark tag={<Tag>Confidence</Tag>} body="How sure the source and the agent are about the item itself: High, Medium or Low, shown as a dot. Separate from impact, which is severity." />
          <Mark
            tag={<Tag tone="signal">Primary</Tag>}
            body={
              <>
                Each source is marked <Term id="primary-source">primary</Term> (the official or originating document) or <Term id="secondary-source">secondary</Term> (reporting or analysis about it).
              </>
            }
          />
        </Panel>
      </section>

      <section>
        <SectionHeading title="The ideas most items turn on" sub="Hover a dotted term for its definition" />
        <p className="serif text-ink-soft max-w-3xl">
          The <Term id="travel-rule">Travel Rule</Term> and its <Term id="sunrise">sunrise</Term> gap, <Term id="stablecoin">stablecoin</Term> rails and <Term id="issuer-freeze">issuer freeze</Term> powers, the EU's <Term id="mica">MiCA</Term> regime, sanctions through <Term id="ofac">OFAC</Term> and the <Term id="sdn">SDN list</Term>, and cross-chain <Term id="bridge">bridge</Term> laundering. The glossary below holds the full vocabulary. The{" "}
          <button onClick={() => setPage("themes")} className="link">
            topic briefings
          </button>{" "}
          turn each into a page.
        </p>
      </section>

      <section>
        <SectionHeading title="What each page shows" sub="The same list as the rail on the left" />
        <div className="grid sm:grid-cols-2 gap-3">
          {NAV_GROUPS.map((g) => (
            <Panel key={g.label} className="overflow-hidden">
              <div className="label px-4 py-2 bg-sunken border-b border-rule">{g.label}</div>
              {g.items.map((n, i) => (
                <button key={n.id} onClick={() => setPage(n.id)} className={i === 0 ? "w-full flex items-start gap-3 px-4 py-2.5 text-left hover:bg-sunken" : "row w-full flex items-start gap-3 px-4 py-2.5 text-left"}>
                  <n.Icon className="h-4 w-4 text-ink-faint shrink-0 mt-0.5" strokeWidth={1.75} aria-hidden />
                  <span className="min-w-0 flex-1">
                    <span className="block text-small text-ink font-medium">{n.label}</span>
                    <span className="block text-tiny text-ink-faint mt-0.5">{PAGE_BLURB[n.id]}</span>
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-ink-faint shrink-0 mt-1" aria-hidden />
                </button>
              ))}
            </Panel>
          ))}
        </div>
      </section>

      <section>
        <SectionHeading title="Taking material out" sub="Sentinel is built for client work as well as reading" />
        <Panel className="p-4">
          <ol className="list-decimal pl-5 space-y-1.5 text-small text-ink-soft">
            <li>
              Open any item and use <span className="text-ink font-medium">Copy citation</span> or <span className="text-ink font-medium">Copy deck bullet</span>.
            </li>
            <li>
              Use <span className="text-ink font-medium">Add to pack</span> on items across any page, then open the briefing pack in the corner to order them and export a one-pager.
            </li>
            <li>
              Use <span className="text-ink font-medium">Export</span> on any list or topic briefing to download Markdown or CSV of the items shown.
            </li>
          </ol>
        </Panel>
      </section>

      <Glossary />
    </div>
  );
}

function Step({ n, label, body, accent }: { n: number; label: string; body: string; accent?: boolean }) {
  return (
    <div className="flex items-start gap-3 px-4 py-3">
      <span className={accent ? "grid place-items-center w-6 h-6 rounded-sm text-tiny font-semibold shrink-0 num bg-signal text-on-signal" : "grid place-items-center w-6 h-6 rounded-sm text-tiny font-semibold shrink-0 num bg-sunken text-ink-soft"}>{n}</span>
      <p className="text-small leading-snug">
        <span className="font-semibold text-ink">{label}.</span> <span className="text-ink-soft">{body}</span>
      </p>
    </div>
  );
}

function Mark({ tag, body }: { tag: ReactNode; body: ReactNode }) {
  return (
    <div className="flex items-start gap-3 px-4 py-3">
      <span className="shrink-0 w-24">{tag}</span>
      <p className="text-small leading-snug text-ink-soft">{body}</p>
    </div>
  );
}

function Glossary() {
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();
  const filtered = query ? GLOSSARY.filter((e) => (e.term + " " + e.short + " " + (e.soWhat ?? "")).toLowerCase().includes(query)) : GLOSSARY;

  return (
    <section>
      <SectionHeading title="Glossary" sub="The vocabulary of digital-asset financial crime" right={<span className="text-tiny text-ink-faint num">{filtered.length} terms</span>} />
      <div className="relative mb-4">
        <Search className="h-3.5 w-3.5 text-ink-faint absolute left-3 top-1/2 -translate-y-1/2" aria-hidden />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search the glossary" aria-label="Search the glossary" className="field pl-8" />
      </div>

      {filtered.length === 0 ? (
        <p className="text-small text-ink-faint">No terms match that search.</p>
      ) : (
        <div className="space-y-5">
          {GLOSSARY_CATEGORIES.map((cat) => {
            const entries = filtered.filter((e) => e.category === cat);
            if (entries.length === 0) return null;
            return (
              <div key={cat}>
                <div className="label mb-2">{cat}</div>
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
    </section>
  );
}

function GlossaryCard({ entry }: { entry: GlossaryEntry }) {
  return (
    <Panel className="p-3">
      <div className="flex items-center gap-2">
        <span className="text-small font-semibold text-ink">{entry.term}</span>
        {entry.source && (
          <a href={entry.source.url} target="_blank" rel="noreferrer" aria-label={`Source: ${entry.source.name}`} className="ml-auto text-ink-faint hover:text-signal transition-colors">
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
      <p className="mt-1 serif text-small text-ink-soft leading-snug">{entry.short}</p>
      {entry.soWhat && (
        <p className="mt-1.5 text-tiny text-ink-soft leading-snug">
          <span className="font-semibold text-ink">For a bank: </span>
          {entry.soWhat}
        </p>
      )}
    </Panel>
  );
}
