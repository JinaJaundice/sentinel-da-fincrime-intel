import type { ReactNode } from "react";

// Every page opens the same way: an optional kicker, the title, one plain
// sentence saying what the page shows, and the page's controls on the right.
export function PageHeader({ title, lede, kicker, right }: { title: string; lede?: string; kicker?: string; right?: ReactNode }) {
  return (
    <header className="flex items-end justify-between gap-4 flex-wrap pb-4 border-b border-rule">
      <div className="min-w-0">
        {kicker && <div className="label mb-1.5">{kicker}</div>}
        <h1 className="text-title font-semibold text-ink leading-none">{title}</h1>
        {lede && <p className="mt-2 text-body text-ink-soft max-w-2xl">{lede}</p>}
      </div>
      {right && <div className="flex items-center gap-2 shrink-0">{right}</div>}
    </header>
  );
}
