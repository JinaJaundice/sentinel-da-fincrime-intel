// Full-page screenshots of every tab at desktop and phone width, in both
// themes, for looking at. Serves dist/ on 4186; the app switches tabs in
// state, so the script clicks the primary nav rather than loading routes.
//   node scripts/shots.mjs [outdir] [--theme light|dark|both]
import { chromium } from "playwright";
import { createServer } from "http";
import { readFileSync, existsSync, mkdirSync } from "fs";
import { join, extname } from "path";

const WEB = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const DIST = join(WEB, "dist");
const args = process.argv.slice(2);
const OUT = args.find((a) => !a.startsWith("--")) || join(WEB, "shots");
const themeArg = (args.find((a) => a.startsWith("--theme=")) || "--theme=both").slice(8);
const THEMES = themeArg === "both" ? ["light", "dark"] : [themeArg];
mkdirSync(OUT, { recursive: true });
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".woff2": "font/woff2", ".woff": "font/woff", ".svg": "image/svg+xml", ".png": "image/png" };
const srv = createServer((req, res) => {
  let p = join(DIST, decodeURIComponent(req.url.split("?")[0]).replace(/^\//, "") || "index.html");
  if (!existsSync(p)) p = join(DIST, "index.html");
  res.setHeader("content-type", MIME[extname(p)] ?? "application/octet-stream");
  res.end(readFileSync(p));
});
await new Promise((r) => srv.listen(4186, r));
const browser = await chromium.launch();
for (const theme of THEMES) {
  for (const [w, tag] of [[1440, "desktop"], [390, "phone"]]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 900 } });
    const page = await ctx.newPage();
    await page.addInitScript((t) => localStorage.setItem("sentinel:theme", t), theme);
    await page.goto("http://localhost:4186/", { waitUntil: "networkidle" });
    await page.waitForTimeout(800);
    // The page ids come from the phone picker's options (in the DOM at every
    // width); the desktop rail is clicked, the phone picker is set.
    const ids = await page.locator('select[aria-label="Go to page"] option').evaluateAll((os) => os.map((o) => o.value));
    for (let i = 0; i < ids.length; i++) {
      if (w >= 768) await page.locator(`nav[aria-label="Primary"] button[data-page="${ids[i]}"]`).click();
      else await page.selectOption('select[aria-label="Go to page"]', ids[i]);
      await page.waitForTimeout(700);
      await page.screenshot({ path: join(OUT, `${String(i).padStart(2, "0")}-${ids[i]}-${tag}-${theme}.png`), fullPage: true });
    }
    await ctx.close();
  }
}
// The states a reader makes: an open row, the vendor matrix, a topic
// briefing, a country picked on the map. Desktop, light theme.
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.addInitScript(() => localStorage.setItem("sentinel:theme", "light"));
  await page.goto("http://localhost:4186/", { waitUntil: "networkidle" });
  const go = async (id) => { await page.locator(`nav[aria-label="Primary"] button[data-page="${id}"]`).click(); await page.waitForTimeout(600); };
  await go("signals");
  await page.locator('main button[aria-expanded="false"]:not([aria-haspopup])').first().click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: join(OUT, "state-signals-open-row.png"), fullPage: false });
  await go("solutions");
  await page.getByRole("button", { name: "Matrix by category" }).click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: join(OUT, "state-vendors-matrix.png"), fullPage: true });
  await go("themes");
  await page.locator("main button").filter({ hasText: "Stablecoins" }).first().click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: join(OUT, "state-topic-stablecoins.png"), fullPage: true });
  await go("atlas");
  await page.waitForTimeout(800);
  await page.getByRole("button", { name: "United Kingdom", exact: true }).click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: join(OUT, "state-atlas-uk.png"), fullPage: false });
  await go("intelligence");
  await page.locator('main button[aria-expanded="false"]:not([aria-haspopup])').first().click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: join(OUT, "state-pattern-open.png"), fullPage: false });
  await ctx.close();
}
await browser.close();
srv.close();
console.log(`shots in ${OUT}`);
