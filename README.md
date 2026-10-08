# consulting-pptx-skill

**A Claude Code / Antigravity skill for producing boardroom-quality presentation decks.**
Created by the team building the AI workflow platform [Jinba](https://jinba.io/ja?utm_source=github&utm_medium=readme&utm_campaign=consulting-pptx-skill&utm_content=top_intro).

This skill brings together an executive slide design rulebook, automated linters that catch rule violations, a **62-archetype HTML slide component library** (16:9 aspect ratio, 1 section per slide, printed to PDF via headless Chrome), and a visual archetype catalog PDF.

The standard workflow is: read the rulebook → assemble slides one by one from the component library → pass automated checks with 0 FAILs → run a fresh-eye review with an independent agent that knows nothing about how the deck was built.

A Claude Code skill for generating boardroom-quality decks: a slide-design rulebook, an automated rule checker, a 62-part HTML slide library (16:9, one section per slide, printed to PDF via Chrome), and a visual catalog PDF.

This is the public release of the exact system we use internally every week to produce client proposals and executive reports.

> **For Enterprise Users**
> - Want to use this exact system directly in your browser chat without Claude Code? → [Jinba App](https://jinba.io/ja?utm_source=github&utm_medium=readme&utm_campaign=consulting-pptx-skill&utm_content=top_app)
> - Want a customized version tailored to your company's slide guidelines and brand identity, deployed organization-wide? → [Contact Sales](https://jinba.io/ja/contact-sales?utm_source=github&utm_medium=readme&utm_campaign=consulting-pptx-skill&utm_content=top_contact)

---

## The Core Value: `references/slide-rules.md`

The most valuable asset in this repository is neither the templates nor the scripts—it is the markdown document **[slide-rules.md](references/slide-rules.md)**.
"State conclusions directly in the title", "No rounded corners", "Never add borders to filled boxes", "One term per document", "Premises and definitions on the left, implications on the right"...

There are only three steps in the core workflow:
1. **Have the AI read this file before generating any slides.**
2. **Automatically detect violations using `scripts/check_deck.py` after generation.**
3. **Run a fresh-eye review using `references/content-review-prompt.md` with an independent agent that has no prior context, gathering feedback on phrasing, logic, and contradictions, and fixing accepted items.**

Because AI context resets with every session, verbal reminders do not stick. Codifying the rules into a file and loading it every time is the only reliable way to enforce standards.

Great slides are determined not by archetypes, but by **post-draft adjustments**: splitting a dense table across two slides, rewriting right-hand columns into crisp implications, reading only the titles sequentially to re-align the narrative arc. Adjusting freely beyond rigid archetypes and capturing lessons learned into `slide-rules.md` is the true source of quality. The archetype catalog and component libraries exist to produce initial drafts quickly so you can spend your time on adjustments.

When using this within your organization, cultivate your own rules and feedback by appending them to `slide-rules.md` (or `local/slide-rules.local.md`).

---

## 62-Archetype Slide Catalog

Start by exploring **[assets/SlideCatalog_16x9.pdf](assets/SlideCatalog_16x9.pdf)** (62 pages). Pages 1–27 display the base component library, and pages 28–62 show the additional component library. A complete listing of archetype IDs, names, and recommended use cases is in [references/archetype-catalog.md](references/archetype-catalog.md).

"62 archetypes" is not an upper limit on layout possibilities. In production decks, you freely combine, adapt, and deconstruct archetypes within the boundaries of the rules, creating far more visual patterns. Use the catalog as an idea book for layouts; if an archetype does not fit your story, discard it.

---

## How to Use the Component Libraries

| File | Content | Usage Frequency |
| --- | --- | --- |
| `templates/freeform_parts_16x9.html` (Base Library) | 27 components: title page, overview map, TOC, section divider, chevrons, premise-to-conclusion, tables with axes, claim panels, evaluation matrices, distribution charts, etc. | High. Start here. |
| `templates/freeform_parts_more_16x9.html` (Additional Library) | 35 components: executive summary, stacked bars, waterfalls/bridges, scatter plots, comparison tables, 2x2 matrices, issue trees, roadmaps, Gantt charts, etc. | Medium. Use when base library is insufficient. |

Both files are standalone 16:9 HTML documents (1 section = 1 slide). Specifying component IDs with `scripts/new_deck.py --parts b01,m05,...` extracts only the needed components into a single HTML deck (the script automatically merges style definitions without class collisions). Replace placeholder text (`Text 1`, `Label 1`, `Title 1`, `00`, `YYYY`, `Source: Source 1`) with your real content. Remaining placeholders will trigger FAILs in `check_deck.py`.

The title placeholder of each section contains only the archetype name, without sample assertions. Sample assertions tend to bias the author into copying that specific sentence pattern (slide-rules §2.8). Always write titles directly from your storyline.

**Colors and typography share the same defaults across both files** (Warm palette: cream background, deep espresso ink, warm brown accent; serif headings, sans-serif body). Styles are managed via `:root` CSS variables at the top of each file's `<style>` block. Cool navy palette values are provided in accompanying comments.

---

## Setup

```bash
# 1. Clone into your Claude Code skills directory (enables rules, components, and automated checks immediately)
git clone https://github.com/carnot-tech/consulting-pptx-skill.git ~/.claude/skills/consulting-pptx-skill

# 2. (Optional) For live rendering layout checks via check_layout.mjs. Requires Node.js. Installs Playwright and Chromium.
cd ~/.claude/skills/consulting-pptx-skill && npm run setup

# 3. (Optional) For PPTX conversion or inspecting PPTX files with check_deck.py (requires Node.js 22+ and Chrome)
pip3 install python-pptx
```

- `scripts/check_deck.py` (rule checker) and `scripts/new_deck.py` (draft generator) run entirely on Python's standard library with zero external dependencies.
- PDF generation uses headless Google Chrome print (see command below).
- `package.json` exists solely for installing Playwright in Step 2. `node_modules/` is already in `.gitignore`.

---

## Updates and Customization

The rules and automated checks evolve frequently based on real user feedback. **We recommend pulling the latest version weekly**:

```bash
cd ~/.claude/skills/consulting-pptx-skill && git pull
```

Store your organization's custom rules, forbidden terms, and templates in `local/` (see `local/README.md`; untracked in git, so `git pull` will never overwrite them). The skill reads core rules first, then applies `local/slide-rules.local.md`, giving precedence to local rules when they overlap. Modifying core files directly causes merge conflicts on updates; place organization-specific rules in `local/` and submit universally applicable rules upstream via Pull Request.

---

## Manual CLI Usage

```bash
# List part numbers and archetype names
python3 scripts/new_deck.py --list

# Generate a starter deck
python3 scripts/new_deck.py --parts b01,b02,m05,b06,b09,b10 --title "Project Strategy" -o mydeck.html

# Automated rule check (must achieve FAIL 0)
python3 scripts/check_deck.py mydeck.html

# Check for residual client names / internal jargon before external release (list kept outside repo)
python3 scripts/check_deck.py mydeck.html --forbid ~/.config/deck-forbidden-terms.txt

# Inspect live rendering for footer overlaps, overflow, and excessive whitespace
node scripts/check_layout.mjs mydeck.html

# Print to PDF via Chrome
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu \
  --no-pdf-header-footer --print-to-pdf=mydeck.pdf mydeck.html

# Convert to editable PPTX (only when explicitly requested)
python3 scripts/html_to_pptx.py mydeck.html
```

---

## Converting to PowerPoint (.pptx)

**Always finalize your deck in HTML first. Convert to PPTX only when explicitly requested by the user.**

1. Assemble the deck in HTML, running automated checks, reviews, and visual PDF verification on HTML (edits are faster, and linters run seamlessly).
2. When asked for PPTX, convert via `scripts/html_to_pptx.py`. It inspects Chrome's rendered output and reconstructs elements as PowerPoint native shapes, keeping text, tables, and shapes fully editable.
3. If revisions arrive after PPTX delivery, modify the HTML source and re-convert (editing PPTX directly causes content divergence).

SVG charts and external graphics are embedded as high-resolution images (numerical data inside them cannot be edited). Fonts are mapped to standard system fonts (Yu Gothic / Yu Mincho, Helvetica / Georgia). Always open in PowerPoint to verify text wrapping after conversion.

### Adding Pages to an Existing PowerPoint Deck

When adding pages to an existing corporate deck or in-progress proposal, a converted PPTX will not match the typography, font sizes, or table conventions of the original. In this scenario, do not convert HTML; **build directly on top of the destination deck's master template**.

```bash
# Measure the source deck's styles -> house.skin.json (inspect and adjust). Supports .potx templates too.
python3 scripts/measure_deck.py house.pptx

# Build 2 insertion pages on top of the source deck's master template (sample script)
python3 examples/house_deck_example.py house.pptx pages.pptx

# Verify compliance with house styles
python3 scripts/check_deck.py pages.pptx --house house.skin.json
```

Titles occupy native layout placeholders, while typography, slide background, and page numbering are governed by the master template. Tables are constructed using textboxes and borders matching the source deck, ensuring formatting stays intact upon insertion. See slide-rules.md §8.7 for full details.

---

## Repository Contents

| Path | Description |
| --- | --- |
| `SKILL.md` | Core AI skill specification. Contains methodology and workflow, linking to `references/` for details. |
| `templates/freeform_parts_16x9.html` | Base component library (27 components, 1 component = 1 slide, 16:9). |
| `templates/freeform_parts_more_16x9.html` | Additional component library (35 components: charts, comparisons, matrices, planning). |
| `references/slide-rules.md` | The canonical slide design rulebook. |
| `references/archetype-catalog.md` | Catalog of 62 slide archetypes (ID, name, use cases, source component numbers). |
| `references/content-review-prompt.md` | Fresh-eye review instructions. Used by an independent agent to catch logic, flow, and phrasing issues without knowing creation history. |
| `references/ai-smell-lexicon.md` | AI smell / slop vocabulary, syntax markers, and self-check guide. |
| `scripts/new_deck.py` | Assembles a single HTML deck from specified part numbers (scoped CSS merging, page renumbering). |
| `scripts/check_deck.py` | Automated rule linter (supports both HTML and PPTX; `--template` for checking libraries). Catches count discrepancies between titles and body. |
| `scripts/html_to_pptx.py` | Converts HTML decks to editable PPTX. `html_dump.mjs` renders elements in Chrome, and `python-pptx` reassembles them. No extra npm packages needed (`lib_cdp.mjs` speaks CDP directly). |
| `scripts/check_layout.mjs` | Live rendering layout checker (footer overlaps, right/bottom overflow, >40% empty canvas space). |
| `scripts/measure_deck.py` | Measures styles of existing PowerPoint decks (layout, title frames, font sizes, borders, colors) and writes `skin.json`. |
| `scripts/deck_pptx.py` | Builds editable slides directly on top of a measured master template (titles, tables, callout panels, chevrons, status icons). Sample in `examples/house_deck_example.py`. |
| `tests/` | Linter self-tests (`python3 -m unittest discover -s tests`). Verifies that rules fail on unfixed versions and pass on fixed versions. |
| `assets/SlideCatalog_16x9.pdf` | **62-archetype slide catalog (62 pages printed from both libraries). Starting point for visual layout selection.** |
| `assets/SuperTemplate_62type.pptx` | 62-archetype PPTX reference deck (all slides editable). Reference for manual PowerPoint assembly. |

---

## Customization

- Colors and fonts can be customized in the `:root` tokens at the beginning of each component file's `<style>` block. Keep both files synchronized when tailoring to your brand.
- Add the `"Created with consulting-pptx-skill"` attribution **only on the final slide's source line**. If the tool name appears on any other slide, `check_deck.py` reports a FAIL.
- When PPTX is required, finalize in HTML first, then convert via `scripts/html_to_pptx.py`.

---

## Contributing

Issues and Pull Requests are warmly welcomed. Please read [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines (coupling rules with automated tests, keeping confidential data out of PRs, writing tests, etc.).

If you discover a rule during production that benefits everyone, that is the best seed for a PR. The skill is designed to prompt once: "Would you like to open a PR for this improvement?" when encountering false positives or new generalizable rules. Reviewing non-confidential rules accumulated in `local/` once a month and submitting them upstream is highly recommended.

---

## About

Created by [Carnot AI](https://jinba.io/ja?utm_source=github&utm_medium=readme&utm_campaign=consulting-pptx-skill&utm_content=about) — developers of the AI agent platform "Jinba".

- **For browser-only users**: This same mechanism is available as a turnkey chat application ([Jinba App](https://jinba.io/ja?utm_source=github&utm_medium=readme&utm_campaign=consulting-pptx-skill&utm_content=about_app)) without requiring Claude Code or Python environments.
- **For enterprise custom deployments**: We help organizations build tailored `slide-rules.md` and design systems from their existing presentation archives and executive review feedback, deploying them across internal teams. [Contact Sales](https://jinba.io/ja/contact-sales?utm_source=github&utm_medium=readme&utm_campaign=consulting-pptx-skill&utm_content=about_contact).

---

## License

Code and documentation are licensed under the [MIT License](LICENSE). The MIT License does not include rights to use trademarks. Treatment of "Carnot", "Carnot AI", "Jinba", and associated logos is governed by [TRADEMARK.md](TRADEMARK.md) (truthful references, credit lines, and links are free; product names, logos, official endorsements, and trademark usage on derivative works require written permission).
