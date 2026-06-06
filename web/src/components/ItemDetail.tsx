import { ExternalLink, Bot, User, Lightbulb, MapPin, CheckCircle2, XCircle, Quote, List, ShieldCheck } from "lucide-react";
import type { Item, Source, Confidence } from "../content/types";
import { TYPE_META, STANCE_META, CONFIDENCE_META, SOURCE_KIND_META } from "../content/taxonomy";
import { IMPACT_TONE } from "../lib/uiTokens";
import { Badge } from "../lib/ui";
import { relativeDay, cn } from "../lib/utils";
import { setStatus } from "../lib/store";
import { citationText, deckBullet } from "../lib/export";
import { CopyButton } from "./CopyButton";
import { PackToggle } from "./BriefingPack";

// The shared content block for an item. `header` draws the type/title
// row (off when a table row already shows it). `review` adds the
// approve/reject controls.
export function ItemDetail({
  item,
  header = true,
  review = false,
  actions = true,
}: {
  item: Item;
  header?: boolean;
  review?: boolean;
  /** Per-item copy affordances (citation / deck bullet). Off in dense contexts. */
  actions?: boolean;
}) {
  const meta = TYPE_META[item.type];
  return (
    <div>
      {header && (
        <>
          <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-[11px] text-neutral-500">
            <Badge>{meta.label}</Badge>
            {item.verified && <VerifiedBadge />}
            {item.region && (
              <span className="inline-flex items-center gap-0.5">
                <MapPin className="h-3 w-3" /> {item.region}
              </span>
            )}
            <span aria-hidden>·</span>
            <span>{relativeDay(item.date)}</span>
            {item.impact && (
              <span className={cn("ml-auto rounded-md px-1.5 py-0.5 font-medium", IMPACT_TONE[item.impact].chip)}>
                {IMPACT_TONE[item.impact].label}
              </span>
            )}
          </div>
          <h3 className="mt-1.5 text-sm font-semibold text-neutral-100 leading-snug">{item.title}</h3>
        </>
      )}

      <p className={cn("text-[13px] text-neutral-400 leading-relaxed", header && "mt-1")}>{item.summary}</p>

      {item.solution && (
        <div className="mt-2 flex items-center flex-wrap gap-2 text-[11px]">
          <span className={cn("rounded-md px-1.5 py-0.5 font-medium", STANCE_META[item.solution.stance].chip)}>
            {STANCE_META[item.solution.stance].label}
          </span>
          <span className="text-neutral-500">{item.solution.category}</span>
          {item.solution.note && <span className="text-neutral-600">· {item.solution.note}</span>}
        </div>
      )}
      {item.venture && (
        <div className="mt-2 flex items-center flex-wrap gap-2 text-[11px] text-neutral-400">
          {item.venture.round && <Badge>{item.venture.round}</Badge>}
          {item.venture.amount && <span className="font-medium text-neutral-200">{item.venture.amount}</span>}
          {item.venture.investors && item.venture.investors.length > 0 && (
            <span className="text-neutral-600">{item.venture.investors.join(", ")}</span>
          )}
        </div>
      )}
      {item.typology && (
        <div className="mt-2 grid sm:grid-cols-2 gap-2">
          <DetailList label="Controls" items={item.typology.controls} />
          <DetailList label="Obligations" items={item.typology.obligations} />
        </div>
      )}

      {item.soWhat && (
        <div className="mt-2.5 flex gap-2 rounded-lg bg-neutral-800/40 border-l-2 border-violet-500/50 px-3 py-2">
          <Lightbulb className="h-3.5 w-3.5 text-violet-300 mt-0.5 shrink-0" />
          <p className="text-[12px] text-neutral-300 leading-relaxed">
            <span className="font-semibold text-neutral-100">So what — </span>
            {item.soWhat}
          </p>
        </div>
      )}

      <div className="mt-2.5 flex items-center flex-wrap gap-x-3 gap-y-1.5">
        <div className="flex items-center flex-wrap gap-1">
          {item.tags.slice(0, 4).map((t) => (
            <span key={t} className="text-[10px] text-neutral-500 bg-neutral-800 rounded px-1.5 py-0.5">
              {t}
            </span>
          ))}
        </div>
        {item.confidence && <ConfidenceTag confidence={item.confidence} className="ml-auto" />}
        <span className={cn("inline-flex items-center gap-1 text-[10px] text-neutral-600", !item.confidence && "ml-auto")}>
          {item.addedBy === "agent" ? <Bot className="h-3 w-3" /> : <User className="h-3 w-3" />}
          {item.addedBy === "agent" ? "agent" : "curated"}
        </span>
        {item.sources.map((s) => (
          <SourceLink key={s.url ?? s.name} source={s} />
        ))}
      </div>

      {actions && (
        <div className="mt-2 flex items-center justify-end gap-3">
          <PackToggle id={item.id} />
          <span className="text-neutral-800" aria-hidden>|</span>
          <CopyButton text={citationText(item)} label="Citation" Icon={Quote} />
          <CopyButton text={deckBullet(item)} label="Deck bullet" Icon={List} />
        </div>
      )}

      {review && (
        <div className="mt-3 flex items-center gap-2 border-t border-neutral-800 pt-3">
          <button
            onClick={() => setStatus(item.id, "published")}
            className="inline-flex items-center gap-1.5 rounded-lg bg-violet-500 text-neutral-950 text-xs font-semibold px-3 py-1.5 hover:bg-violet-400 transition-colors"
          >
            <CheckCircle2 className="h-3.5 w-3.5" /> Approve &amp; publish
          </button>
          <button
            onClick={() => setStatus(item.id, "rejected")}
            className="inline-flex items-center gap-1.5 rounded-lg bg-neutral-800 text-neutral-300 ring-1 ring-neutral-700 text-xs font-medium px-3 py-1.5 hover:bg-neutral-700 transition-colors"
          >
            <XCircle className="h-3.5 w-3.5" /> Reject
          </button>
          <span className="ml-auto text-[10px] text-neutral-600">Nothing publishes until you approve it.</span>
        </div>
      )}
    </div>
  );
}

