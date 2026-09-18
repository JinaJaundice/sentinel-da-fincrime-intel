import type { ReactNode } from "react";
import { TONE, type Tone } from "./uiTokens";
import { cn } from "./utils";

// The shared primitives. Each one is a token-only shape; the tones come
// from uiTokens.ts, the rest from the utilities in index.css.

/** Paper on the page: a hairline box on the raised surface. */
export function Panel({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("panel", className)}>{children}</div>;
}

/** A small meaning tag: an impact word, a stance, a source kind. */
export function Tag({ children, tone, className }: { children: ReactNode; tone?: Tone; className?: string }) {
  return <span className={cn("tag", tone && TONE[tone].soft, className)}>{children}</span>;
}

/** A coloured dot, the second cue beside a word. */
export function Dot({ tone, className }: { tone: Tone; className?: string }) {
  return <span aria-hidden className={cn("inline-block h-2 w-2 rounded-full shrink-0", TONE[tone].dot, className)} />;
}

export interface Figure {
  label: string;
  value: ReactNode;
  tone?: Tone;
  hint?: string;
}

/** A ruled row of figures under a page title: the number, then what it counts. */
export function FigureStrip({ figures, className }: { figures: Figure[]; className?: string }) {
  return (
    <dl className={cn("flex flex-wrap gap-y-3 border-y border-rule py-3", className)}>
      {figures.map((f, i) => (
        <div key={f.label} className={cn("pr-6 mr-6 border-r border-rule last:border-r-0 last:mr-0 last:pr-0 min-w-0", i === 0 && "pl-0")}>
          <dd className={cn("text-head font-semibold leading-none num", f.tone ? TONE[f.tone].text : "text-ink")}>{f.value}</dd>
          <dt className="label mt-1.5">{f.label}</dt>
          {f.hint && <div className="text-tiny text-ink-faint mt-0.5 truncate">{f.hint}</div>}
        </div>
      ))}
    </dl>
  );
}

export function SectionHeading({ title, sub, right, className }: { title: string; sub?: string; right?: ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-end justify-between gap-3 mb-3", className)}>
      <div className="min-w-0">
        <h2 className="text-lead font-semibold text-ink leading-tight">{title}</h2>
        {sub && <p className="text-tiny text-ink-faint mt-0.5">{sub}</p>}
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </div>
  );
}

export function EmptyState({ title, body }: { title: string; body?: string }) {
  return (
    <Panel className="p-8 text-center">
      <div className="text-body font-semibold text-ink">{title}</div>
      {body && <div className="mt-1 text-small text-ink-faint max-w-sm mx-auto">{body}</div>}
    </Panel>
  );
}

/** A boxed group of choices where exactly one is on. */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  className,
}: {
  options: { value: T; label: ReactNode; title?: string }[];
  value: T;
  onChange: (v: T) => void;
  ariaLabel: string;
  className?: string;
}) {
  return (
    <div role="group" aria-label={ariaLabel} className={cn("inline-flex border border-rule rounded-md overflow-hidden", className)}>
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            aria-pressed={on}
            title={o.title}
            className={cn(
              "px-2.5 py-1 text-tiny font-medium transition-colors border-l border-rule first:border-l-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-signal",
              on ? "bg-signal text-on-signal" : "bg-raised text-ink-soft hover:text-ink hover:bg-sunken",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/** A filter chip that can be on or off, with an optional count. */
export function Chip({ on, onClick, children, count, className }: { on: boolean; onClick: () => void; children: ReactNode; count?: number; className?: string }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={on} className={cn("chip", className)}>
      {children}
      {count !== undefined && <span className={cn("num", on ? "opacity-80" : "text-ink-faint")}>{count}</span>}
    </button>
  );
}

/** "Showing 30 of 173", and the one control that shows the next page. */
export function ShowMore({ shown, total, step, onMore, className }: { shown: number; total: number; step: number; onMore: () => void; className?: string }) {
  // Nothing to say when the whole list fits on one page.
  if (total === 0 || (shown >= total && total <= step)) return null;
  const left = total - shown;
  return (
    <div className={cn("flex items-center justify-between gap-3 px-4 py-2.5 border-t border-rule text-tiny text-ink-faint", className)}>
      <span className="num">
        Showing {Math.min(shown, total)} of {total}
      </span>
      {left > 0 && (
        <button type="button" onClick={onMore} className="btn">
          Show {Math.min(step, left)} more
        </button>
      )}
    </div>
  );
}
