---
name: consulting-pptx-skill
description: A skill for producing boardroom-quality presentation slides anchored in the slide design rulebook slide-rules.md. Read the rulebook before drafting, assemble an initial deck from the HTML component libraries (62 archetypes: 27 base + 35 additional), adjust flexibly within the boundaries of the rules without being constrained by archetypes, and finish with 0 FAILs on the automated check_deck.py test. The archetype catalog is an idea book for layouts, not a rigid mold. When provided with an existing PowerPoint file and asked to create insertion pages in PPTX format, build directly on top of that document's master template (slide-rules §8.7). Example triggers: "Create consulting-quality slides", "Build a deck adhering to the rules", "Select from the archetype catalog", "Add pages to this pptx in the same format".
---

# Consulting-Style Slide Creation Skill

The foundation of this skill is `references/slide-rules.md`. Read the full rulebook before drafting, assemble a starting draft using the HTML component libraries, adjust flexibly within the rule boundaries, and finish with 0 FAILs on automated checks plus visual verification. The component libraries and archetype catalog are tools to satisfy the rules efficiently: **never force a slide into an archetype; choose archetypes to serve your storyline, and discard or adapt them freely if they do not fit.**

Deliverables are HTML (16:9 aspect ratio, 1 section = 1 slide) and PDF printed via headless Chrome.

## Files and When to Read/Use Them

| File | Content | When to Read / Use |
| --- | --- | --- |
| `references/slide-rules.md` | Canonical design rules | **Mandatory reading. Read in full before drafting** |
| `references/archetype-catalog.md` | Catalog of 62 archetypes (Archetype ID, name, best use cases, component library source) | When assigning visual layouts to each storyline item |
| `references/content-review-prompt.md` | Fresh-eye review instructions | After passing automated checks, before final delivery |
| `references/ai-smell-lexicon.md` | List of AI smell / AI slop words, syntax, and tone markers | During final text polishing and self-check |
| `templates/freeform_parts_16x9.html` | Base component library (27 parts: title page, overview map, chevrons, premise-to-conclusion, tables with axes, claim panels, evaluation matrices, distributions, etc.). Start here | Step 3 |
| `templates/freeform_parts_more_16x9.html` | Additional component library (35 parts: executive summaries, stacked bars, bridges/waterfalls, scatter plots, comparison tables, 2x2 matrices, roadmaps, Gantt charts, etc.). Use when base parts are insufficient | Step 3 |
| `assets/SlideCatalog_16x9.pdf` | 62-page visual catalog printed from both component libraries (pp. 1–27 base, pp. 28–62 additional) | When visually browsing layout archetypes |
| `scripts/new_deck.py` | Assembles a single HTML deck by specifying part numbers | Step 3 |
| `scripts/check_deck.py` | Automated rule checker (standard library only for HTML) | Step 6 |
| `scripts/check_layout.mjs` | Live rendering inspection for overlaps, overflow, and excessive whitespace (`npm run setup` installs Playwright) | Step 7 |
| `tests/test_checks.py` | Self-tests for automated checks (verifies failure on unfixed versions and pass on fixed versions) | When adding or updating automated checks |
| `scripts/html_to_pptx.py` | Converts finalized HTML into editable PPTX (uses `html_dump.mjs` and `lib_cdp.mjs`) | Only when the user explicitly requests PPTX |
| `assets/SuperTemplate_62type.pptx` | 62-archetype PPTX sample deck (all slides fully editable) | Reference when assembling PPTX manually |
| `scripts/measure_deck.py` | Measures styles of existing PowerPoint decks (`.pptx` / template `.potx`) and outputs `skin.json` | When building insertion pages for existing decks (Step 1) |
| `scripts/deck_pptx.py` | Library for building pages directly on top of an existing deck's master template (sample in `examples/house_deck_example.py`) | Same as above |
| `local/` (untracked in git) | Organization-specific rules (`slide-rules.local.md`), forbidden terms (`forbid.txt`), custom templates (`local/README.md`) | Read immediately after base rules if present; skip if absent |

## Key Rule Highlights (Entry Points — Always Read the Full Rules)

- **Titles**: State the conclusion. Default to 1 line; break into 2 lines at natural semantic boundaries if long (never shrink font size to squeeze into 1 line). Avoid polite fluff or casual endings. Reading only the titles consecutively must form a cohesive narrative.
- **Layout**: 1 slide = 1 message. Left = facts / visuals, Right = implications / So What. Never place bottom "POINT" or "KEY TAKEAWAY" banner blocks.
- **Tables**: Use structured tables with explicit axes (rows = items, columns = perspectives). Header text must be larger than body text and bold, with no background fill. No border below the bottom row.
- **Decoration**: No rounded corners. No borders on filled background boxes. If using color categorization, provide an explicit legend on the same slide.
- **Visuals**: Plot trends, composition breakdowns, distributions, and correlations as charts. Never dump chart-appropriate data into a plain table (§5.11).
- **Numbers**: Match numbers stated in titles with item counts in the body (§2.9). Do not put pure item counts in titles (§2.4).
- **Writing**: One term per document. Expand acronyms upon first appearance. Keep bullet endings parallel within the same indentation level.

