#!/usr/bin/env python3
"""Measure formatting of existing PowerPoint presentations and export to skin.json.

Usage:
  python3 measure_deck.py house.pptx                 # Display summary and output house.skin.json in the same folder
  python3 measure_deck.py house.pptx -o skin.json
  python3 measure_deck.py house.potx                 # PowerPoint templates (.potx) can also be measured
  python3 measure_deck.py house.pptx --layout "Title and Content"   # Specify body slide layout by name

The output is read by deck_pptx.py (building slides directly onto the deck's master) and check_deck.py --house (validating formatting compliance).
Measures: most frequently used body slide layout, title/subtitle boxes, font sizes, whether font typeface is explicitly set on runs,
textbox padding and list styling (lstStyle), rule line colors and widths, presence of table objects, emphasis and panel fills, and page number origin.

Colors retain up to 3 candidates per role (emphasis, panel, accent) ordered by frequency (color_options), selectable when building.
Even if the presentation uses HEX colors, matching theme colors or their tints (e.g. PowerPoint's "Lighter 40%") are converted to theme color references.
This ensures colors adapt even if the destination presentation's theme changes.
Values are a mechanical starting point. Always visually verify against the presentation before use (slide-rules §8.7).
Dependency: python-pptx.
"""
import collections
import colorsys
import json
import re
import sys
import zipfile
from pathlib import Path

if hasattr(sys.stdout, "reconfigure") and sys.stdout.encoding:
    sys.stdout.reconfigure(errors="replace")
if hasattr(sys.stderr, "reconfigure") and sys.stderr.encoding:
    sys.stderr.reconfigure(errors="replace")

EMU = 914400
A = "{http://schemas.openxmlformats.org/drawingml/2006/main}"
P = "{http://schemas.openxmlformats.org/presentationml/2006/main}"
NEUTRAL = {"tx1", "bg1", "dk1", "lt1", "000000", "FFFFFF"}
NG_RED = "FF0000"   # Red for X. Semantic red is never aligned to brand colors (§5.8). Can be changed in skin colors.ng
# Tint levels (lumMod, lumOff) appearing in PowerPoint color pickers. Tested when mapping HEX colors to theme colors
TINTS = [(None, None), (20000, 80000), (40000, 60000), (60000, 40000), (75000, None), (50000, None),
         (50000, 50000), (65000, 35000), (75000, 25000), (85000, 15000), (95000, 5000),
         (95000, None), (85000, None), (65000, None), (90000, None)]
SLOTS = ("tx1", "bg1", "tx2", "bg2", "accent1", "accent2", "accent3", "accent4", "accent5", "accent6")


def inch(v):
    return None if v is None else round(v / EMU, 2)


def color_spec(el):
    """Construct 'accent2|lumMod=20000|lumOff=80000' form from an element with <a:solidFill>. Return None if absent."""
    fill = el.find(A + "solidFill") if el is not None else None
    if fill is None or not len(fill):
        return None
    c = fill[0]
    name = c.get("val")
    if name is None:
        return None
    if c.tag == A + "srgbClr":
        name = name.upper()
    return "|".join([name] + [f"{ch.tag[len(A):]}={ch.get('val')}" for ch in c if ch.tag[len(A):] != "alpha"])


def theme_colors(theme_xml, master_xml):
    """Map slide color name (tx1, accent2, etc.) to HEX in the presentation theme via master clrMap."""
    slots = {}
    for slot, body in re.findall(r"<a:(dk1|lt1|dk2|lt2|accent\d|hlink|folHlink)>(.*?)</a:\1>", theme_xml, re.S):
        m = re.search(r'(?:srgbClr val|lastClr)="([0-9A-Fa-f]{6})"', body)
        if m:
            slots[slot] = m.group(1).upper()
    cmap = dict(re.findall(r'\b(bg1|tx1|bg2|tx2)="(\w+)"', (re.search(r"<p:clrMap[^>]*>", master_xml) or [""])[0]))
    cmap = {**{"bg1": "lt1", "tx1": "dk1", "bg2": "lt2", "tx2": "dk2"}, **cmap}
    return {name: slots.get(cmap.get(name, name)) for name in SLOTS if slots.get(cmap.get(name, name))}


