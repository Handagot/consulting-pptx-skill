#!/usr/bin/env node
// Automated layout inspection (checks requiring live rendering) — automates parts of slide-rules §8 visual QA:
//   1. Footer (.foot / .footer) overlapping with body content
//   2. Title (h1 / .title) overflowing right edge (catches silent truncation by nowrap + overflow:hidden)
//   3. Element overflow past slide canvas boundaries
//   4. Excessively empty pages (>40% of vertical canvas between title bottom and footer top is empty)
// Usage: node scripts/check_layout.mjs deck.html (requires Playwright: run `npm run setup`, or specify PLAYWRIGHT_MODULE_DIR)
import path from "node:path";
import { pathToFileURL } from "node:url";

async function loadPlaywright() {
  const cands = [
    process.env.PLAYWRIGHT_MODULE_DIR,
    path.join(process.cwd(), "node_modules", "playwright"),
    path.join(path.dirname(new URL(import.meta.url).pathname), "..", "node_modules", "playwright"),
  ].filter(Boolean);
  for (const c of cands) {
    try { return (await import(pathToFileURL(path.join(c, "index.mjs")).href)); } catch {}
    try { const m = await import(pathToFileURL(path.join(c, "index.js")).href); return m.default ?? m; } catch {}
  }
  return await import("playwright");
}

const file = process.argv[2];
if (!file) { console.error("usage: node check_layout.mjs deck.html"); process.exit(2); }

const pw = await loadPlaywright();
const browser = await pw.chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
// Inspect in print layout (bypasses viewport-dependent scalers)
await page.emulateMedia({ media: "print" });
await page.goto(pathToFileURL(path.resolve(file)).href);
await page.waitForTimeout(300);

const issues = await page.evaluate(() => {
  const out = [];
  const slides = [...document.querySelectorAll("section.s, section.slide, .slide")];
  slides.forEach((s, i) => {
    const n = i + 1;
    const sr = s.getBoundingClientRect();
    const foot = s.querySelector(".foot, .footer, footer");
    const fr = foot ? foot.getBoundingClientRect() : null;
    const els = [...s.querySelectorAll("*")].filter((el) => {
      if (foot && (el === foot || foot.contains(el))) return false;
      const st = getComputedStyle(el);
      if (st.display === "none" || st.visibility === "hidden") return false;
      return (el.textContent || "").trim().length > 0 || el.tagName === "IMG";
    });
    // 4. Blank lower canvas (covers and section dividers excluded)
    if (!s.matches(".cover, .chap")) {
      const ttl = s.querySelector("h1, .title, .ttl");
      const top = ttl ? ttl.getBoundingClientRect().bottom : sr.top;
      const bottom = fr ? fr.top : sr.bottom;
      let contentBottom = -Infinity, contentTop = Infinity;
      for (const el of els) {
        if (el === ttl || (ttl && ttl.contains(el))) continue;
        if (el.closest(".src, .bar")) continue; // Exclude source lines and top bars from body
        if (el.children.length > 0 && el.tagName !== "IMG" && el.tagName !== "svg") continue;
        const r = el.getBoundingClientRect();
        if (r.height === 0 || r.width === 0) continue;
        contentBottom = Math.max(contentBottom, r.bottom);
        contentTop = Math.min(contentTop, r.top);
      }
      // Count shapes (svg, images, filled or bordered containers) as body content
      const isShape = (el) => {
        if (/^(svg|img|canvas)$/i.test(el.tagName)) return true;
        const st = getComputedStyle(el);
        const bg = st.backgroundColor;
        const filled = bg && bg !== "transparent" && !/rgba\([^)]*,\s*0\)$/.test(bg);
        const bordered = ["Top", "Right", "Bottom", "Left"].some((k) => parseFloat(st[`border${k}Width`]) > 0 && st[`border${k}Style`] !== "none");
        return filled || bordered || st.clipPath !== "none";
      };
      for (const el of s.querySelectorAll("*")) {
        if (el.closest(".bar, .src") || (foot && foot.contains(el))) continue;
        if (el.closest("h1, .title, .ttl")) continue;
        if (!isShape(el)) continue;
        const r = el.getBoundingClientRect();
        if (r.height > 0 && r.bottom <= bottom + 1 && r.top >= top - 1) {
          contentBottom = Math.max(contentBottom, r.bottom);
          contentTop = Math.min(contentTop, r.top);
        }
      }
      const area = bottom - top;
      const span = contentBottom > contentTop ? contentBottom - contentTop : 0;
      const empty = area > 0 ? 1 - span / area : 0;
      if (empty > 0.4) {
        out.push(`p${n}: ${Math.round(empty * 100)}% of content area is blank (>40% unused; split table, add visuals, or consolidate slides)`);
      }
    }
    for (const el of els) {
      const r = el.getBoundingClientRect();
      if (r.height === 0 || r.width === 0) continue;
      // Evaluate leaf elements only to avoid false positives on large containers
      if (el.children.length > 0 && el.tagName !== "IMG") continue;
      if (fr && r.bottom > fr.top + 1 && r.top < fr.top) {
        out.push(`p${n}: Footer overlaps body content / フッターと本文が重なる: <${el.tagName.toLowerCase()}> "${(el.textContent || "").trim().slice(0, 30)}"`);
      }
      if (r.right > sr.right + 1) {
        out.push(`p${n}: Right edge overflow / 右端はみ出し ${Math.round(r.right - sr.right)}px: <${el.tagName.toLowerCase()}> "${(el.textContent || "").trim().slice(0, 30)}"`);
      }
      if (r.bottom > sr.bottom + 1) {
        out.push(`p${n}: Bottom edge overflow / 下端はみ出し ${Math.round(r.bottom - sr.bottom)}px: <${el.tagName.toLowerCase()}> "${(el.textContent || "").trim().slice(0, 30)}"`);
      }
    }
  });
  return [...new Set(out)];
});

await browser.close();
if (issues.length) {
  for (const m of issues.slice(0, 20)) console.log("FAIL  " + m);
  console.log(`\n${issues.length} layout FAIL`);
  process.exit(1);
}
console.log("layout OK (no footer overlap, overflow, or empty lower canvas)");