## Workflow

1. **Define Before Producing**: Agree on the objective, deliverable definition, and in-scope / out-of-scope boundaries in 3–5 lines beforehand.
2. **Draft the Storyline**: Write a storyline (one title per slide) and specify the visual approach for each line (chart / table / chevron / 2-column / stat cards). Trends, composition, distribution, and correlation must always be charts. Refer to `references/archetype-catalog.md` when deciding on layouts.
   - Section dividers use archetype b27 (agenda divider). Sections are marked `<section class="s chap">` and omitted from page numbering (§4.45). Decks with ~10 slides or fewer do not need section dividers.
   - Table column widths: When columns contain homogeneous data (time periods, options, departments), use `<table class="eq">` for equal column widths to prevent whitespace from accumulating exclusively in the rightmost column. Reserve extra width only for description / bullet columns.
   - When facing slide limits, cut in this order: Section dividers & table of contents → Body slides overlapping with the overview map → Supplementary / appendix slides. Keep the title page, overview map, conclusion slide, and back cover. Consolidate risks and mitigations into a single slide (§4.29).
3. **Generate the Draft Deck**:
   ```bash
   python3 scripts/new_deck.py --list                                   # List part numbers and archetype names (b01–b27 base / m01–m35 additional)
   python3 scripts/new_deck.py --parts b01,b02,m05,b06,b09,b10 --title "Deck Title" -o mydeck.html
   ```
   The script merges CSS from both libraries, standardizes header styles, and renumbers pages. Do not copy and stitch HTML manually. After generation, replace all placeholders (`Text N`, `Label N`, `YYYY`) with real content.
4. **Draw charts from scratch**: When a slide requires a chart, do not force data into a table component.
5. **Refine and Adjust**: Split dense tables across two slides, rewrite right-hand columns into crisp implications, align parallel bullet granularities. Question every slide: "Is this archetype truly optimal?" For every piece of review feedback, add a 1-line rule to `slide-rules.md`, and turn measurable rules into automated checks (slide-rules §8: "Turn feedback into both a 1-line rule and an automated check").
6. `python3 scripts/check_deck.py mydeck.html` → Must achieve FAIL 0 (empty title WARNs on title page, back cover, and section dividers are acceptable). Read through the printed list of titles sequentially. Placeholders remaining in body text, titles retaining raw archetype names, or blocks containing two or more run-on sentences will trigger FAILs.
   - For client-facing decks, check against a forbidden terms list containing client names, internal jargon, and project codes (placed outside the repository): `python3 scripts/check_deck.py mydeck.html --forbid ~/.config/deck-forbidden-terms.txt`. This catches terms in HTML comments and attributes without echoing the forbidden words in stdout.
7. `node scripts/check_layout.mjs mydeck.html` → Must pass OK (specify `PLAYWRIGHT_MODULE_DIR` if Playwright is installed elsewhere). Pages with over 40% unused vertical canvas space will trigger FAILs.
8. **Fresh-Eye Review**: Hand the review prompt in `references/content-review-prompt.md` to an independent agent without revealing the creation instructions. Compile feedback into a disposition table (Accept / Reject / Hold + rationale), fix accepted items, and re-run steps 6 and 7.
9. **Export to PDF and visually inspect every page**: Automated checks catch overlaps, overflows, and rule violations. Only visual inspection reveals compressed bars, blank figures, bottom-heavy whitespace, orphaned words, or misaligned bottom baselines. Feel free to tweak component CSS in your deck (reflect worthwhile improvements back into `templates/`).
   ```bash
   "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu \
     --no-pdf-header-footer --print-to-pdf=mydeck.pdf mydeck.html
   ```

## When PowerPoint (.pptx) Is Required

**Finalize the deck in HTML first. Convert to PPTX only when the user explicitly requests PPTX.** Run all revision and review iterations in HTML, executing conversion only once at the very end. HTML enables significantly faster edits and automated checks, whereas editing PPTX leads to divergence from HTML sources. If modifications are requested after PPTX delivery, update HTML and re-convert. Unless PPTX is specified, deliver PDF.

