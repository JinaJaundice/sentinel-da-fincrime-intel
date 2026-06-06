import { useState } from "react";
import { Check, Copy, type LucideIcon } from "lucide-react";
import { copyText } from "../lib/export";
import { cn } from "../lib/utils";

// A tiny ghost copy-to-clipboard control. Swaps to a check + "Copied" for
// a moment on success. Styled to match the source links in ItemDetail.
export function CopyButton({
  text,
  label,
  copiedLabel = "Copied",
  Icon = Copy,
  className,
}: {
  text: string;
  label: string;
  copiedLabel?: string;
  Icon?: LucideIcon;
  className?: string;
}) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={async (e) => {
        e.stopPropagation();
        if (await copyText(text)) {
          setDone(true);
          setTimeout(() => setDone(false), 1500);
        }
      }}
      className={cn(
        "inline-flex items-center gap-1 text-[10px] transition-colors",
        done ? "text-violet-300" : "text-neutral-500 hover:text-violet-300",
        className,
      )}
    >
      {done ? <Check className="h-3 w-3" /> : <Icon className="h-3 w-3" />}
      {done ? copiedLabel : label}
    </button>
  );
}
