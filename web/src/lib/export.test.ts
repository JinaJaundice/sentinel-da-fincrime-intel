import { describe, it, expect } from "vitest";
import { citationText, deckBullet, itemsToMarkdown, itemsToCsv, slugify } from "./export";
import { longDate } from "./utils";
import type { Item } from "../content/types";

// A verified regulatory item with a comma in the title (to exercise CSV
// quoting) and primary/secondary sources (to exercise the trust signals).
const reg: Item = {
  id: "x-1",
  type: "regulatory",
  title: "Test rule, with comma",
  summary: "A one-line summary.",
  soWhat: "The bank lens.",
  date: "2026-04-17",
  addedAt: "2026-05-01",
  addedBy: "human",
  status: "published",
  region: "EU",
  impact: "high",
  confidence: "high",
  verified: true,
  tags: ["mica", "casp"],
  sources: [
    { name: "ESMA", url: "https://www.esma.europa.eu/", kind: "primary" },
    { name: "InnReg", url: "https://innreg.com/", kind: "secondary" },
  ],
};

const ven: Item = {
  id: "x-2",
  type: "venture",
  title: "Acme raises $70m",
  summary: "Series C round.",
  date: "2026-05-20",
  addedAt: "2026-05-21",
  addedBy: "agent",
  status: "published",
  tags: ["funding"],
  sources: [{ name: "TechCrunch" }],
};

describe("citationText", () => {
  it("wraps the title and lists each source with its url and an absolute date", () => {
    const c = citationText(reg);
    expect(c).toContain("“Test rule, with comma”"); // curly quotes
    expect(c).toContain("ESMA, https://www.esma.europa.eu/");
    expect(c).toContain("InnReg, https://innreg.com/");
    expect(c).toContain(longDate("2026-04-17"));
  });

  it("falls back gracefully when a source has no url", () => {
    expect(citationText(ven)).toContain("TechCrunch");
  });
});

describe("deckBullet", () => {
  it("puts the title on line 1 and the tab-indented So-what + attribution on line 2", () => {
    expect(deckBullet(reg)).toBe(`Test rule, with comma\n\tThe bank lens. (ESMA, ${longDate("2026-04-17")})`);
  });

  it("uses the summary when there is no So-what", () => {
    expect(deckBullet(ven)).toBe(`Acme raises $70m\n\tSeries C round. (TechCrunch, ${longDate("2026-05-20")})`);
  });
});

describe("itemsToMarkdown", () => {
  it("groups by type and carries the trust signals + source kinds", () => {
    const md = itemsToMarkdown([reg]);
    expect(md).toContain("## Regulatory");
    expect(md).toContain("### Test rule, with comma");
    expect(md).toContain("Impact: High");
    expect(md).toContain("Confidence: High");
    expect(md).toContain("✓ Verified");
    expect(md).toContain("> **So what:** The bank lens.");
    expect(md).toContain("[ESMA](https://www.esma.europa.eu/) (primary)");
  });

  it("ungrouped mode prefixes the meta with the type and keeps the given order", () => {
    const md = itemsToMarkdown([ven, reg], "Pack", { grouped: false });
    expect(md.split("\n").some((l) => /^## /.test(l))).toBe(false); // no h2 type-section headers
    expect(md).toContain("*Venture ·"); // type-prefixed meta line
    expect(md.indexOf("Acme raises")).toBeLessThan(md.indexOf("Test rule")); // order preserved
  });

  it("includes an intro paragraph when given", () => {
    expect(itemsToMarkdown([reg], "T", { intro: "Primer goes here." })).toContain("Primer goes here.");
  });
});

describe("itemsToCsv", () => {
  it("has the trust columns, quotes commas, and uses CRLF rows", () => {
    const csv = itemsToCsv([reg]);
    const lines = csv.split("\r\n");
    expect(lines[0]).toBe("Type,Title,Date,Region,Impact,Confidence,Verified,Tags,Summary,So what,Sources");
    expect(lines[1]).toContain('"Test rule, with comma"'); // comma forces quoting
    expect(lines[1]).toContain("High,Yes,"); // Confidence, Verified
    expect(lines[1]).toContain("ESMA (https://www.esma.europa.eu/) [primary]");
  });
});

describe("slugify", () => {
  it("lowercases and collapses non-alphanumerics to single hyphens", () => {
    expect(slugify("Sentinel — Signals!")).toBe("sentinel-signals");
  });
});
