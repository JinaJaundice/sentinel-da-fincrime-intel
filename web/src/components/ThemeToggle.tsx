import { useEffect, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { applyTheme, readStoredTheme, storeTheme, type Theme } from "../lib/theme";
import { cn } from "../lib/utils";

// Three-state theme control: match the machine, light, dark. A two-state
// switch cannot say "follow my machine", which is the default and the state
// most readers want.
const OPTIONS: { value: Theme; label: string; Icon: typeof Sun }[] = [
  { value: "system", label: "Match system", Icon: Monitor },
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
];

export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>(() => readStoredTheme());

  useEffect(() => {
    applyTheme(theme);
    storeTheme(theme);
  }, [theme]);

  // While on "system", follow the machine if it changes under us.
  useEffect(() => {
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTheme("system");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [theme]);

  return (
    <div role="group" aria-label="Colour theme" className={cn("inline-flex border border-rule rounded-md overflow-hidden shrink-0", className)}>
      {OPTIONS.map((o) => {
        const active = theme === o.value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => setTheme(o.value)}
            aria-pressed={active}
            aria-label={o.label}
            title={o.label}
            className={cn(
              "px-2 py-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-signal",
              active ? "bg-signal text-on-signal" : "bg-raised text-ink-faint hover:text-ink hover:bg-sunken",
            )}
          >
            <o.Icon className="h-3.5 w-3.5" strokeWidth={2} />
          </button>
        );
      })}
    </div>
  );
}
