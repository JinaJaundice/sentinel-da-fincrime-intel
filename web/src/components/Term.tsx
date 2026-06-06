import { useId, useState, type ReactNode } from "react";
import { GLOSSARY_BY_KEY } from "../content/glossary";
import { cn } from "../lib/utils";

// Inline glossary term: a subtle dotted-underline trigger that reveals the
// definition on hover or keyboard focus. Falls back to plain text if the id
// isn't in the glossary, so it's always safe to wrap a word.
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
          "cursor-help underline decoration-dotted decoration-neutral-600 underline-offset-2 hover:decoration-violet-400 focus:outline-none focus-visible:decoration-violet-400 transition-colors",
          className,
        )}
      >
        {children ?? entry.term}
      </span>
      {show && (
        <span
          id={tipId}
          role="tooltip"
          className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-1.5 w-64 rounded-lg surface p-2.5 text-left normal-case rise pointer-events-none"
        >
          <span className="block text-[11px] font-semibold text-neutral-100">{entry.term}</span>
          <span className="mt-0.5 block text-[11px] font-light leading-snug text-neutral-400">{entry.short}</span>
          {entry.soWhat && (
            <span className="mt-1.5 block text-[10px] leading-snug text-violet-300/90">
              <span className="font-semibold">So what — </span>
              {entry.soWhat}
            </span>
          )}
        </span>
      )}
    </span>
  );
}
