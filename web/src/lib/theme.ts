// Theme state, kept small. The whole theme is a block of token overrides in
// index.css keyed on `[data-theme="dark"]`, so this only decides which value
// sits on the root element and remembers the choice.
//
// Three states: "system" follows the machine and is the default; "light" or
// "dark" pins it. The inline script in index.html mirrors resolveTheme() so
// the first paint is already the right theme; keep the two in step.

export type Theme = "light" | "dark" | "system";

const LS_KEY = "sentinel:theme";

export function readStoredTheme(): Theme {
  try {
    const v = localStorage.getItem(LS_KEY);
    if (v === "light" || v === "dark" || v === "system") return v;
  } catch {
    /* private mode, or storage disabled */
  }
  return "system";
}

export function prefersDark(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function resolveTheme(t: Theme): "light" | "dark" {
  return t === "system" ? (prefersDark() ? "dark" : "light") : t;
}

/** Put the resolved theme on <html>, which is what the CSS keys off. */
export function applyTheme(t: Theme): void {
  document.documentElement.setAttribute("data-theme", resolveTheme(t));
}

export function storeTheme(t: Theme): void {
  try {
    localStorage.setItem(LS_KEY, t);
  } catch {
    /* nothing to do: the theme still applies for this session */
  }
}