def _tint(hexv, mod, off):
    r, g, b = (int(hexv[i:i + 2], 16) / 255 for i in (0, 2, 4))
    h, l, s = colorsys.rgb_to_hls(r, g, b)
    l = min(1.0, max(0.0, l * (mod or 100000) / 100000 + (off or 0) / 100000))
    return tuple(round(v * 255) for v in colorsys.hls_to_rgb(h, l, s))


def to_theme(spec, theme):
    """Convert HEX color ('808080') to theme color notation if it matches a theme color or tint. Otherwise keep as-is."""
    if not spec or not re.fullmatch(r"[0-9A-F]{6}", spec):
        return spec
    want = tuple(int(spec[i:i + 2], 16) for i in (0, 2, 4))
    for mod, off in TINTS:
        for name, hexv in theme.items():
            if max(abs(a - b) for a, b in zip(_tint(hexv, mod, off), want)) <= 2:
                return "|".join([name] + ([f"lumMod={mod}"] if mod else []) + ([f"lumOff={off}"] if off else []))
    return spec


def top(counter, skip=(), n=1):
    items = [k for k, _ in counter.most_common() if k not in skip]
    return (items[0] if items else None) if n == 1 else items[:n]


def pick_body_layout(slides, with_title):
    """Select layout for body slides based on frequency of use.

    In sample decks where Title, Section, and Body appear once each (common in template distributions),
    frequencies tie and the first (Title) might be chosen. In case of ties:
      1. Layouts where the title frame is not center title (ctrTitle = for title/section dividers)
      2. Layouts used later in the presentation (title comes first)
    preferring whichever looks more like a body slide.
    """
    from pptx.enum.shapes import PP_PLACEHOLDER

    use = collections.Counter(s.slide_layout.name for s in slides)
    last = {s.slide_layout.name: i for i, s in enumerate(slides)}

    def plain_title(name):
        return any(ph.placeholder_format.type == PP_PLACEHOLDER.TITLE for ph in with_title[name].placeholders)

    cands = [n for n in use if n in with_title]
    if not cands:
        return None
    return max(cands, key=lambda n: (use[n], plain_title(n), last[n]))