1. Complete steps 6–9 in HTML (automated check FAIL 0, fresh-eye review, visual PDF inspection).
2. Convert: `python3 scripts/html_to_pptx.py mydeck.html` → Produces `mydeck.pptx` in the same directory (requires Node 22+, Chrome, and `pip3 install python-pptx`).
3. Run `python3 scripts/check_deck.py mydeck.pptx` until FAIL 0. Open in PowerPoint (or export to PDF) and visually inspect text wrap and shape alignments.
4. If sending externally, sanitize file metadata properties (author, organization, etc.).

Conversion Capabilities and Constraints (details in slide-rules.md §8.6):
- Fully editable shapes: Text (font, size, color, line height, wrap width, bullet styles), fills and borders (rounded corners, clip-path polygons, CSS triangles), borders, tables (merged cells, cell fills, borders, padding, vertical text).
- Rasterized images (text/values inside cannot be edited): SVG charts and diagrams, `<img>` tags, background images.
- Fonts: Replaced with standard system equivalents. Visual inspection is mandatory as minor font metric differences can alter line wrap points.
- Not reproduced: CSS `transform` rotations/skews, pseudo-element decorations (`::before`/`::after` badges). Avoid these in templates or fix them in PowerPoint after conversion.

`assets/SuperTemplate_62type.pptx` (62 archetypes, fully editable slides) is also provided as a manual reference template.

### Inserting Pages into Existing Decks

When provided with an existing destination PowerPoint deck (internal corporate template, work-in-progress proposal), do not use HTML conversion; **build directly on top of that document's master template**. Converted PPTX files carry their own font and margin defaults, which look out of place when spliced into house decks (slide-rules §8.7). General writing, table axis, and 1-slide-1-message rules still apply.

1. Measure: `python3 scripts/measure_deck.py house.pptx` → Generates `house.skin.json` (also accepts `.potx` template files). Read the summary and visually verify values against the deck.
2. Build: Use `scripts/deck_pptx.py`, guided by `examples/house_deck_example.py`. Do not hardcode fonts, background colors, or slide numbers onto slides; keep titles in placeholders; construct tables using textboxes + rules (`table()`); use the house deck's theme colors.
3. Validate: `python3 scripts/check_deck.py pages.pptx --house house.skin.json` → Achieve FAIL 0. **Always pass this check before opening in PowerPoint** (opening a corrupted XML file leaves a persistent repair dialog in PowerPoint).
4. Visually inspect all pages (using the visual QA procedures in slide-rules §8).
5. Deliver only the newly created insertion pages. The user performs the insertion into their main deck ("Keep Source Formatting" or "Use Destination Theme").

## Skill Attribution Note

The credit line `"Created with consulting-pptx-skill (github.com/carnot-tech/consulting-pptx-skill)"` is included by default in the bottom-left source line of the back cover (b10). This credit may appear **only on the final slide's source line**. If the tool name appears on any other slide, `check_deck.py` will report a FAIL (maintaining executive-ready presentation hygiene). In decks without a back cover, append it to the source line of the final content slide.

## Evolving the Skill (Updates, Custom Rules, PRs)

This skill improves through ongoing feedback from real-world usage. Perform these three actions as part of your standard workflow:

1. **Pull the latest updates.** At the start of a session, if the skill directory is a git clone, run `git fetch`. If it is behind `origin/main`, ask once: "Would you like to pull the latest version of the skill?" (recommended weekly). Pull via `git pull`. User customizations reside in `local/` and will not conflict. If core files were directly modified, move those diffs to `local/` or open a PR first.
2. **Store custom rules in `local/`.** When users specify organization-specific rules ("At our company, we do X"), do not edit core `references/slide-rules.md`; append a line to `local/slide-rules.local.md`. Place customer names and project codes in `local/forbid.txt` and check with `--forbid`. Store custom templates, house decks, and `skin.json` in `local/templates/`.
3. **Contribute generalizable improvements via PR.** When encountering false positives, false negatives, or universally applicable design improvements during work, propose once after delivery: "Would you like to submit this improvement to upstream via PR?" Follow `CONTRIBUTING.md` (1 rule line + `check_deck` check + test failing before fix and passing after fix). **Review "What NOT to include in PRs" in `CONTRIBUTING.md` before opening a PR**: Never include customer names, project codes, financial amounts, personal names, real engagement files, or `skin.json` in diffs, commit messages, or PR descriptions. Company-specific preferences belong in `local/`, not upstream. Rules changing defaults must be conditional. If accepted, proceed through `gh pr create`. If declined, do not re-prompt until the next session.

## Colors and Typography

Both component libraries default to the same warm executive palette (cream background, deep espresso ink, warm brown accent; serif headings, sans-serif body). Tokens are managed in the `:root` block of each file's `<style>` section. When modifying one, update the other to match. Cool navy palette values are provided in accompanying comments. Semantic colors (e.g., red for errors / negative deltas) must remain consistent. Restrict two-series comparisons to main brand color vs. neutral gray. Keep screenshots of product user interfaces unedited.
