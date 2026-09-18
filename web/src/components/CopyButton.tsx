import { useState } from "react";
import { Check, Copy, type LucideIcon } from "lucide-react";
import { copyText } from "../lib/export";
import { cn } from "../lib/utils";

// A quiet copy-to-clipboard action. Shows a tick and "Copied" for a moment.
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
      className={cn("btn btn-quiet text-tiny", done && "text-signal", className)}
    >
      {done ? <Check className="h-3.5 w-3.5" /> : <Icon className="h-3.5 w-3.5" />}
      {done ? copiedLabel : label}
    </button>
  );
}
