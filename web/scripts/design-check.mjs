// The design gate: the system in docs/DESIGN.md is enforced, not described.
// Same spirit as the engine's design.spec.ts and Touchstone's design-check.
//
//   npm run build && node scripts/design-check.mjs
//
// Fails on:
//  1. a default Tailwind palette class, an arbitrary font size or a hex
//     colour literal anywhere in src (a colour that is not a token is
//     invisible to every check that reads class names);
//  2. the built CSS naming a face other than the two of the system, or
//     carrying a gradient or a backdrop filter;
//  then, for every page, in both themes, at 1440 and 390 wide:
//  3. the page's own <h1> is the one its route names (a page that falls
//     back to another view passes every other check trivially);
//  4. every text element is set in Libre Franklin or Source Serif;
//  5. no interface text below the 11px floor (SVG excluded, as the map
//     scales on its own grid);
//  6. every text element clears WCAG AA against the surface it is painted
//     on (4.5:1, or 3:1 at 24px, or 19px bold);
//  7. no horizontal overflow;
//  8. the tells: a blurred shadow, a corner radius above 6px on anything
//     wider than 40px, a backdrop filter;
//  9. no console error.
import { chromium } from "playwright";
import { createServer } from "http";
import { readFileSync, readdirSync, existsSync, statSync } from "fs";
import { join, extname } from "path";

const WEB = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const DIST = join(WEB, "dist");
let fails = 0;
const fail = (msg) => {
  console.error("FAIL " + msg);
  fails++;
};