// Human-vouched marker — violet (the brand = trust), shield-check.
function VerifiedBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-violet-500/15 text-violet-200 ring-1 ring-violet-500/30 px-1.5 py-0.5 text-[10px] font-medium">
      <ShieldCheck className="h-3 w-3" /> Verified
    </span>
  );
}

function ConfidenceTag({ confidence, className }: { confidence: Confidence; className?: string }) {
  const c = CONFIDENCE_META[confidence];
  return (
    <span className={cn("inline-flex items-center gap-1 text-[10px] text-neutral-500", className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", c.dot)} /> {c.label}
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
        className={cn(
          "inline-flex items-center gap-1 text-[10px] text-neutral-500 hover:text-violet-300",
          !source.url && "pointer-events-none text-neutral-700",
        )}
      >
        <ExternalLink className="h-3 w-3" /> {source.name}
      </a>
      {source.kind && (
        <span
          className={cn("rounded px-1 py-0.5 text-[9px] font-medium uppercase tracking-wide", SOURCE_KIND_META[source.kind].chip)}
        >
          {SOURCE_KIND_META[source.kind].label}
        </span>
      )}
    </span>
  );
}

function DetailList({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="rounded-lg bg-neutral-800/40 ring-1 ring-neutral-800 px-2.5 py-2">
      <div className="text-[10px] uppercase tracking-wide text-neutral-500 font-semibold">{label}</div>
      <ul className="mt-1 space-y-0.5">
        {items.map((i) => (
          <li key={i} className="text-[11px] text-neutral-400 leading-snug">• {i}</li>
        ))}
      </ul>
    </div>
  );
}
