import { ExternalLink, Bot, User, MapPin, Quote, List, ShieldCheck } from "lucide-react";
import type { Item, Source, Confidence } from "../content/types";
import { TYPE_META, STANCE_META, CONFIDENCE_META, SOURCE_KIND_META } from "../content/taxonomy";
import { IMPACT_TONE } from "../lib/uiTokens";
import { Tag } from "../lib/ui";
import { relativeDay, longDate, cn } from "../lib/utils";
import { citationText, deckBullet } from "../lib/export";
import { CopyButton } from "./CopyButton";
import { PackToggle } from "./BriefingPack";

// The shared content block for an item. `header` draws the kind/title row
// (off when a list row already shows it); `actions` adds the per-item
// copy affordances.
export function ItemDetail({
  item,
  header = true,
  actions = true,
  onTagClick,
}: {
  item: Item;
  header?: boolean;
  /** Per-item copy affordances (citation, deck bullet). Off in dense contexts. */
  actions?: boolean;
  /** When set, tags render as buttons that invoke this (to filter a list). */
  onTagClick?: (tag: string) => void;
}) {
  const meta = TYPE_META[item.type];
  return (
    <div>
      {header && (
        <>
          <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-tiny text-ink-faint">
            <Tag>{meta.label}</Tag>
            {item.verified && <VerifiedTag />}
            {item.region && (
              <span className="inline-flex items-center gap-0.5">
                <MapPin className="h-3 w-3" aria-hidden /> {item.region}
              </span>
            )}
            <span className="num" title={longDate(item.date)}>
              {relativeDay(item.date)}
            </span>
            {item.impact && (
              <Tag tone={IMPACT_TONE[item.impact].tone} className="ml-auto">
                {IMPACT_TONE[item.impact].label} impact
              </Tag>
            )}
          </div>
          <h3 className="mt-1.5 text-body font-semibold text-ink leading-snug">{item.title}</h3>
        </>
      )}

      <p className={cn("serif text-ink-soft", header ? "mt-1.5" : "mt-0.5")}>{item.summary}</p>

      {item.solution && (
        <div className="mt-2.5 flex items-center flex-wrap gap-2 text-tiny">
          <Tag tone={STANCE_META[item.solution.stance].tone} className={STANCE_META[item.solution.stance].chip}>
            {STANCE_META[item.solution.stance].label}
          </Tag>
          <span className="text-ink-soft">{item.solution.category}</span>
          {item.solution.note && <span className="text-ink-faint">{item.solution.note}</span>}
        </div>
      )}
      {item.venture && (
        <div className="mt-2.5 flex items-center flex-wrap gap-2 text-tiny text-ink-soft">
          {item.venture.round && <Tag>{item.venture.round}</Tag>}
          {item.venture.amount && <span className="font-semibold text-ink num">{item.venture.amount}</span>}
          {item.venture.investors && item.venture.investors.length > 0 && <span className="text-ink-faint">{item.venture.investors.join(", ")}</span>}
        </div>
      )}
      {item.typology && (
        <div className="mt-2.5 grid sm:grid-cols-2 gap-2">
          <DetailList label="Controls that catch it" items={item.typology.controls} />
          <DetailList label="Obligations it touches" items={item.typology.obligations} />
        </div>
      )}
      {item.publication && (
        <div className="mt-2.5 flex items-center flex-wrap gap-2 text-tiny">
          <Tag tone="signal">{item.publication.issuer}</Tag>
          <span className="text-ink-soft">{item.publication.kind}</span>
          {item.publication.ref && <span className="text-ink-faint num">{item.publication.ref}</span>}
        </div>
      )}

      {item.soWhat && (
        <div className="mt-3 border-l-2 border-signal pl-3">
          <div className="label text-signal">So what for a bank</div>
          <p className="serif text-ink mt-1">{item.soWhat}</p>
        </div>
      )}

      <div className="mt-3 flex items-center flex-wrap gap-x-3 gap-y-1.5">
        <div className="flex items-center flex-wrap gap-1">
          {item.tags.slice(0, 4).map((t) =>
            onTagClick ? (
              <button key={t} onClick={() => onTagClick(t)} className="text-micro text-ink-faint bg-sunken rounded-sm px-1.5 py-0.5 hover:text-signal transition-colors" title={`Show items tagged ${t}`}>
                {t}
              </button>
            ) : (
              <span key={t} className="text-micro text-ink-faint bg-sunken rounded-sm px-1.5 py-0.5">
                {t}
              </span>
            ),
          )}
        </div>
        {item.confidence && <ConfidenceTag confidence={item.confidence} className="ml-auto" />}
        <span className={cn("inline-flex items-center gap-1 text-micro text-ink-faint", !item.confidence && "ml-auto")} title={item.addedBy === "agent" ? "Added by the agent" : "Added by a person"}>
          {item.addedBy === "agent" ? <Bot className="h-3 w-3" aria-hidden /> : <User className="h-3 w-3" aria-hidden />}
          {item.addedBy === "agent" ? "agent" : "curated"}
        </span>
      </div>

      {item.sources.length > 0 && (
        <div className="mt-2 flex items-center flex-wrap gap-x-3 gap-y-1">
          <span className="label">Sources</span>
          {item.sources.map((s) => (
            <SourceLink key={s.url ?? s.name} source={s} />
          ))}
        </div>
      )}

      {actions && (
        <div className="mt-2 flex items-center justify-end gap-1">
          <PackToggle id={item.id} />
          <CopyButton text={citationText(item)} label="Copy citation" Icon={Quote} />
          <CopyButton text={deckBullet(item)} label="Copy deck bullet" Icon={List} />
        </div>
      )}
    </div>
  );
}

// A person has read and vouched for the item.
function VerifiedTag() {
  return (
    <Tag tone="signal">
      <ShieldCheck className="h-3 w-3" aria-hidden /> Verified
    </Tag>
  );
}

function ConfidenceTag({ confidence, className }: { confidence: Confidence; className?: string }) {
  const c = CONFIDENCE_META[confidence];
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-micro text-ink-faint", className)}>
      <span className={cn("h-2 w-2 rounded-full", c.dot)} aria-hidden /> {c.label}
    </span>
  );
}

function SourceLink({ source }: { source: Source }) {
  return (
    <span className="inline-flex items-center gap-1">
      <a
        href={source.url}
        target="_blank"
        rel="noreferrer"
        className={cn("inline-flex items-center gap-1 text-tiny text-ink-soft hover:text-signal underline-offset-2 hover:underline", !source.url && "pointer-events-none text-ink-faint")}
      >
        <ExternalLink className="h-3 w-3" aria-hidden /> {source.name}
      </a>
      {source.kind && <span className={cn("tag", SOURCE_KIND_META[source.kind].chip)}>{SOURCE_KIND_META[source.kind].label}</span>}
    </span>
  );
}

function DetailList({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="border-t border-rule pt-2">
      <div className="label">{label}</div>
      <ul className="mt-1 space-y-0.5 list-disc pl-4">
        {items.map((i) => (
          <li key={i} className="text-tiny text-ink-soft leading-snug">
            {i}
          </li>
        ))}
      </ul>
    </div>
  );
}
