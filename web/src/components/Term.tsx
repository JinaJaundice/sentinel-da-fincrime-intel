import { useId, useState, type ReactNode } from "react";
import { GLOSSARY_BY_KEY } from "../content/glossary";
import { cn } from "../lib/utils";

// An inline glossary term: a dotted underline that shows the definition on
// hover or keyboard focus. Falls back to plain text if the id is unknown,
// so it is always safe to wrap a word.
export function Term({ id, children, className }: { id: string; children?: ReactNode; className?: string }) {
  const entry = GLOSSARY_BY_KEY[id.toLowerCase()];
  const [show, setShow] = useState(false);
  const tipId = useId();

  if (!entry) return <>{children ?? id}</>;

  return (
    <span className="relative inline-block">
      <span
        tabIndex={0}
        aria-describedby={show ? tipId : undefined}
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
        className={cn(
          "cursor-help underline decoration-dotted decoration-rule-strong underline-offset-2 hover:decoration-signal focus:outline-none focus-visible:decoration-signal",
          className,
        )}
      >
        {children ?? entry.term}
      </span>
      {show && (
        <span id={tipId} role="tooltip" className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-1.5 w-64 panel p-2.5 text-left normal-case tracking-normal rise pointer-events-none">
          <span className="block text-tiny font-semibold text-ink">{entry.term}</span>
          <span className="mt-0.5 block text-tiny leading-snug text-ink-soft font-normal">{entry.short}</span>
          {entry.soWhat && (
            <span className="mt-1.5 block text-tiny leading-snug text-ink-soft font-normal">
              <span className="font-semibold text-ink">For a bank: </span>
              {entry.soWhat}
            </span>
          )}
        </span>
      )}
    </span>
  );
}
