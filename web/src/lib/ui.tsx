import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { TONE, type Tone } from "./uiTokens";
import { cn } from "./utils";

// Shared dark component layer. One consistent way for tiles, panels,
// badges and stats to appear across the app.

export function IconTile({
  Icon,
  tone = "neutral",
  size = "md",
}: {
  Icon: LucideIcon;
  tone?: Tone;
  size?: "sm" | "md" | "lg";
}) {
  const box =
    size === "lg"
      ? "w-11 h-11 rounded-xl"
      : size === "sm"
        ? "w-8 h-8 rounded-lg"
        : "w-10 h-10 rounded-xl";
  const ic = size === "sm" ? "h-4 w-4" : "h-5 w-5";
  return (
    <span className={cn("grid place-items-center shrink-0", box, TONE[tone].tile)}>
      <Icon className={ic} strokeWidth={2} />
    </span>
  );
}

export function Panel({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("rounded-xl bg-neutral-900 ring-1 ring-neutral-800", className)}>{children}</div>;
}

export function Badge({
  children,
  tone,
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-medium",
        tone ? TONE[tone].tile : "bg-neutral-800 text-neutral-400 ring-1 ring-neutral-700",
        className,
      )}
    >
      {children}
    </span>
  );
}

// DefiLlama-style stat tile: small label up top, big number below.
export function Stat({
  Icon,
  label,
  value,
  tone = "neutral",
  hint,
}: {
  Icon: LucideIcon;
  label: string;
  value: ReactNode;
  tone?: Tone;
  hint?: string;
}) {
  return (
    <Panel className="p-4">
      <div className="flex items-center gap-2 text-neutral-500">
        <Icon className={cn("h-3.5 w-3.5", TONE[tone].text)} strokeWidth={2} />
        <span className="text-[11px] uppercase tracking-wide">{label}</span>
      </div>
      <div className="mt-2 text-3xl font-semibold text-neutral-100 tabular-nums leading-none">{value}</div>
      {hint && <div className="mt-1 text-[11px] text-neutral-500 truncate">{hint}</div>}
    </Panel>
  );
}

export function SectionHeading({
  Icon,
  title,
  sub,
  right,
}: {
  Icon: LucideIcon;
  title: string;
  sub?: string;
  right?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 mb-3">
      <div className="flex items-center gap-2 min-w-0">
        <Icon className="h-4 w-4 text-neutral-500 shrink-0" strokeWidth={2} />
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-neutral-100 leading-none">{title}</h2>
          {sub && <p className="text-[11px] text-neutral-500 mt-1 leading-none">{sub}</p>}
        </div>
      </div>
      {right}
    </div>
  );
}

export function EmptyState({ Icon, title, body }: { Icon: LucideIcon; title: string; body?: string }) {
  return (
    <Panel className="p-10 grid place-items-center text-center">
      <IconTile Icon={Icon} tone="brand" size="lg" />
      <div className="mt-3 text-sm font-medium text-neutral-100">{title}</div>
      {body && <div className="mt-1 text-xs text-neutral-500 max-w-sm">{body}</div>}
    </Panel>
  );
}