def measure(path, layout=None):
    """layout: Body slide layout name. If omitted, selected via pick_body_layout."""
    from lxml import etree
    from pptx.enum.shapes import PP_PLACEHOLDER
    from pptx_open import open_presentation

    prs = open_presentation(path)   # .potx (templates) can also be measured directly
    sw, sh = prs.slide_width, prs.slide_height
    slides = list(prs.slides)
    if not slides:
        sys.exit("Cannot measure a deck with 0 slides (formatting is read from actual slides)")

    # ---- Body slide layout (one with a title frame). If not specified, chosen by usage
    use = collections.Counter(s.slide_layout.name for s in slides)
    with_title = {l.name: l for l in prs.slide_layouts
                  if any(ph.placeholder_format.type in (PP_PLACEHOLDER.TITLE, PP_PLACEHOLDER.CENTER_TITLE)
                         for ph in l.placeholders)}
    if layout is not None:
        if layout not in with_title:
            sys.exit(f"Layout '{layout}' not found among layouts with title frames (candidates: {', '.join(with_title)})")
        layout_name = layout
    else:
        layout_name = pick_body_layout(slides, with_title)
    title, subtitle = None, None
    if layout_name:
        lay = with_title[layout_name]
        master_sz = re.search(r"<p:titleStyle>.*?<a:defRPr[^>]*\bsz=\"(\d+)\"",
                              etree.tostring(lay.slide_master._element, encoding="unicode"), re.S)
        for ph in lay.placeholders:
            kind = ph.placeholder_format.type
            geo = dict(x=inch(ph.left), y=inch(ph.top), w=inch(ph.width), h=inch(ph.height))
            if kind in (PP_PLACEHOLDER.TITLE, PP_PLACEHOLDER.CENTER_TITLE):
                title = dict(geo, default_size=int(master_sz.group(1)) / 100 if master_sz else None)
            elif kind == PP_PLACEHOLDER.SUBTITLE:
                subtitle = geo

    sizes, bold_sizes, title_sizes = collections.Counter(), collections.Counter(), collections.Counter()
    run_colors, fonts = collections.Counter(), collections.Counter()
    runs_total = runs_font = 0
    insets, lst_styles = collections.Counter(), collections.Counter()
    rule_colors, rule_widths = collections.Counter(), collections.Counter()
    panel_fills, small_fills, palette = collections.Counter(), collections.Counter(), collections.Counter()
    native_tables = slidenum_slides = 0
    tops, bottoms = [], []

    for s in slides:
        root = s._element
        xml = etree.tostring(root, encoding="unicode")
        if s.slide_layout.name == layout_name:
            native_tables += xml.count("<a:tbl>")
        slidenum_slides += 'type="slidenum"' in xml
        for v in re.findall(r'<a:srgbClr val="([0-9A-Fa-f]{6})"', xml):
            palette[v.upper()] += 1
        for v in re.findall(r'<a:schemeClr val="([^"]+)"', xml):
            palette[v] += 1
        if s.shapes.title is not None and s.slide_layout.name == layout_name:
            for para in s.shapes.title.text_frame.paragraphs:
                for r in para.runs:
                    if r.text.strip():
                        title_sizes[r.font.size.pt if r.font.size else (title or {}).get("default_size")] += 1
        floor = (title["y"] + title["h"] - 0.15) * EMU if title else 0
        body = [x for x in s.shapes if not x.is_placeholder and x.top is not None and x.height and x.width
                and x.top >= floor]
        if body and s.slide_layout.name == layout_name:
            tops.append(min(x.top for x in body))
            bottoms.append(max(x.top + x.height for x in body))

        for sp in root.iter(P + "sp"):
            is_ph = sp.find(f"{P}nvSpPr/{P}nvPr/{P}ph") is not None
            spPr = sp.find(P + "spPr")
            txBody = sp.find(P + "txBody")
            is_box = sp.find(f"{P}nvSpPr/{P}cNvSpPr").get("txBox") == "1"
            if txBody is not None and not is_ph:
                for r in txBody.iter(A + "r"):
                    t = r.findtext(A + "t") or ""
                    rPr = r.find(A + "rPr")
                    if not t.strip() or rPr is None:
                        continue
                    runs_total += 1
                    if rPr.get("sz"):
                        sizes[int(rPr.get("sz")) / 100] += len(t)
                        if rPr.get("b") == "1":
                            bold_sizes[int(rPr.get("sz")) / 100] += 1
                    c = color_spec(rPr)
                    if c:
                        run_colors[c] += 1
                    face = [f.get("typeface") for f in (rPr.find(A + "latin"), rPr.find(A + "ea")) if f is not None]
                    face = [f for f in face if f and not f.startswith("+")]
                    if face:
                        runs_font += 1
                        fonts[face[0]] += 1
                if is_box:
                    bp = txBody.find(A + "bodyPr")
                    insets[tuple(int(bp.get(k, d)) for k, d in
                                 (("lIns", 91440), ("tIns", 45720), ("rIns", 91440), ("bIns", 45720)))] += 1
                    ls = txBody.find(A + "lstStyle")
                    lst_styles[etree.tostring(ls, encoding="unicode") if ls is not None and len(ls) else ""] += 1
            if spPr is not None and not is_ph:
                fill = color_spec(spPr)
                ext = spPr.find(f"{A}xfrm/{A}ext")
                geom = spPr.find(A + "prstGeom")
                if fill and ext is not None:
                    w, h = int(ext.get("cx")), int(ext.get("cy"))
                    area = w * h / (sw * sh)
                    if 0.06 <= area < 0.9 and (geom is None or geom.get("prst") == "rect"):
                        panel_fills[fill] += 1
                    elif geom is not None and geom.get("prst") == "ellipse" and max(w, h) <= 0.6 * EMU:
                        small_fills[fill] += 1
        for cx in root.iter(P + "cxnSp"):
            ln = cx.find(f"{P}spPr/{A}ln")
            ext = cx.find(f"{P}spPr/{A}xfrm/{A}ext")
            if ln is None or ext is None or int(ext.get("cy")) != 0:   # Horizontal rules only
                continue
            c = color_spec(ln)
            if c:
                rule_colors[c] += 1
            if ln.get("w"):
                rule_widths[round(int(ln.get("w")) / 12700, 2)] += 1

    # ---- Font sizes (body = most frequent; dense = largest below body with >= 5% share; head = most frequent bold above body)
    total = sum(sizes.values()) or 1
    body_sz = top(sizes)
    smaller = sorted((s for s, n in sizes.items() if body_sz and s < body_sz and n / total >= 0.05), reverse=True)
    head_sz = top(collections.Counter({s: n for s, n in bold_sizes.items() if body_sz and body_sz < s <= body_sz * 2}))

    # ---- List styles (if majority of textboxes share the same lstStyle, mirror it)
    lst, bullet_lvl = None, None
    best = top(lst_styles, skip=("",))
    if best and lst_styles[best] / sum(lst_styles.values()) >= 0.3:
        lst = re.sub(r'\s+xmlns:\w+="[^"]+"', "", best)
        for i, lv in enumerate(re.findall(r"<a:lvl\dpPr.*?</a:lvl\dpPr>", lst, re.S)):
            ch = re.search(r'<a:buChar char="([^"]*)"', lv)
            if ch and ch.group(1).strip("​‌‍﻿ "):
                bullet_lvl = i
                break

    theme = ""
    with zipfile.ZipFile(path) as z:
        names = [n for n in z.namelist() if re.match(r"ppt/theme/theme\d+\.xml$", n)]
        theme = z.read(sorted(names)[0]).decode("utf8", "ignore") if names else ""
        masters = sorted(n for n in z.namelist() if re.match(r"ppt/slideMasters/slideMaster\d+\.xml$", n))
        master = z.read(masters[0]).decode("utf8", "ignore") if masters else ""
        layouts_xml = " ".join(z.read(n).decode("utf8", "ignore") for n in z.namelist()
                                if n.startswith(("ppt/slideLayouts/slideLayout", "ppt/slideMasters/slideMaster")))
    major = re.search(r'<a:majorFont><a:latin typeface="([^"]*)"', theme)
    minor = re.search(r'<a:minorFont><a:latin typeface="([^"]*)"', theme)
    page_number = ("layout" if 'type="slidenum"' in layouts_xml and slidenum_slides < len(slides) / 2
                   else "slide" if slidenum_slides >= len(slides) / 2 else "none")

    row_w = top(rule_widths)
    heavier = [w for w, _ in rule_widths.most_common() if row_w and w > row_w]
    ins = top(insets) or (91440, 45720, 91440, 45720)
    x0 = title["x"] if title else 0.5
    x1 = round(title["x"] + title["w"], 2) if title else round(sw / EMU - 0.5, 2)
    median = lambda v: sorted(v)[len(v) // 2] if v else None  # noqa: E731
    tc = theme_colors(theme, master)

    def options(counter):
        """Candidates per role (up to 3 in descending order, mapped to theme color, duplicates merged)"""
        out = []
        for spec in top(counter, skip=NEUTRAL, n=10):
            spec = to_theme(spec, tc)
            if spec not in out and spec.split("|")[0] not in NEUTRAL:
                out.append(spec)
        return out[:3]

    opts = {"emphasis": options(run_colors), "panel": options(panel_fills), "accent": options(small_fills)}
    rule_color = to_theme(top(rule_colors) or "7F7F7F", tc)
    used = {to_theme(v, tc).split("|")[0] for v in palette} | set(palette)

    return {
        "source": Path(path).name,
        "slide": {"w": inch(sw), "h": inch(sh), "emu": [sw, sh]},
        "layout": layout_name,
        "layouts_used": dict(use.most_common(6)),
        "title": dict(title or {}, size=top(title_sizes), sizes_seen=dict(title_sizes.most_common(5))) if title else None,
        "subtitle": subtitle,
        "margin": {"x0": x0, "x1": x1, "body_top": inch(median(tops)),
                   "bottom": min(inch(median(bottoms)) or 99, round(sh / EMU - 0.4, 2))},
        "sizes": {"head": head_sz or body_sz, "body": body_sz, "dense": smaller[0] if smaller else body_sz,
                  "seen": {str(k): v for k, v in sizes.most_common(8)}},
        "fonts": {"inherit": runs_total == 0 or runs_font / runs_total < 0.5,
                  "explicit_share": round(runs_font / runs_total, 2) if runs_total else 0.0,
                  "explicit": top(fonts), "theme_major": major.group(1) if major else None,
                  "theme_minor": minor.group(1) if minor else None},
        "textbox": {"insets": [inch(v) for v in ins], "lst_style": lst, "bullet_level": bullet_lvl},
        "rule": {"color": rule_color, "row": row_w or 0.5,
                 "head": heavier[0] if heavier else (row_w or 0.5) * 2},
        "tables": {"native": native_tables, "slides": len(slides)},
        "colors": dict({k: (v[0] if v else None) for k, v in opts.items()}, ng=NG_RED),
        "color_options": opts,
        "theme_colors": tc,
        "palette": sorted(used),
        "page_number": page_number,
    }


def summary(k):
    t, f, m = k["title"] or {}, k["fonts"], k["margin"]
    lines = [
        f"Deck: {k['source']} ({k['slide']['w']} × {k['slide']['h']} in, {k['tables']['slides']} slides)",
        f"Layout: {k['layout']} (usage count: {k['layouts_used']})",
        f"Title: x {t.get('x')} y {t.get('y')} width {t.get('w')} height {t.get('h')}, {t.get('size')}pt"
        f" (default {t.get('default_size')}pt, measured {t.get('sizes_seen')})" if t else "Title: No layout with title frame found",
        f"Subtitle: {'y ' + str(k['subtitle']['y']) if k['subtitle'] else 'None'}",
        f"Body area: x {m['x0']} - {m['x1']}, top {m['body_top']}, bottom {m['bottom']}",
        f"Font sizes: Head {k['sizes']['head']}pt, Body {k['sizes']['body']}pt, Dense {k['sizes']['dense']}pt (measured {k['sizes']['seen']})",
        f"Typeface: {'Theme default (not set on run)' if f['inherit'] else 'Explicitly specified ' + str(f['explicit'])}"
        f" (explicit share: {f['explicit_share']}, theme: {f['theme_major']} / {f['theme_minor']})",
        f"Textbox: Padding {k['textbox']['insets']}, List styling: {'Present (bullet lvl=' + str(k['textbox']['bullet_level']) + ')' if k['textbox']['lst_style'] else 'None'}",
        f"Rules: {k['rule']['color']}, Row {k['rule']['row']}pt, Under heading {k['rule']['head']}pt",
        f"Tables: Native table objects on body slides: {k['tables']['native']}" + (" (constructed using textboxes + rules)" if not k['tables']['native'] else ""),
        f"Colors: Emphasis {k['colors']['emphasis']}, Panel {k['colors']['panel']}, Accent {k['colors']['accent']}, ✕ {k['colors']['ng']}",
        f"Color options (select via d.c(role, index)): " + " | ".join(f"{r} {v}" for r, v in k["color_options"].items()),
        f"Page numbers: {dict(layout='Provided by layout (do not place on slide)', slide='Placed on each slide', none='None')[k['page_number']]}",
    ]
    return "\n".join(lines)


def main():
    args = sys.argv[1:]
    out = layout = None
    if "-o" in args:
        i = args.index("-o")
        out = args[i + 1]
        del args[i:i + 2]
    if "--layout" in args:
        i = args.index("--layout")
        layout = args[i + 1]
        del args[i:i + 2]
    if not args:
        sys.exit(__doc__)
    src = Path(args[0])
    skin = measure(src, layout=layout)
    out = Path(out) if out else src.with_suffix(".skin.json")
    out.write_text(json.dumps(skin, ensure_ascii=False, indent=2), encoding="utf8")
    print(summary(skin))
    print(f"\n→ {out} (visually verify and adjust before use)")


if __name__ == "__main__":
    main()