// ---- 1. the source
const files = [];
(function walk(d) {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(tsx?|css)$/.test(f) && !/\.test\./.test(f)) files.push(p);
  }
})(join(WEB, "src"));
const PALETTE = /\b(?:bg|text|ring|border|from|to|via|decoration|fill|stroke|divide|outline|shadow|accent|caret)-(?:neutral|violet|amber|rose|slate|gray|zinc|stone|red|orange|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|purple|fuchsia|pink|white|black)(?:-\d{2,3})?(?:\/\d+)?\b/g;
for (const p of files) {
  const src = readFileSync(p, "utf-8");
  const rel = p.slice(WEB.length + 1);
  const pal = src.match(PALETTE);
  if (pal) fail(`${rel}: default palette class ${[...new Set(pal)].slice(0, 4).join(", ")}`);
  const arb = src.match(/text-\[\d+(?:\.\d+)?px\]/g);
  if (arb) fail(`${rel}: arbitrary font size ${[...new Set(arb)].join(", ")}`);
  if (p.endsWith(".tsx") || (p.endsWith(".ts") && !p.endsWith("index.css"))) {
    const hex = src.match(/#[0-9a-fA-F]{6}\b/g);
    if (hex) fail(`${rel}: hex colour literal ${[...new Set(hex)].slice(0, 3).join(", ")} (use a token)`);
  }
}
console.log(`source: ${files.length} files, no palette classes, arbitrary sizes or hex literals`);

// ---- 2. the built CSS
if (!existsSync(join(DIST, "assets"))) {
  console.error("dist/ is missing: run `npm run build` first");
  process.exit(1);
}
for (const f of readdirSync(join(DIST, "assets")).filter((f) => f.endsWith(".css"))) {
  const css = readFileSync(join(DIST, "assets", f), "utf-8");
  const fam = css.match(/font-family:[^;}]*\b(Inter|Geist|Roboto|Helvetica Neue|Plex|Bitter|Archivo|Newsreader|Public Sans)\b/);
  if (fam) fail(`built CSS names ${fam[1]} as a family (${f})`);
  if (/(linear|radial|conic)-gradient\(/.test(css)) fail(`built CSS carries a gradient (${f})`);
  // a declaration, not the name inside a transition-property list
  if (/[;{]\s*(?:-webkit-)?backdrop-filter\s*:/.test(css)) fail(`built CSS carries a backdrop filter (${f})`);
}
console.log("css: two faces, no gradient, no backdrop filter");

// ---- 3-9. the pages
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".woff2": "font/woff2", ".woff": "font/woff", ".svg": "image/svg+xml" };
const srv = createServer((req, res) => {
  let p = join(DIST, decodeURIComponent(req.url.split("?")[0]).replace(/^\//, "") || "index.html");
  if (!existsSync(p)) p = join(DIST, "index.html");
  res.setHeader("content-type", MIME[extname(p)] ?? "application/octet-stream");
  res.end(readFileSync(p));
});
await new Promise((r) => srv.listen(4188, r));

// page id -> the <h1> the page must show
const PAGES = [
  ["brief", "Today's briefing"],
  ["trends", "What is moving"],
  ["themes", "Topic briefings"],
  ["signals", "News and regulation"],
  ["fca", "FCA papers"],
  ["radar", "Dates ahead"],
  ["atlas", "Rules by country"],
  ["ventures", "Funding and deals"],
  ["solutions", "Vendors"],
  ["intelligence", "Crime patterns"],
  ["learn", "How to use this"],
  ["activity", "What the agent added"],
];

const AUDIT = () => {
  const lum = (r, g, b) => {
    const f = (c) => {
      c /= 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const parse = (s) => {
    const m = s && s.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/);
    return m ? [+m[1], +m[2], +m[3], m[4] === undefined ? 1 : +m[4]] : null;
  };
  const over = (top, bottom) => {
    const a = top[3];
    return [top[0] * a + bottom[0] * (1 - a), top[1] * a + bottom[1] * (1 - a), top[2] * a + bottom[2] * (1 - a), 1];
  };
  const bodyBg = parse(getComputedStyle(document.body).backgroundColor) || [255, 255, 255, 1];
  // effective background: composite every ancestor's background-color, innermost last
  const bgOf = (el) => {
    const stack = [];
    for (let e = el; e && e !== document.documentElement; e = e.parentElement) {
      const c = parse(getComputedStyle(e).backgroundColor);
      if (c && c[3] > 0) stack.push(c);
    }
    let acc = bodyBg;
    for (let i = stack.length - 1; i >= 0; i--) acc = over(stack[i], acc);
    return acc;
  };
  const faded = (el) => {
    for (let e = el; e && e !== document.documentElement; e = e.parentElement) if (parseFloat(getComputedStyle(e).opacity) < 1) return true;
    return false;
  };
  const out = { family: [], floor: [], contrast: [], tells: [], nText: 0 };
  for (const el of document.querySelectorAll("body *")) {
    if (el.closest("svg")) continue;
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden") continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) continue;
    // tells on every visible element
    if (cs.boxShadow && cs.boxShadow !== "none" && !/^rgba?\([^)]*\) 0px 0px 0px 1px/.test(cs.boxShadow)) out.tells.push(`shadow on ${el.tagName}.${String(el.className).slice(0, 30)}`);
    const rad = parseFloat(cs.borderTopLeftRadius);
    if (rad > 6 && r.width > 40 && !["INPUT", "SELECT"].includes(el.tagName)) out.tells.push(`radius ${rad}px on ${el.tagName}.${String(el.className).slice(0, 30)}`);
    if (cs.backdropFilter && cs.backdropFilter !== "none") out.tells.push(`backdrop filter on ${el.tagName}`);
    const hasText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 0);
    if (!hasText) continue;
    out.nText++;
    const fam = cs.fontFamily;
    if (!/Libre Franklin|Source Serif/i.test(fam)) out.family.push(`${el.tagName}.${String(el.className).slice(0, 30)}: ${fam.slice(0, 40)}`);
    const size = parseFloat(cs.fontSize);
    if (size < 11) out.floor.push(`${el.tagName}.${String(el.className).slice(0, 30)}: ${cs.fontSize}`);
    if (faded(el)) continue;
    const fg = parse(cs.color);
    if (!fg) continue;
    const bg = bgOf(el);
    const fgc = fg[3] < 1 ? over(fg, bg) : fg;
    const l1 = lum(fgc[0], fgc[1], fgc[2]);
    const l2 = lum(bg[0], bg[1], bg[2]);
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    const bold = parseInt(cs.fontWeight, 10) >= 600;
    const large = size >= 24 || (bold && size >= 19);
    const need = large ? 3 : 4.5;
    if (ratio < need) out.contrast.push(`${el.tagName}.${String(el.className).slice(0, 36)} "${el.textContent.trim().slice(0, 24)}" ${ratio.toFixed(2)}:1`);
  }
  out.overflow = document.documentElement.scrollWidth > document.documentElement.clientWidth + 1;
  out.h1 = document.querySelector("main h1")?.textContent?.trim() ?? "";
  return out;
};

const browser = await chromium.launch();
const errors = [];
for (const theme of ["light", "dark"]) {
  for (const [w, tag] of [[1440, "desktop"], [390, "phone"]]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 900 } });
    const page = await ctx.newPage();
    page.on("pageerror", (e) => errors.push(String(e)));
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(m.text());
    });
    await page.addInitScript((t) => localStorage.setItem("sentinel:theme", t), theme);
    await page.goto("http://localhost:4188/", { waitUntil: "networkidle" });
    for (const [id, h1] of PAGES) {
      if (w >= 768) await page.locator(`nav[aria-label="Primary"] button[data-page="${id}"]`).click();
      else await page.selectOption('select[aria-label="Go to page"]', id);
      await page.waitForTimeout(500);
      // the states with the most text: open the first row on a list page
      if (w >= 768 && ["signals", "intelligence", "activity"].includes(id)) {
        const row = page.locator('main button[aria-expanded="false"]:not([aria-haspopup])').first();
        if (await row.count()) await row.click();
        await page.waitForTimeout(300);
      }
      const a = await page.evaluate(AUDIT);
      const probs = [];
      if (a.h1 !== h1) probs.push(`h1 is "${a.h1}", expected "${h1}"`);
      if (a.nText < 12) probs.push(`only ${a.nText} text elements`);
      if (a.family.length) probs.push(`${a.family.length} not Libre Franklin or Source Serif (${a.family.slice(0, 3).join(" | ")})`);
      if (a.floor.length) probs.push(`${a.floor.length} below 11px (${a.floor.slice(0, 3).join(" | ")})`);
      if (a.contrast.length) probs.push(`${a.contrast.length} below AA (${a.contrast.slice(0, 4).join(" | ")})`);
      if (a.overflow) probs.push("horizontal overflow");
      if (a.tells.length) probs.push(`${a.tells.length} tells (${[...new Set(a.tells)].slice(0, 3).join(" | ")})`);
      if (probs.length) fail(`${id} [${theme} ${tag}]: ${probs.join("; ")}`);
      else console.log(`ok ${id} [${theme} ${tag}] ${a.nText} text elements`);
    }
    await ctx.close();
  }
}
await browser.close();
srv.close();
if (errors.length) fail(`console errors: ${[...new Set(errors)].slice(0, 5).join(" | ")}`);
if (fails) {
  console.error(`design check: ${fails} failures`);
  process.exit(1);
}
console.log("design check passed: every page, both themes, both widths, console clean");
