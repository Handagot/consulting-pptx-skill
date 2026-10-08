#!/usr/bin/env node
// Render HTML deck and export per-slide elements (fills, borders, polygons, text, tables, images) with coordinates to JSON.
// Called internally by html_to_pptx.py. Standalone: node html_dump.mjs deck.html outdir  → outdir/dump.json and outdir/img_*.png
// SVG, canvas, img, and background images are screenshotted individually as transparent PNGs.
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { openPage } from "./lib_cdp.mjs";

const [, , file, outdir] = process.argv;
if (!file || !outdir) { console.error("usage: node html_dump.mjs deck.html outdir"); process.exit(2); }
mkdirSync(outdir, { recursive: true });

const SCALE = 2; // Image resolution (2x CSS px)
let page;
try { page = await openPage(file, { scale: 1 }); } catch (e) { console.error(String(e.message || e)); process.exit(3); }

// ---- Extraction executed inside the page ----------------------------------------------------
const collect = () => {
  const MM = 96 / 25.4;
  const rgba = (s) => {
    const m = (s || "").match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number);
    return { hex: "#" + p.slice(0, 3).map((v) => Math.round(v).toString(16).padStart(2, "0")).join(""), a: p.length > 3 ? p[3] : 1 };
  };
  const visible = (el) => {
    const st = getComputedStyle(el);
    return st.display !== "none" && st.visibility !== "hidden" && parseFloat(st.opacity || "1") > 0.02;
  };
  const MEDIA = new Set(["svg", "canvas", "img", "video", "iframe", "picture"]);
  const INLINE = new Set(["inline", "inline-block", "inline-flex", "contents"]);

  const slides = [...document.querySelectorAll("section.s, section.slide, div.slide, .slide")]
    .filter((s, i, arr) => !arr.some((o) => o !== s && o.contains(s)));
  const bodyBg = rgba(getComputedStyle(document.body).backgroundColor);
  let capId = 0;
  const captures = [];

  // Convert clip-path: polygon(...) to px coordinate sequence relative to element top-left
  const polygonOf = (el, r) => {
    const cp = getComputedStyle(el).clipPath || "";
    const m = cp.match(/^polygon\((.*)\)$/);
    if (!m) return null;
    const len = (expr, basis) => {
      let e = expr.trim().replace(/^calc/, "");
      e = e.replace(/(-?[\d.]+)%/g, (_, v) => `(${(parseFloat(v) / 100) * basis})`)
        .replace(/(-?[\d.]+)mm/g, (_, v) => `(${parseFloat(v) * MM})`)
        .replace(/(-?[\d.]+)px/g, (_, v) => `(${v})`);
      if (!/^[\d.\s()+\-*/]+$/.test(e)) return null;
      try { return Function(`return (${e})`)(); } catch { return null; }
    };
    // Split points by comma (assuming no commas inside calc)
    const pts = m[1].replace(/^\s*(nonzero|evenodd)\s*,/, "").split(",").map((p) => {
      const t = p.trim().match(/^(calc\([^)]*\)|\S+)\s+(calc\([^)]*\)|\S+)$/);
      if (!t) return null;
      const x = len(t[1], r.width), y = len(t[2], r.height);
      return x == null || y == null ? null : [x, y];
    });
    return pts.every(Boolean) && pts.length >= 3 ? pts : null;
  };

  const runStyle = (el) => {
    const st = getComputedStyle(el);
    const c = rgba(st.color);
    return {
      size: parseFloat(st.fontSize),
      bold: parseInt(st.fontWeight, 10) >= 600,
      italic: st.fontStyle === "italic",
      underline: (st.textDecorationLine || "").includes("underline"),
      color: c ? c.hex : "#000000",
      font: (st.fontFamily || "").split(",")[0].replace(/["']/g, "").trim(),
      // Determine serif based on leading font family name (generic sans-serif at the end contains "serif", so don't evaluate the whole string)
      serif: (() => { const f0 = (st.fontFamily || "").split(",")[0].replace(/["']/g, "").trim(); return /Serif|Mincho|明朝/i.test(f0) || f0 === "serif"; })(),
    };
  };
  // Reflect CSS text-transform (such as uppercase) in text
  const tt = (el, t) => {
    const v = getComputedStyle(el).textTransform;
    return v === "uppercase" ? t.toUpperCase() : v === "lowercase" ? t.toLowerCase()
      : v === "capitalize" ? t.replace(/\b\w/g, (c) => c.toUpperCase()) : t;
  };
  const isCJK = (ch) => /[　-鿿＀-￯]/.test(ch || "");
  const collapse = (s) => s.replace(/\s+/g, " ");

  // Bullet marker: { char, color, size } or { auto: "arabicPeriod" }. Recreated using PowerPoint bullet format (buChar)
  const marker = (li) => {
    const pb = getComputedStyle(li, "::before");
    const m = (pb.content || "").match(/^"(.*)"$/);
    if (m && m[1].trim()) {
      const c = rgba(pb.color);
      return { char: m[1].trim(), color: c ? c.hex : null, size: parseFloat(pb.fontSize) };
    }
    if (getComputedStyle(li).display !== "list-item") return null;
    const lst = getComputedStyle(li).listStyleType;
    if (!lst || lst === "none") return null;
    if (lst === "decimal") return { auto: "arabicPeriod", start: [...li.parentElement.children].indexOf(li) + 1 };
    return { char: "•", color: null, size: parseFloat(getComputedStyle(li).fontSize) };
  };
  const hangOf = (el) => {
    const pb = getComputedStyle(el, "::before");
    const left = parseFloat(pb.left);
    if (pb.position === "absolute" && left < 0) return -left;
    return 0;
  };
  // Split text under the element into paragraphs (broken by <br> or block boundaries) and runs
  const paragraphsOf = (root) => {
    const paras = [];
    let cur = null;
    const rootSt = getComputedStyle(root);
    const newPara = (el) => {
      const st = getComputedStyle(el);
      cur = { align: st.textAlign, lineHeight: parseFloat(st.lineHeight) || parseFloat(st.fontSize) * 1.5, runs: [] };
      paras.push(cur);
    };
    const walk = (node, block) => {
      for (const n of node.childNodes) {
        if (n.nodeType === 3) {
          let t = collapse(n.textContent);
          if (!t.trim() && !(cur && cur.runs.length)) continue;
          if (!cur) newPara(block);
          const prev = cur.runs.length ? cur.runs[cur.runs.length - 1].text : "";
          if (!prev || prev.endsWith(" ")) t = t.replace(/^ /, "");
          cur.runs.push({ text: tt(n.parentElement, t), ...runStyle(n.parentElement) });
        } else if (n.nodeType === 1) {
          if (!visible(n) || MEDIA.has(n.tagName.toLowerCase())) continue;
          if (n.tagName === "BR") { newPara(block); continue; }
          const disp = getComputedStyle(n).display;
          if (INLINE.has(disp)) { walk(n, block); continue; }
          // Block: read contents in a new paragraph
          newPara(n);
          if (marker(n)) { cur.bullet = marker(n); cur.hang = hangOf(n); }
          walk(n, n);
          cur = null;
        }
      }
    };
    newPara(root);
    if (marker(root)) { cur.bullet = marker(root); cur.hang = hangOf(root); }
    walk(root, root);
    // Clean up empty paragraphs and surrounding whitespace, dropping whitespace between CJK characters (originating from newlines in source)
    return paras.map((p) => {
      p.runs.forEach((r, i) => {
        r.text = r.text.replace(/([　-鿿＀-￯]) (?=[　-鿿＀-￯])/g, "$1");
        const nx = p.runs[i + 1];
        if (nx && r.text.endsWith(" ") && isCJK(r.text.slice(-2, -1)) && isCJK(nx.text.trimStart()[0])) r.text = r.text.slice(0, -1);
      });
      if (p.runs.length) { p.runs[0].text = p.runs[0].text.trimStart(); p.runs[p.runs.length - 1].text = p.runs[p.runs.length - 1].text.trimEnd(); }
      p.runs = p.runs.filter((r) => r.text);
      return p;
    }).filter((p) => p.runs.length);
  };

  // Bounding box and line count for text nodes only (excluding empty inline chips and legend color swatches)
  const textBox = (nodes) => {
    const rs = [];
    const take = (n) => {
      if (n.nodeType === 3) {
        if (!n.textContent.trim()) return;
        const rg = document.createRange(); rg.selectNodeContents(n);
        for (const q of rg.getClientRects()) if (q.width > 0.5 && q.height > 0.5) rs.push(q);
      } else if (n.nodeType === 1 && visible(n) && !MEDIA.has(n.tagName.toLowerCase())) n.childNodes.forEach(take);
    };
    nodes.forEach(take);
    if (!rs.length) return null;
    const L = Math.min(...rs.map((q) => q.left)), T = Math.min(...rs.map((q) => q.top));
    const R = Math.max(...rs.map((q) => q.right)), B = Math.max(...rs.map((q) => q.bottom));
    const sorted = [...rs].sort((a, b) => a.top - b.top);
    let n = 0, bottom = -Infinity;
    for (const q of sorted) { const mid = (q.top + q.bottom) / 2; if (mid > bottom) { n++; bottom = q.bottom; } else bottom = Math.max(bottom, q.bottom); }
    return { left: L, top: T, width: R - L, height: B - T, lines: n };
  };
  const hasBlockChild = (el) => [...el.children].some((c) => visible(c) && !INLINE.has(getComputedStyle(c).display) && c.tagName !== "BR");
  const ownText = (el) => [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
  const textDeep = (el) => (el.textContent || "").trim().length > 0;

  const borders = (st) => ["Top", "Right", "Bottom", "Left"].map((s) => {
    const w = parseFloat(st[`border${s}Width`]);
    const style = st[`border${s}Style`];
    const c = rgba(st[`border${s}Color`]);
    return w > 0 && style !== "none" && style !== "hidden" && c && c.a > 0.05 ? { w, color: c.hex, dash: style === "dashed" || style === "dotted" ? style : null } : null;
  });

  const out = [];
  slides.forEach((s, si) => {
    const sr = s.getBoundingClientRect();
    const rel = (r) => ({ x: r.left - sr.left, y: r.top - sr.top, w: r.width, h: r.height });
    let bg = rgba(getComputedStyle(s).backgroundColor);
    if (!bg || bg.a < 0.05) bg = bodyBg && bodyBg.a > 0.05 ? bodyBg : { hex: "#ffffff", a: 1 };
    const items = [];
    const doneText = new WeakSet();

    const visit = (el, isRoot) => {
      if (!visible(el)) return;
      const tag = el.tagName.toLowerCase();
      const r = el.getBoundingClientRect();
      if (!r.width && !r.height && !el.children.length) return;
      const st = getComputedStyle(el);

      if (MEDIA.has(tag)) {
        if (r.width > 1 && r.height > 1) {
          const id = `img_${si + 1}_${++capId}`;
          el.classList.add(`__cap_${capId}`);
          captures.push({ id, cls: `__cap_${capId}`, mode: "all", rect: { x: r.left + scrollX, y: r.top + scrollY, w: r.width, h: r.height } });
          items.push({ t: "img", ...rel(r), file: `${id}.png` });
        }
        return;
      }

      if (tag === "table") {
        // Convert table to native table (reconstructing matrix grid including rowspan/colspan)
        const grid = [], cells = [], graphicCells = [];
        const isGraphic = (d) => {
          if (!visible(d)) return false;
          if (MEDIA.has(d.tagName.toLowerCase())) return true;
          const ds = getComputedStyle(d), f = rgba(ds.backgroundColor);
          return (f && f.a > 0.05) || (ds.backgroundImage && ds.backgroundImage !== "none") || (ds.clipPath && ds.clipPath !== "none")
            || (borders(ds).some(Boolean) && !(d.textContent || "").trim()); // Border-only shapes (such as hollow circles)
        };
        [...el.rows].forEach((row, ri) => {
          grid[ri] = grid[ri] || [];
          let ci = 0;
          [...row.cells].forEach((cell) => {
            while (grid[ri][ci]) ci++;
            const rs = cell.rowSpan || 1, cs = cell.colSpan || 1;
            for (let a = 0; a < rs; a++) for (let b = 0; b < cs; b++) { grid[ri + a] = grid[ri + a] || []; grid[ri + a][ci + b] = true; }
            const cst = getComputedStyle(cell), cr = cell.getBoundingClientRect();
            const f = rgba(cst.backgroundColor);
            const rowBg = rgba(getComputedStyle(row).backgroundColor);
            const fill = f && f.a > 0.05 ? f : (rowBg && rowBg.a > 0.05 ? rowBg : null);
            cells.push({
              r: ri, c: ci, rs, cs, rect: rel(cr), fill: fill ? fill.hex : null,
              borders: borders(cst), valign: cst.verticalAlign, vert: [cell, ...cell.querySelectorAll("*")].some((d) => /^vertical/.test(getComputedStyle(d).writingMode)),
              pad: ["Top", "Right", "Bottom", "Left"].map((k) => parseFloat(cst[`padding${k}`]) || 0),
              paras: [...cell.querySelectorAll("*")].some(isGraphic) ? (graphicCells.push(cell), []) : paragraphsOf(cell),
            });
            ci += cs;
          });
        });
        const nCols = Math.max(...grid.map((g) => g.length));
        const colW = Array(nCols).fill(null), rowH = [...el.rows].map((row) => row.getBoundingClientRect().height);
        cells.filter((c) => c.cs === 1).forEach((c) => { colW[c.c] = colW[c.c] ?? c.rect.w; });
        const known = colW.filter((v) => v != null), rest = r.width - known.reduce((a, b) => a + b, 0);
        const nUnknown = colW.filter((v) => v == null).length;
        for (let i = 0; i < nCols; i++) if (colW[i] == null) colW[i] = nUnknown ? rest / nUnknown : 0;
        items.push({ t: "table", ...rel(r), cols: colW, rows: rowH, cells });
        // Cells containing bars, heatmaps, Harvey balls, etc.: overlay contents as shapes and text on top of the table
        for (const cell of graphicCells) for (const c of cell.children) visit(c, false);
        for (const cell of graphicCells) if (ownText(cell)) visitOwnText(cell);
        return;
      }

      // Fills, borders, polygons (root slide background color is treated separately as slide background)
      if (!isRoot) {
        const f = rgba(st.backgroundColor);
        const b = borders(st);
        const poly = polygonOf(el, r);
        const rr = st.borderTopLeftRadius || "0";
        const ellipse = /%/.test(rr) && parseFloat(rr) >= 50; // 50% border radius = ellipse (or circle if square)
        const radius = /%/.test(rr) ? (parseFloat(rr) / 100) * Math.min(r.width, r.height) : (parseFloat(rr) || 0);
        const hasFill = f && f.a > 0.05;
        // Zero-width/height element with border only = CSS triangle. Create polygon from colored side
        if (el.clientWidth === 0 && el.clientHeight === 0 && b.filter(Boolean).length === 1) {
          const [bt, br, bb, bl] = ["Top", "Right", "Bottom", "Left"].map((k) => parseFloat(st[`border${k}Width`]) || 0);
          const W = r.width, H = r.height, k = b.findIndex(Boolean);
          const tri = [[[0, 0], [W, 0], [bl, bt]], [[W, 0], [W, H], [bl, bt]], [[0, H], [W, H], [bl, bt]], [[0, 0], [0, H], [bl, bt]]][k];
          items.push({ t: "rect", ...rel(r), fill: b[k].color, alpha: 1, poly: tri, radius: 0, line: null });
          return;
        }
        if (st.backgroundImage && st.backgroundImage !== "none" && r.width > 2 && r.height > 2) {
          const id = `img_${si + 1}_${++capId}`;
          el.classList.add(`__cap_${capId}`);
          captures.push({ id, cls: `__cap_${capId}`, mode: "self", rect: { x: r.left + scrollX, y: r.top + scrollY, w: r.width, h: r.height } });
          items.push({ t: "img", ...rel(r), file: `${id}.png` });
        }
        if (hasFill || (poly && hasFill)) {
          const same = b.every((x) => x && b[0] && x.w === b[0].w && x.color === b[0].color);
          items.push({ t: "rect", ...rel(r), fill: f.hex, alpha: f.a, poly, ellipse, radius: Math.min(radius, Math.min(r.width, r.height) / 2),
                       line: same ? b[0] : null });
          if (!same) b.forEach((x, k) => x && items.push(edge(r, k, x)));
        } else if (b.some(Boolean)) {
          const same = b.every((x) => x && b[0] && x.w === b[0].w && x.color === b[0].color);
          if (same) items.push({ t: "rect", ...rel(r), fill: null, alpha: 1, poly: null, ellipse, radius: Math.min(radius, Math.min(r.width, r.height) / 2), line: b[0] });
          else b.forEach((x, k) => x && items.push(edge(r, k, x)));
        }
      }

      // Text: elements without block children become a single text box
      if (textDeep(el) && !hasBlockChild(el) && !doneText.has(el)) {
        const tr = textBox([el]) || el.getBoundingClientRect();
        const lines = tr.lines || 1;
        const cs = getComputedStyle(el);
        const padL = parseFloat(cs.paddingLeft) + parseFloat(cs.borderLeftWidth), padR = parseFloat(cs.paddingRight) + parseFloat(cs.borderRightWidth);
        const content = { left: r.left + padL, width: r.width - padL - padR };
        const paras = paragraphsOf(el);
        const hang = paras[0]?.hang || 0;
        const vert = /^vertical/.test(cs.writingMode);
        const isTitle = el.matches("h1, h2.st, h2.title, .ttl, .title, .msg");
        if (paras.length) items.push({
          role: isTitle ? "title" : undefined,
          t: "text", x: (lines > 1 || vert ? content.left : tr.left) - sr.left - hang, y: tr.top - sr.top,
          w: (lines > 1 || vert ? content.width : tr.width) + hang, h: tr.height, lines: vert ? 2 : lines, paras, vert,
        });
        el.querySelectorAll("*").forEach((d) => doneText.add(d));
        // Continue picking up child fills (inline chips, etc.)
        for (const c of el.children) visit(c, false);
        return;
      }
      // Mixed block children and plain text: visit plain text nodes individually (do nothing if already captured in parent text box)
      if (ownText(el) && !doneText.has(el)) visitOwnText(el);
      for (const c of el.children) visit(c, false);
    };
    // Elements mixing block children and plain text (e.g. li with body text + nested ul).
    // Group consecutive inlines (text nodes, inline elements) into single text boxes
    // Inline elements with fills or borders (tag chips, etc.) become separate text boxes without mixing with surrounding text
    const isChip = (n) => {
      if (n.nodeType !== 1) return false;
      const st = getComputedStyle(n), f = rgba(st.backgroundColor);
      return (f && f.a > 0.05) || borders(st).some(Boolean);
    };
    const visitOwnText = (el) => {
      const cs = getComputedStyle(el);
      const groups = [];
      let g = [];
      for (const n of el.childNodes) {
        const inline = n.nodeType === 3 || (n.nodeType === 1 && visible(n) && INLINE.has(getComputedStyle(n).display) && !MEDIA.has(n.tagName.toLowerCase()) && !isChip(n));
        if (isChip(n)) continue; // Chips are visited separately as children
        if (inline && n.nodeType === 1 && n.tagName === "BR") { g.push(n); continue; }
        if (inline) g.push(n); else { if (g.length) groups.push(g); g = []; }
      }
      if (g.length) groups.push(g);
      const padL = parseFloat(cs.paddingLeft) + parseFloat(cs.borderLeftWidth), padR = parseFloat(cs.paddingRight) + parseFloat(cs.borderRightWidth);
      const er = el.getBoundingClientRect();
      groups.forEach((grp, gi) => {
        if (!grp.some((n) => (n.textContent || "").trim())) return;
        const tr = textBox(grp);
        if (!tr) return;
        const lines = tr.lines;
        const mk = gi === 0 ? marker(el) : null;
        const mkPara = () => ({ align: cs.textAlign, lineHeight: parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.5, runs: [], hang: 0 });
        const paras = [mkPara()];
        if (mk) { paras[0].bullet = mk; paras[0].hang = hangOf(el); }
        const add = (node) => {
          if (node.nodeType === 3) { const t = collapse(node.textContent); const cur = paras[paras.length - 1]; if (t.trim() || cur.runs.length) cur.runs.push({ text: tt(node.parentElement, t), ...runStyle(node.parentElement) }); }
          else if (node.nodeType === 1 && node.tagName === "BR") paras.push(mkPara());
          else if (node.nodeType === 1 && visible(node)) node.childNodes.forEach(add);
        };
        grp.forEach(add);
        for (const para of paras) {
          para.runs.forEach((r) => { r.text = r.text.replace(/([\u3000-\u9fff\uff00-\uffef]) (?=[\u3000-\u9fff\uff00-\uffef])/g, "$1"); });
          if (para.runs.length) { para.runs[0].text = para.runs[0].text.trimStart(); para.runs[para.runs.length - 1].text = para.runs[para.runs.length - 1].text.trimEnd(); }
          para.runs = para.runs.filter((r) => r.text);
        }
        const kept = paras.filter((p) => p.runs.length);
        if (!kept.length) return;
        const hang = kept[0].hang || 0;
        const left = lines > 1 ? er.left + padL : tr.left;
        items.push({ t: "text", x: left - sr.left - hang, y: tr.top - sr.top, w: (lines > 1 ? er.width - padL - padR : tr.width) + hang,
                     h: tr.height, lines: kept.length > 1 ? Math.max(lines, 2) : lines, paras: kept });
      });
      el.querySelectorAll(":scope > *").forEach((c) => { if (INLINE.has(getComputedStyle(c).display) && !isChip(c)) { doneText.add(c); c.querySelectorAll("*").forEach((d) => doneText.add(d)); } });
    };
    const edge = (r, k, b) => {
      const L = r.left - sr.left, T = r.top - sr.top, R = L + r.width, B = T + r.height, h = b.w / 2;
      const seg = [[L, T + h, R, T + h], [R - h, T, R - h, B], [L, B - h, R, B - h], [L + h, T, L + h, B]][k];
      return { t: "line", x1: seg[0], y1: seg[1], x2: seg[2], y2: seg[3], color: b.color, w: b.w, dash: b.dash };
    };
    visit(s, true);
    out.push({ n: si + 1, bg: bg.hex, items });
  });
  const s0 = slides[0]?.getBoundingClientRect();
  return { slideW: s0 ? s0.width : 1280, slideH: s0 ? s0.height : 720, slides: out, captures };
};

let data;
try { data = await page.evaluate(collect); } catch (e) { console.error(String(e.message || e)); await page.close(); process.exit(4); }

// ---- Image clipping (hide other elements and capture as transparent PNG) ------------------------------
await page.send("Emulation.setDefaultBackgroundColorOverride", { color: { r: 0, g: 0, b: 0, a: 0 } });
for (const c of data.captures) {
  const css = c.mode === "self"
    ? `html *{visibility:hidden!important}.${c.cls}{visibility:visible!important}.${c.cls} *{visibility:hidden!important}`
    : `html *{visibility:hidden!important}.${c.cls},.${c.cls} *{visibility:visible!important}`;
  await page.evaluate((css) => {
    let st = document.getElementById("__capstyle");
    if (!st) { st = document.createElement("style"); st.id = "__capstyle"; document.head.appendChild(st); }
    st.textContent = css;
  }, css);
  const { data: b64 } = await page.send("Page.captureScreenshot", {
    format: "png", captureBeyondViewport: true, fromSurface: true,
    clip: { x: c.rect.x, y: c.rect.y, width: c.rect.w, height: c.rect.h, scale: SCALE },
  });
  writeFileSync(join(outdir, `${c.id}.png`), Buffer.from(b64, "base64"));
}
delete data.captures;
writeFileSync(join(outdir, "dump.json"), JSON.stringify(data));
await page.close();
console.log(`${data.slides.length} slides → ${join(outdir, "dump.json")}`);
process.exit(0);
